// src/features/community/store/communityStore.js
// Centralized reactive Zustand store for MindBloom Community Baraza
// Ported from react-frontend with real-time cheering, anonymous venting, hugs, and candles.

import { create } from 'zustand';

const INITIAL_WINS = [
  {
    id: 'win-1',
    text: 'Made my bed, drank a warm cup of lemon water, and did not open social media first thing 🌱',
    author: 'Wanjiru · Nairobi',
    category: 'personal',
    cheers: 28,
    hasCheered: false,
    createdAt: '15m ago',
  },
  {
    id: 'win-2',
    text: 'Submitted my assignment without spiraling into panic or waiting for 11:59 PM 📚',
    author: 'Brian · Juja',
    category: 'school',
    cheers: 45,
    hasCheered: true,
    createdAt: '1h ago',
  },
  {
    id: 'win-3',
    text: 'Stood up for myself in a toxic workplace meeting with soft calmness and zero apologies 💼',
    author: 'Kavata · Westlands',
    category: 'work',
    cheers: 52,
    hasCheered: false,
    createdAt: '3h ago',
  },
  {
    id: 'win-4',
    text: 'Ate lunch peacefully without guilt. My body is worthy of nourishing 🌺',
    author: 'Neema · Mombasa',
    category: 'healing',
    cheers: 39,
    hasCheered: false,
    createdAt: '5h ago',
  },
];

const INITIAL_VENTS = [
  {
    id: 'vent-1',
    text: 'Tired of being the "strong eldest daughter" who holds everyone together while crumbling quietly in the dark.',
    createdAt: '22m ago',
    hugs: 34,
    hasHugged: true,
    candles: 18,
    hasCandle: false,
  },
  {
    id: 'vent-2',
    text: 'Applied for 40 internships this month. Getting automated rejection emails feels like a punch in the chest every morning.',
    createdAt: '1h ago',
    hugs: 56,
    hasHugged: false,
    candles: 29,
    hasCandle: true,
  },
  {
    id: 'vent-3',
    text: 'My family thinks mental health struggles are just "lack of prayer" or "idleness". It hurts so much not to be understood.',
    createdAt: '3h ago',
    hugs: 81,
    hasHugged: false,
    candles: 44,
    hasCandle: false,
  },
];

export const useCommunityStore = create((set) => ({
  wins: INITIAL_WINS,
  vents: INITIAL_VENTS,

  addWin: (text, category = 'personal', author = 'You · MindBloom') => {
    const newWin = {
      id: `win-${Date.now()}`,
      text: text.trim(),
      author,
      category,
      cheers: 1,
      hasCheered: true,
      createdAt: 'Just now',
    };
    set((state) => ({
      wins: [newWin, ...state.wins],
    }));
  },

  toggleCheerWin: (id) => {
    set((state) => ({
      wins: state.wins.map((w) => {
        if (w.id === id) {
          const nextCheered = !w.hasCheered;
          return {
            ...w,
            hasCheered: nextCheered,
            cheers: nextCheered ? w.cheers + 1 : Math.max(0, w.cheers - 1),
          };
        }
        return w;
      }),
    }));
  },

  addVent: (text) => {
    const newVent = {
      id: `vent-${Date.now()}`,
      text: text.trim(),
      createdAt: 'Just now',
      hugs: 0,
      hasHugged: false,
      candles: 0,
      hasCandle: false,
    };
    set((state) => ({
      vents: [newVent, ...state.vents],
    }));
  },

  toggleHugVent: (id) => {
    set((state) => ({
      vents: state.vents.map((v) => {
        if (v.id === id) {
          const nextHugged = !v.hasHugged;
          return {
            ...v,
            hasHugged: nextHugged,
            hugs: nextHugged ? v.hugs + 1 : Math.max(0, v.hugs - 1),
          };
        }
        return v;
      }),
    }));
  },

  toggleCandleVent: (id) => {
    set((state) => ({
      vents: state.vents.map((v) => {
        if (v.id === id) {
          const nextCandle = !v.hasCandle;
          return {
            ...v,
            hasCandle: nextCandle,
            candles: nextCandle ? v.candles + 1 : Math.max(0, v.candles - 1),
          };
        }
        return v;
      }),
    }));
  },
}));
