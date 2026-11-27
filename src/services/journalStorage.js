// src/services/journalStorage.js
// Local-First Encrypted Persistent Storage for MindBloom Private Journal Entries
// Stores journal data through the shared encrypted local-storage layer.

import { encryptedStorage } from './encryptedStorage';

const JOURNAL_STORAGE_KEY = '@mindbloom:journal_entries';

export const journalStorage = {
  /**
   * Get all saved journal entries
   */
  async getEntries() {
    const data = await encryptedStorage.getItem(JOURNAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  /**
   * Save entire list of entries
   */
  async saveEntries(entries) {
    try {
      return await encryptedStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));
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
      if (!(await this.saveEntries(updated))) {
        throw new Error('Encrypted journal storage is unavailable.');
      }
      return updated;
    } catch (err) {
      console.warn('[journalStorage] Failed to save entry:', err);
      throw err;
    }
  },

  /**
   * Delete an entry by ID
   */
  async deleteEntry(id) {
    try {
      const current = await this.getEntries();
      const updated = current.filter((e) => e.id !== id);
      if (!(await this.saveEntries(updated))) {
        throw new Error('Encrypted journal storage is unavailable.');
      }
      return updated;
    } catch (err) {
      console.warn('[journalStorage] Failed to delete entry:', err);
      throw err;
    }
  },
};
