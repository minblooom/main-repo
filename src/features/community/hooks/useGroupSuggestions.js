// src/features/community/hooks/useGroupSuggestions.js
import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'mindbloom:community:groupSuggestions';
export const MAX_SUGGESTIONS = 3;

const newId = () => `suggest-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const useGroupSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (active && raw) setSuggestions(JSON.parse(raw));
      } catch {}
    })();
    return () => { active = false; };
  }, []);

  const commit = useCallback(async (next) => {
    try {
      await AsyncStorage.setItem(KEY, JSON.stringify(next));
      setSuggestions(next);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Creates a pending suggestion. Nothing goes live until a moderator approves it.
  const suggestGroup = useCallback(
    async ({ title, description }) => {
      const cleanTitle = title.trim();
      const cleanDesc = description.trim();
      if (!cleanTitle || !cleanDesc || suggestions.length >= MAX_SUGGESTIONS) return false;

      return commit([
        {
          id: newId(),
          type: 'group',
          title: cleanTitle,
          description: cleanDesc,
          status: 'pending',
          rejectionReason: null,
          createdAt: new Date().toISOString(),
        },
        ...suggestions,
      ]);
    },
    [suggestions, commit]
  );

  // MODERATION HOOK: replaced by a backend call in phase 3
  const setModerationStatus = useCallback(
    (id, nextStatus, reason = null) =>
      commit(suggestions.map((s) =>
        s.id === id ? { ...s, status: nextStatus, rejectionReason: reason } : s
      )),
    [suggestions, commit]
  );

  return {
    suggestions,
    suggestGroup,
    setModerationStatus,
    canSuggest: suggestions.length < MAX_SUGGESTIONS,
  };
};