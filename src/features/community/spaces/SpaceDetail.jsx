// src/features/community/components/SpaceDetail.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useCommunitySpaces } from '../hooks/useCommunitySpaces';
import { getSpaceMeta } from '../utils/spaceMeta';
import { styles } from './styles/SpaceDetail.styles';

export const DEFAULT_EXPECT = {
  group: 'Groups are peer conversations. Share from your own experience, listen kindly, and respect everyone’s privacy.',
  circle: 'This is a peer-sharing space. You’re welcome to share, listen, or pass.',
  identity: 'This is an optional peer space. Join only if it feels right, and share only what you’re comfortable with.',
};

const NOUN = { group: 'group', circle: 'session', identity: 'space' };

export const SpaceDetail = ({ space, expect, children }) => {
  const { theme } = useTheme();
  const { joinSpace, leaveSpace, actionError, clearActionError } = useCommunitySpaces();
  const [pending, setPending] = useState(false);

  useEffect(() => clearActionError, [clearActionError]);

  const joined = space.joined === true;
  const noun = NOUN[space.type] ?? 'space';
  const meta = getSpaceMeta(space);

  const toggle = async () => {
    if (pending) return;
    setPending(true);
    try {
      await (joined ? leaveSpace : joinSpace)(space.id);
    } finally {
      setPending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>{space.title}</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{space.description}</Text>
        {meta.length > 0 && (
          <Text style={[styles.meta, { color: theme.textMuted }]}>{meta.join(' · ')}</Text>
        )}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>What to expect</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>
        {expect ?? space.expect ?? DEFAULT_EXPECT[space.type]}
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: pending, busy: pending }}
        disabled={pending}
        onPress={toggle}
        style={({ pressed }) => [
          styles.button,
          joined
            ? { borderColor: theme.accent, backgroundColor: theme.cardBg }
            : { backgroundColor: theme.accent },
          (pending || pressed) && styles.dimmed,
        ]}
      >
        <Text style={[styles.buttonText, { color: joined ? theme.accent : theme.bg }]}>
          {pending ? 'Just a moment…' : joined ? `Leave this ${noun}` : `Join this ${noun}`}
        </Text>
      </Pressable>

      {!!actionError && (
        <Text style={[styles.error, { color: theme.accent }]} accessibilityLiveRegion="polite">
          {actionError}
        </Text>
      )}

      {joined && (
        <View style={[styles.infoBox, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            You’ve joined this {noun}. You can leave at any time.
          </Text>
        </View>
      )}

      {children}
    </View>
  );
};