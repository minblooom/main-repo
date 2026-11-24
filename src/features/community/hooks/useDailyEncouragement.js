// src/features/community/hooks/useDailyEncouragement.js
import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENCOURAGEMENT_MESSAGES } from '../data/encouragementMessages';
import { todayKey } from '../utils/dateKeys';

const STORAGE_KEY = 'mindbloom:community:encouragement';

const dailyIndex = (dateKey) => {
  const seed = [...dateKey].reduce((sum, c) => sum + c.charCodeAt(0), 0);
  return seed % ENCOURAGEMENT_MESSAGES.length;
};

export const useDailyEncouragement = () => {
  const [index, setIndex] = useState(() => dailyIndex(todayKey()));

  // Restore the user's "show me another" choice if it's from today
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const saved = raw ? JSON.parse(raw) : null;
        if (active && saved?.date === todayKey()) setIndex(saved.index);
      } catch {}
    })();
    return () => { active = false; };
  }, []);

  const another = useCallback(async () => {
    const step = 1 + Math.floor(Math.random() * (ENCOURAGEMENT_MESSAGES.length - 1));
    const next = (index + step) % ENCOURAGEMENT_MESSAGES.length;
    setIndex(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ date: todayKey(), index: next }));
    } catch {}
  }, [index]);

  return { message: ENCOURAGEMENT_MESSAGES[index], another };
};