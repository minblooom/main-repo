// src/features/community/hooks/useGroupSafety.js
import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SAFETY_KEY = 'mindbloom:community:groupSafety:v1';

const DEFAULT_STATE = {
  safetyAcknowledged: false,
  blockedAuthorIds: [],
  reportedPostIds: [],
};

export const useGroupSafety = () => {
  const [state, setState] = useState(DEFAULT_STATE);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(SAFETY_KEY);
        if (active && raw) setState({ ...DEFAULT_STATE, ...JSON.parse(raw) });
      } catch {}
    })();
    return () => { active = false; };
  }, []);

  const persist = useCallback(async (next) => {
    try {
      await AsyncStorage.setItem(SAFETY_KEY, JSON.stringify(next));
      setState(next);
      return true;
    } catch {
      return false;
    }
  }, []);

  const acknowledgeSafety = useCallback(
    () => persist({ ...state, safetyAcknowledged: true }),
    [state, persist]
  );

  const blockAuthor = useCallback(
    (authorId) => {
      if (!authorId || state.blockedAuthorIds.includes(authorId)) return Promise.resolve(true);
      return persist({
        ...state,
        blockedAuthorIds: [...state.blockedAuthorIds, authorId],
      });
    },
    [state, persist]
  );

  const reportPost = useCallback(
    (postId, reason = 'harmful') => {
      // Phase 3: POST /api/v1/community/reports { postId, reason }
      if (!postId || state.reportedPostIds.includes(postId)) return Promise.resolve(true);
      return persist({
        ...state,
        reportedPostIds: [...state.reportedPostIds, postId],
      });
    },
    [state, persist]
  );

  return {
    safetyAcknowledged: state.safetyAcknowledged,
    blockedAuthorIds: state.blockedAuthorIds,
    reportedPostIds: state.reportedPostIds,
    acknowledgeSafety,
    blockAuthor,
    reportPost,
  };
};