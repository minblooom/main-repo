// src/features/community/context/CommunitySpacesContext.jsx
import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { communitySpaces as seedSpaces } from '../data/communityData';

export const CommunitySpacesContext = createContext(null);

const JOINED_KEY = 'mindbloom:community:joinedSpaceIds';

const withJoinedIds = (ids) =>
  seedSpaces.map((space) => ({ ...space, joined: ids.includes(space.id) }));

export function CommunitySpacesProvider({ children }) {
  const [spaces, setSpaces] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'ready'
  const [actionError, setActionError] = useState(null);
  const spacesRef = useRef([]);

  const commit = useCallback((next) => {
    spacesRef.current = next;
    setSpaces(next);
  }, []);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const raw = await AsyncStorage.getItem(JOINED_KEY);
      let ids = null;
      try {
        ids = raw === null ? null : JSON.parse(raw);
      } catch {
        ids = null; // corrupted value: fall back to seed data
      }
      commit(Array.isArray(ids) ? withJoinedIds(ids) : seedSpaces);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [commit]);

  useEffect(() => {
    load();
  }, [load]);

  const setJoined = useCallback(
    async (id, joined) => {
      const previous = spacesRef.current;
      const next = previous.map((s) => (s.id === id ? { ...s, joined } : s));
      commit(next);
      setActionError(null);

      try {
        await AsyncStorage.setItem(
          JOINED_KEY,
          JSON.stringify(next.filter((s) => s.joined).map((s) => s.id))
        );
        return true;
      } catch {
        commit(previous);
        setActionError(
          joined ? 'We couldn’t join that space. Try again.' : 'We couldn’t leave that space. Try again.'
        );
        return false;
      }
    },
    [commit]
  );

  const joinSpace = useCallback((id) => setJoined(id, true), [setJoined]);
  const leaveSpace = useCallback((id) => setJoined(id, false), [setJoined]);
  const clearActionError = useCallback(() => setActionError(null), []);

  const joinedSpaces = useMemo(() => spaces.filter((s) => s.joined === true), [spaces]);

  const value = useMemo(
    () => ({
      spaces,
      joinedSpaces,
      status,
      actionError,
      clearActionError,
      reload: load,
      joinSpace,
      leaveSpace,
    }),
    [spaces, joinedSpaces, status, actionError, clearActionError, load, joinSpace, leaveSpace]
  );

  return <CommunitySpacesContext.Provider value={value}>{children}</CommunitySpacesContext.Provider>;
}