// src/screens/community/components/TeenSanctuaryBox.jsx
// Dedicated, uncrowded 13–17 Teen Space box on Community Baraza.
// Reuses the CommunityGreeting and CommunitySpaceCard layouts from features/community/baraza.

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { CommunityGreeting } from '../../../features/community/baraza/CommunityGreeting';
import { CommunitySpaceCard } from '../../../features/community/baraza/CommunitySpaceCard';
import { ENCOURAGEMENT_MESSAGES } from '../../../features/community/data/encouragementMessages';

const TEEN_NOTES = [
  'You do not have to figure out your whole life at 15. Today is enough.',
  'Grades and expectations can feel heavy—your worth is bigger than any score.',
  'It is okay to outgrow rooms where you had to shrink yourself.',
  'Even on quiet or awkward days, you belong here just as you are.',
  'One breath after school, one honest check-in—you are doing better than you think.',
  ...ENCOURAGEMENT_MESSAGES,
];

export const TeenSanctuaryBox = ({
  companionId = 'noodle',
  primaryMatch,
  isJoined = false,
  onSelectCircle,
}) => {
  const { theme } = useTheme();
  const [noteIdx, setNoteIdx] = useState(0);

  const maxMembers = primaryMatch?.maxMembers || 12;
  const memberCount = Math.min(
    maxMembers,
    (primaryMatch?.memberCount || 1) + (isJoined ? 1 : 0)
  );

  return (
    <View
      style={[
        styles.box,
        { backgroundColor: theme.cardBg, borderColor: 'rgba(155, 93, 229, 0.28)' },
      ]}
    >
      {/* Top Age-Locked Banner */}
      <View style={styles.topRow}>
        <View style={[styles.lockPill, { backgroundColor: 'rgba(155, 93, 229, 0.12)' }]}>
          <Text style={[styles.lockPillText, { color: '#7C3AED' }]}>
            🔒 13–17 Teen Space
          </Text>
        </View>
        <Text style={[styles.guardNote, { color: theme.textMuted }]}>
          Peers only · Safe room
        </Text>
      </View>

      {/* Reused Baraza Greeting Card */}
      <CommunityGreeting
        companionId={companionId}
        message={TEEN_NOTES[noteIdx]}
        onAnother={() => setNoteIdx((prev) => (prev + 1) % TEEN_NOTES.length)}
      />

      {/* Reused Baraza Space Card for Teen Circle Spotlight */}
      {primaryMatch && (
        <CommunitySpaceCard
          type="circle"
          title={primaryMatch.title}
          description={primaryMatch.description}
          meta={`${memberCount}/${maxMembers} members`}
          joined={isJoined}
          quickLabel="Enter"
          onPress={() => onSelectCircle?.(primaryMatch)}
          onQuick={() => onSelectCircle?.(primaryMatch)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 16,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  lockPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
  },
  lockPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  guardNote: {
    fontSize: 11.5,
    fontWeight: '600',
  },
});
