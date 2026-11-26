// src/services/chillLibraryStorage.js
// Offline-first AsyncStorage persistence for user-saved Chill Space items
// (stories, essays, podcasts, and soundscapes). Empty until the user saves something.

import AsyncStorage from '@react-native-async-storage/async-storage';

const CHILL_LIBRARY_KEY = '@mindbloom_chill_library_v1';

export const chillLibraryStorage = {
  async getAll() {
    try {
      const raw = await AsyncStorage.getItem(CHILL_LIBRARY_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  async isSaved(id) {
    if (!id) return false;
    const items = await this.getAll();
    return items.some((item) => String(item.id) === String(id));
  },

  async saveItem(item) {
    if (!item || !item.id) return [];
    const items = await this.getAll();
    const filtered = items.filter((existing) => String(existing.id) !== String(item.id));
    const normalized = {
      id: String(item.id),
      category: item.category || 'Story',
      title: item.title || 'Saved Reflection',
      desc: item.desc || '',
      body: item.body || item.desc || '',
      author: item.author || '',
      duration: item.duration || '',
      audioUrl: item.audioUrl || null,
      date: item.date || 'SAVED FROM CHILL SPACE',
      bg: item.bg || '#EDF5EE',
      color: item.color || '#2C5A38',
      icon: item.icon || '🌿',
      savedAt: Date.now(),
    };
    const next = [normalized, ...filtered];
    try {
      await AsyncStorage.setItem(CHILL_LIBRARY_KEY, JSON.stringify(next));
    } catch {}
    return next;
  },

  async removeItem(id) {
    const items = await this.getAll();
    const next = items.filter((item) => String(item.id) !== String(id));
    try {
      await AsyncStorage.setItem(CHILL_LIBRARY_KEY, JSON.stringify(next));
    } catch {}
    return next;
  },

  async toggleSave(item) {
    if (!item || !item.id) return { isSaved: false, items: [] };
    const items = await this.getAll();
    const exists = items.some((existing) => String(existing.id) === String(item.id));
    if (exists) {
      const next = await this.removeItem(item.id);
      return { isSaved: false, items: next };
    }
    const next = await this.saveItem(item);
    return { isSaved: true, items: next };
  },
};
