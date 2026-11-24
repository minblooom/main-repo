// src/services/journalStorage.js
// Local-First Encrypted Persistent Storage for MindBloom Private Journal Entries
// Guarantees that personal reflections remain encrypted on the user's phone.

import { encryptedStorage } from './encryptedStorage';

const JOURNAL_STORAGE_KEY = '@mindbloom:journal_entries';

export const journalStorage = {
  /**
   * Get all saved journal entries
   */
  async getEntries() {
    try {
      const data = await encryptedStorage.getItem(JOURNAL_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.warn('[journalStorage] Failed to read entries:', err);
      return [];
    }
  },

  /**
   * Save entire list of entries
   */
  async saveEntries(entries) {
    try {
      await encryptedStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));
      return true;
    } catch (err) {
      console.warn('[journalStorage] Failed to save entries:', err);
      return false;
    }
  },

  /**
   * Add or update an entry
   */
  async saveEntry(entry) {
    try {
      const current = await this.getEntries();
      const existingIdx = current.findIndex((e) => e.id === entry.id);
      let updated;
      if (existingIdx >= 0) {
        updated = [...current];
        updated[existingIdx] = entry;
      } else {
        updated = [entry, ...current];
      }
      await this.saveEntries(updated);
      return updated;
    } catch (err) {
      console.warn('[journalStorage] Failed to save entry:', err);
      return [];
    }
  },

  /**
   * Delete an entry by ID
   */
  async deleteEntry(id) {
    try {
      const current = await this.getEntries();
      const updated = current.filter((e) => e.id !== id);
      await this.saveEntries(updated);
      return updated;
    } catch (err) {
      console.warn('[journalStorage] Failed to delete entry:', err);
      return [];
    }
  },
};
