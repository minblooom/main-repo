// src/services/encryptedStorage.js
// Authenticated local encryption for sensitive user content.
// Native devices use XChaCha20-Poly1305 with a SecureStore key; web uses AES-GCM
// with a non-extractable CryptoKey stored in IndexedDB.

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { xchacha20poly1305 } from '@noble/ciphers/chacha.js';
import { bytesToHex, hexToBytes, utf8ToBytes, bytesToUtf8 } from '@noble/ciphers/utils.js';

const VAULT_KEY_NAME = 'mindbloom_local_vault_key_v1';
const ENVELOPE_PREFIX = 'enc:v1:';
const WEB_ENVELOPE_PREFIX = 'enc:web:v1:';
const WEB_KEY_DATABASE = 'mindbloom_secure_vault';
const WEB_KEY_STORE = 'keys';
const WEB_KEY_NAME = 'vault-key-v1';

let cachedKeyBytes = null;
let keyInitPromise = null;
let cachedWebKey = null;
let webKeyInitPromise = null;

function openWebKeyDatabase() {
  if (!globalThis.indexedDB) {
    throw new Error('Browser secure storage is unavailable.');
  }

  return new Promise((resolve, reject) => {
    const request = globalThis.indexedDB.open(WEB_KEY_DATABASE, 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(WEB_KEY_STORE)) {
        database.createObjectStore(WEB_KEY_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Could not open browser secure storage.'));
    request.onblocked = () => reject(new Error('Browser secure storage is blocked by another tab.'));
  });
}

async function readWebVaultKey() {
  const database = await openWebKeyDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(WEB_KEY_STORE, 'readonly');
    const request = transaction.objectStore(WEB_KEY_STORE).get(WEB_KEY_NAME);
    let key = null;
    request.onsuccess = () => {
      key = request.result || null;
    };
    request.onerror = () => reject(request.error || new Error('Could not read the browser encryption key.'));
    transaction.oncomplete = () => {
      database.close();
      resolve(key);
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error || new Error('Could not read the browser encryption key.'));
    };
  });
}

async function storeWebVaultKey(key) {
  const database = await openWebKeyDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(WEB_KEY_STORE, 'readwrite');
    transaction.objectStore(WEB_KEY_STORE).add(key, WEB_KEY_NAME);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error || new Error('Could not store the browser encryption key.'));
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error || new Error('Could not store the browser encryption key.'));
    };
  });
}

async function getOrCreateWebVaultKey() {
  if (cachedWebKey) return cachedWebKey;
  if (webKeyInitPromise) return webKeyInitPromise;

  webKeyInitPromise = (async () => {
    const webCrypto = globalThis.crypto;
    if (!webCrypto?.subtle || !globalThis.indexedDB) {
      throw new Error('Encrypted browser storage is unavailable.');
    }

    const existingKey = await readWebVaultKey();
    if (existingKey) {
      cachedWebKey = existingKey;
      return existingKey;
    }

    const generatedKey = await webCrypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt'],
    );
    try {
      await storeWebVaultKey(generatedKey);
      cachedWebKey = generatedKey;
      return generatedKey;
    } catch (error) {
      // Another browser tab may have created the key at the same time.
      const keyCreatedByOtherTab = await readWebVaultKey();
      if (keyCreatedByOtherTab) {
        cachedWebKey = keyCreatedByOtherTab;
        return keyCreatedByOtherTab;
      }
      throw error;
    }
  })();

  try {
    return await webKeyInitPromise;
  } finally {
    webKeyInitPromise = null;
  }
}

async function getOrCreateVaultKey() {
  if (cachedKeyBytes) return cachedKeyBytes;
  if (keyInitPromise) return keyInitPromise;

  keyInitPromise = (async () => {
    try {
      let hexKey = await SecureStore.getItemAsync(VAULT_KEY_NAME);
      if (!hexKey || hexKey.length !== 64) {
        const randomBytes = await Crypto.getRandomBytesAsync(32);
        hexKey = bytesToHex(randomBytes);
        await SecureStore.setItemAsync(VAULT_KEY_NAME, hexKey);
      }
      cachedKeyBytes = hexToBytes(hexKey);
      return cachedKeyBytes;
    } catch (err) {
      console.warn('[encryptedStorage] SecureStore unavailable; refusing plaintext fallback:', err?.message);
      throw new Error('Secure local encryption is unavailable.');
    } finally {
      keyInitPromise = null;
    }
  })();

  return keyInitPromise;
}

async function encryptString(plaintext) {
  if (Platform.OS === 'web') {
    const webCrypto = globalThis.crypto;
    const key = await getOrCreateWebVaultKey();
    const iv = webCrypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await webCrypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      utf8ToBytes(plaintext),
    );
    return `${WEB_ENVELOPE_PREFIX}${bytesToHex(iv)}:${bytesToHex(new Uint8Array(ciphertext))}`;
  }

  const key = await getOrCreateVaultKey();
  const nonce = await Crypto.getRandomBytesAsync(24);
  const cipher = xchacha20poly1305(key, nonce);
  const ciphertext = cipher.encrypt(utf8ToBytes(plaintext));
  return `${ENVELOPE_PREFIX}${bytesToHex(nonce)}:${bytesToHex(ciphertext)}`;
}

async function decryptString(storedValue) {
  if (typeof storedValue !== 'string') {
    return storedValue;
  }

  if (storedValue.startsWith(WEB_ENVELOPE_PREFIX)) {
    if (Platform.OS !== 'web') throw new Error('This encrypted record belongs to a different device.');
    const webCrypto = globalThis.crypto;
    const key = await getOrCreateWebVaultKey();
    const body = storedValue.slice(WEB_ENVELOPE_PREFIX.length);
    const sepIdx = body.indexOf(':');
    if (sepIdx <= 0) throw new Error('Encrypted browser data is malformed.');
    const iv = hexToBytes(body.slice(0, sepIdx));
    const ciphertext = hexToBytes(body.slice(sepIdx + 1));
    const plaintext = await webCrypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
    return bytesToUtf8(new Uint8Array(plaintext));
  }

  if (!storedValue.startsWith(ENVELOPE_PREFIX)) {
    if (storedValue.startsWith('enc:')) throw new Error('Unsupported encrypted storage format.');
    return storedValue;
  }
  if (Platform.OS === 'web') throw new Error('This encrypted record belongs to a different device.');

  const key = await getOrCreateVaultKey();
  const body = storedValue.slice(ENVELOPE_PREFIX.length);
  const sepIdx = body.indexOf(':');
  if (sepIdx <= 0) throw new Error('Encrypted local data is malformed.');

  const nonce = hexToBytes(body.slice(0, sepIdx));
  const ciphertext = hexToBytes(body.slice(sepIdx + 1));
  const cipher = xchacha20poly1305(key, nonce);
  const plainBytes = cipher.decrypt(ciphertext);
  return bytesToUtf8(plainBytes);
}

export const encryptedStorage = {
  /**
   * Read and decrypt a string value. Legacy plaintext values are migrated
   * before being returned.
   */
  async getItem(key) {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (raw == null) return null;

      if (raw.startsWith(ENVELOPE_PREFIX) || raw.startsWith(WEB_ENVELOPE_PREFIX)) {
        return await decryptString(raw);
      }

      const encrypted = await encryptString(raw);
      await AsyncStorage.setItem(key, encrypted);
      return raw;
    } catch (err) {
      console.warn('[encryptedStorage] Failed to read key:', key, err?.message);
      throw err;
    }
  },

  /**
   * Encrypt and store a string value.
   */
  async setItem(key, value) {
    try {
      const payload = await encryptString(String(value));
      await AsyncStorage.setItem(key, payload);
      return true;
    } catch (err) {
      console.warn('[encryptedStorage] Failed to write key:', key, err?.message);
      return false;
    }
  },

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};
