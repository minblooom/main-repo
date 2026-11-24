// src/features/community/hooks/useCheckIns.js
import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { todayKey } from '../utils/dateKeys';

const KEY = 'mindbloom:community:checkIns';
const MAX_STORED = 120;

export const useCheckIns = () => {
  const [checkIns, setCheckIns] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (active && raw) setCheckIns(JSON.parse(raw));
      } catch {}
    })();
    return () => { active = false; };
  }, []);

  const persist = useCallback(async (next) => {
    try {
      await AsyncStorage.setItem(KEY, JSON.stringify(next));
      setCheckIns(next);
      return true;
    } catch {
      return false;
    }
  }, []);

  const todayCheckIn = checkIns.find((c) => c.date === todayKey()) ?? null;

  // One check-in per day: saving again replaces today's entry.
  const saveCheckIn = useCallback(
    (mood, note = '') => {
      const entry = { date: todayKey(), mood, note: note.trim(), savedAt: new Date().toISOString() };
      return persist([entry, ...checkIns.filter((c) => c.date !== entry.date)].slice(0, MAX_STORED));
    },
    [checkIns, persist]
  );

  const updateCheckIn = useCallback(
    (date, { mood, note = '' }) =>
      persist(
        checkIns.map((c) =>
          c.date === date ? { ...c, mood, note: note.trim(), savedAt: new Date().toISOString() } : c
        )
      ),
    [checkIns, persist]
  );

  const deleteCheckIn = useCallback(
    (date) => persist(checkIns.filter((c) => c.date !== date)),
    [checkIns, persist]
  );

  return { checkIns, todayCheckIn, saveCheckIn, updateCheckIn, deleteCheckIn };
};