// src/features/community/hooks/useGoals.js
import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { todayKey } from '../utils/dateKeys';

const KEY = 'mindbloom:community:goals';
export const MAX_GOALS = 3;

const newId = () => `goal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const useGoals = () => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (active && raw) setGoals(JSON.parse(raw));
      } catch {}
    })();
    return () => { active = false; };
  }, []);

  const commit = useCallback(async (next) => {
    try {
      await AsyncStorage.setItem(KEY, JSON.stringify(next));
      setGoals(next);
      return true;
    } catch {
      return false;
    }
  }, []);

  const addGoal = useCallback(
    async (title) => {
      const clean = title.trim();
      if (!clean || goals.length >= MAX_GOALS) return false;
      return commit([...goals, { id: newId(), title: clean, completedDates: [] }]);
    },
    [goals, commit]
  );

  // Toggles today only. Past days are never edited.
  const toggleToday = useCallback(
    (id) => {
      const today = todayKey();
      const next = goals.map((g) => {
        if (g.id !== id) return g;
        const done = g.completedDates.includes(today);
        return {
          ...g,
          completedDates: done
            ? g.completedDates.filter((d) => d !== today)
            : [...g.completedDates, today],
        };
      });
      return commit(next);
    },
    [goals, commit]
  );

  const removeGoal = useCallback((id) => commit(goals.filter((g) => g.id !== id)), [goals, commit]);

  return { goals, addGoal, toggleToday, removeGoal, canAddGoal: goals.length < MAX_GOALS };
};