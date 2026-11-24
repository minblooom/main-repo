// src/services/encryptedStorage.js
// Authenticated local encryption (XChaCha20-Poly1305) backed by expo-secure-store
// for sensitive user content (journal entries, Safe Vent posts, voice notes, community messages).

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { xchacha20poly1305 } from '@noble/ciphers/chacha.js';
import { bytesToHex, hexToBytes, utf8ToBytes, bytesToUtf8 } from '@noble/ciphers/utils.js';

const VAULT_KEY_NAME = 'mindbloom_local_vault_key_v1';
const ENVELOPE_PREFIX = 'enc:v1:';

let cachedKeyBytes = null;
let keyInitPromise = null;

async function getOrCreateVaultKey() {
  if (Platform.OS === 'web') return null;
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
      console.warn('[encryptedStorage] SecureStore unavailable, falling back:', err?.message);
      return null;
    } finally {
      keyInitPromise = null;
    }
  })();

  return keyInitPromise;
}

async function encryptString(plaintext) {
  const key = await getOrCreateVaultKey();
  if (!key) return plaintext;

  const nonce = await Crypto.getRandomBytesAsync(24);
  const cipher = xchacha20poly1305(key, nonce);
  const ciphertext = cipher.encrypt(utf8ToBytes(plaintext));
  return `${ENVELOPE_PREFIX}${bytesToHex(nonce)}:${bytesToHex(ciphertext)}`;
}

async function decryptString(storedValue) {
  if (typeof storedValue !== 'string' || !storedValue.startsWith(ENVELOPE_PREFIX)) {
    return storedValue;
  }
  const key = await getOrCreateVaultKey();
  if (!key) return null;

  const body = storedValue.slice(ENVELOPE_PREFIX.length);
  const sepIdx = body.indexOf(':');
  if (sepIdx <= 0) return null;

  const nonce = hexToBytes(body.slice(0, sepIdx));
  const ciphertext = hexToBytes(body.slice(sepIdx + 1));
  const cipher = xchacha20poly1305(key, nonce);
  const plainBytes = cipher.decrypt(ciphertext);
  return bytesToUtf8(plainBytes);
}

export const encryptedStorage = {
  /**
   * Read and decrypt a string value. Transparently reads legacy plaintext values
   * and migrates them to encrypted format on native devices.
   */
  async getItem(key) {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (raw == null) return null;

      if (raw.startsWith(ENVELOPE_PREFIX)) {
        return await decryptString(raw);
      }

      // Legacy plaintext migration on native
      if (Platform.OS !== 'web') {
        try {
          const encrypted = await encryptString(raw);
          if (encrypted !== raw) {
            await AsyncStorage.setItem(key, encrypted);
          }
        } catch {
          // Keep readable even if migration write fails
        }
      }
      return raw;
    } catch (err) {
      console.warn('[encryptedStorage] Failed to read key:', key, err?.message);
      return null;
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
