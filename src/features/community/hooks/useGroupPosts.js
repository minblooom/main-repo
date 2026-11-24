// src/features/community/hooks/useGroupPosts.js
import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const POSTS_KEY = 'mindbloom:community:groupPosts:v1';

const SEED_POSTS = {
  // Starter gentle posts so groups feel warm and lived-in on first visit
  default: [
    {
      id: 'seed-1',
      authorId: 'peer-fern',
      authorHandle: 'Quiet Fern',
      timeLabel: 'Earlier today',
      contentNote: null,
      body: 'Taking things one small hour at a time today. Glad to have a calm corner where nobody expects a big update.',
      myReactions: {},
    },
    {
      id: 'seed-2',
      authorId: 'peer-tea',
      authorHandle: 'Morning Tea',
      timeLabel: 'Yesterday',
      contentNote: 'burnout',
      body: 'Finally gave myself permission to log off on time and make soup instead of catching up on messages.',
      myReactions: {},
    },
  ],
};

export const useGroupPosts = () => {
  const [postsByGroup, setPostsByGroup] = useState(SEED_POSTS);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(POSTS_KEY);
        if (active && raw) {
          setPostsByGroup({ ...SEED_POSTS, ...JSON.parse(raw) });
        }
      } catch {}
    })();
    return () => { active = false; };
  }, []);

  const persist = useCallback(async (next) => {
    try {
      await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(next));
      setPostsByGroup(next);
      return true;
    } catch {
      return false;
    }
  }, []);

  const getPostsForGroup = useCallback(
    (groupId) => postsByGroup[groupId] ?? SEED_POSTS.default,
    [postsByGroup]
  );

  const createPost = useCallback(
    async ({ groupId, body, contentNote }) => {
      const current = postsByGroup[groupId] ?? SEED_POSTS.default;
      const newPost = {
        id: `post-${Date.now()}`,
        authorId: 'me-local',
        authorHandle: 'You (local handle)',
        timeLabel: 'Just now',
        contentNote: contentNote || null,
        body,
        myReactions: {},
      };
      return persist({
        ...postsByGroup,
        [groupId]: [newPost, ...current],
      });
    },
    [postsByGroup, persist]
  );

  const toggleReaction = useCallback(
    async (groupId, postId, reactionKey) => {
      const current = postsByGroup[groupId] ?? SEED_POSTS.default;
      const updated = current.map((post) => {
        if (post.id !== postId) return post;
        const prevVal = !!post.myReactions?.[reactionKey];
        return {
          ...post,
          myReactions: {
            ...post.myReactions,
            [reactionKey]: !prevVal,
          },
        };
      });
      return persist({
        ...postsByGroup,
        [groupId]: updated,
      });
    },
    [postsByGroup, persist]
  );

  return {
    getPostsForGroup,
    createPost,
    toggleReaction,
  };
};