// src/features/community/store/communityStore.js
// Reactive Zustand store for MindBloom Community Baraza
// Purely real, persistent user data with zero dummy mocks.

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  WINS: 'mindbloom:community:wins:v3',
  VENTS: 'mindbloom:community:vents:v3',
  NOTIFIED_MENTORS: 'mindbloom:community:notified_mentors:v1',
  JOINED_CIRCLES: 'mindbloom:community:joined_circles:v1',
  REPORTED_MSGS: 'mindbloom:community:reported_msgs:v1',
};

function formatTimestamp(date = new Date()) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

export const useCommunityStore = create((set, get) => ({
  wins: [],
  vents: [],
  notifiedMentors: {},
  joinedCircleIds: [],
  reportedMessageIds: [],
  isHydrated: false,

  // Hydrate persistent data from AsyncStorage
  hydrate: async () => {
    try {
      const [savedWins, savedVents, savedMentors, savedJoined, savedReported] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.WINS),
        AsyncStorage.getItem(STORAGE_KEYS.VENTS),
        AsyncStorage.getItem(STORAGE_KEYS.NOTIFIED_MENTORS),
        AsyncStorage.getItem(STORAGE_KEYS.JOINED_CIRCLES),
        AsyncStorage.getItem(STORAGE_KEYS.REPORTED_MSGS),
      ]);

      const wins = savedWins ? JSON.parse(savedWins) : [];
      const vents = savedVents ? JSON.parse(savedVents) : [];
      const notifiedMentors = savedMentors ? JSON.parse(savedMentors) : {};
      const joinedCircleIds = savedJoined ? JSON.parse(savedJoined) : [];
      const reportedMessageIds = savedReported ? JSON.parse(savedReported) : [];

      set({ wins, vents, notifiedMentors, joinedCircleIds, reportedMessageIds, isHydrated: true });
    } catch {
      set({ wins: [], vents: [], joinedCircleIds: [], reportedMessageIds: [], isHydrated: true });
    }
  },

  // Circle Join / Leave membership
  joinCircle: async (circleId) => {
    if (!circleId) return;
    const current = get().joinedCircleIds;
    if (current.includes(circleId)) return;
    const next = [circleId, ...current];
    set({ joinedCircleIds: next });
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.JOINED_CIRCLES, JSON.stringify(next));
    } catch {}
  },

  leaveCircle: async (circleId) => {
    const next = get().joinedCircleIds.filter((id) => id !== circleId);
    set({ joinedCircleIds: next });
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.JOINED_CIRCLES, JSON.stringify(next));
    } catch {}
  },

  toggleJoinCircle: async (circleId) => {
    if (get().joinedCircleIds.includes(circleId)) {
      await get().leaveCircle(circleId);
    } else {
      await get().joinCircle(circleId);
    }
  },

  // Report / Hide message for safety
  reportMessage: async (msgId) => {
    if (!msgId) return;
    const current = get().reportedMessageIds;
    if (current.includes(msgId)) return;
    const next = [...current, msgId];
    set({ reportedMessageIds: next });
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REPORTED_MSGS, JSON.stringify(next));
    } catch {}
  },

  // Persistent Small Wins logic (supports text, voiceNote, or both)
  addWin: async (text = '', category = 'personal', author = 'You · MindBloom', voiceNote = null) => {
    const trimmed = (text || '').trim();
    if (!trimmed && !voiceNote) return;

    const newWin = {
      id: `win-${Date.now()}`,
      text: trimmed,
      voiceNote,
      author,
      category,
      cheers: 1,
      hasCheered: true,
      createdAt: `Today at ${formatTimestamp()}`,
    };

    const nextWins = [newWin, ...get().wins];
    set({ wins: nextWins });

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WINS, JSON.stringify(nextWins));
    } catch {}
  },

  toggleCheerWin: async (id) => {
    const nextWins = get().wins.map((w) => {
      if (w.id === id) {
        const nextCheered = !w.hasCheered;
        return {
          ...w,
          hasCheered: nextCheered,
          cheers: nextCheered ? w.cheers + 1 : Math.max(0, w.cheers - 1),
        };
      }
      return w;
    });

    set({ wins: nextWins });

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WINS, JSON.stringify(nextWins));
    } catch {}
  },

  // Safe Vent Box logic (Ephemeral release, supports text and/or voiceNote)
  addVent: async (text = '', voiceNote = null) => {
    const trimmed = (text || '').trim();
    if (!trimmed && !voiceNote) return;

    const newVent = {
      id: `vent-${Date.now()}`,
      text: trimmed,
      voiceNote,
      createdAt: `Today at ${formatTimestamp()}`,
      hugs: 0,
      hasHugged: false,
      candles: 0,
      hasCandle: false,
    };

    const nextVents = [newVent, ...get().vents];
    set({ vents: nextVents });

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.VENTS, JSON.stringify(nextVents));
    } catch {}
  },

  deleteVent: async (id) => {
    const nextVents = get().vents.filter((v) => v.id !== id);
    set({ vents: nextVents });
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.VENTS, JSON.stringify(nextVents));
    } catch {}
  },

  toggleHugVent: async (id) => {
    const nextVents = get().vents.map((v) => {
      if (v.id === id) {
        const nextHugged = !v.hasHugged;
        return {
          ...v,
          hasHugged: nextHugged,
          hugs: nextHugged ? v.hugs + 1 : Math.max(0, v.hugs - 1),
        };
      }
      return v;
    });

    set({ vents: nextVents });

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.VENTS, JSON.stringify(nextVents));
    } catch {}
  },

  toggleCandleVent: async (id) => {
    const nextVents = get().vents.map((v) => {
      if (v.id === id) {
        const nextCandle = !v.hasCandle;
        return {
          ...v,
          hasCandle: nextCandle,
          candles: nextCandle ? v.candles + 1 : Math.max(0, v.candles - 1),
        };
      }
      return v;
    });

    set({ vents: nextVents });

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.VENTS, JSON.stringify(nextVents));
    } catch {}
  },

  deleteVent: async (id) => {
    const nextVents = get().vents.filter((v) => v.id !== id);
    set({ vents: nextVents });
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.VENTS, JSON.stringify(nextVents));
    } catch {}
  },

  // Mentor notification subscriptions
  toggleNotifyMentor: async (mentorId) => {
    const current = get().notifiedMentors;
    const next = {
      ...current,
      [mentorId]: !current[mentorId],
    };

    set({ notifiedMentors: next });

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFIED_MENTORS, JSON.stringify(next));
    } catch {}
  },
}));

// Auto-hydrate store on import
useCommunityStore.getState().hydrate();
