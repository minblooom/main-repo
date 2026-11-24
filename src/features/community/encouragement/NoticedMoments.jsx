// src/features/community/components/NoticedMoments.jsx
// src/features/community/encouragement/NoticedMoments.jsx
import React, { useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { moodLabel } from '../data/checkInMoods';
import { formatDayLabel } from '../utils/dateKeys';
import { styles } from '../spaces/styles/CommunitySheet.styles';

export const NoticedMoments = ({
  checkIns = [],
  goals = [],
  onOpenCheckIn,
  onNoticeWin,
}) => {
  const { theme } = useTheme();
  const [noticedIds, setNoticedIds] = useState({});

  const recentWins = useMemo(() => {
    const items = [];

    goals.forEach((goal) => {
      (goal.completedDates ?? []).forEach((date) => {
        items.push({
          id: `goal-${goal.id}-${date}`,
          date,
          kind: 'goal',
          title: goal.title,
        });
      });
    });

    checkIns.forEach((entry) => {
      items.push({
        id: `checkin-${entry.date}`,
        date: entry.date,
        kind: 'checkin',
        entry,
        title: moodLabel(entry.mood),
        note: entry.note,
      });
    });

    return items.sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 4);
  }, [checkIns, goals]);

  const handleNotice = (item) => {
    setNoticedIds((prev) => ({ ...prev, [item.id]: true }));
    onNoticeWin?.(item);
  };

  return (
    <View style={[styles.panel, { backgroundColor: theme.cardBg, borderColor: theme.divider }]}>
      <Text style={[styles.panelTitle, { color: theme.textPrimary }]}>Kept going</Text>

      {recentWins.length === 0 ? (
        <Text style={[styles.empty, { color: theme.textMuted }]}>
          Your completed steps and check-ins will appear here.
        </Text>
      ) : (
        recentWins.map((item) => {
          const isNoticed = !!noticedIds[item.id];
          return (
            <View
              key={item.id}
              style={[styles.row, { backgroundColor: theme.bg, borderColor: theme.divider }]}
            >
              {item.kind === 'checkin' ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => onOpenCheckIn?.(item.entry)}
                  style={styles.rowText}
                >
                  <Text style={[styles.rowDate, { color: theme.textMuted }]}>
                    {formatDayLabel(item.date)}
                  </Text>
                  <Text style={[styles.rowMood, { color: theme.textPrimary }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                </Pressable>
              ) : (
                <View style={styles.rowText}>
                  <Text style={[styles.rowDate, { color: theme.textMuted }]}>
                    {formatDayLabel(item.date)}
                  </Text>
                  <Text style={[styles.rowMood, { color: theme.textPrimary }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                </View>
              )}

              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: isNoticed }}
                accessibilityLabel={isNoticed ? 'Noticed' : `Notice ${item.title}`}
                onPress={() => handleNotice(item)}
                style={[
                  styles.pill,
                  {
                    borderColor: isNoticed ? theme.accent : theme.divider,
                    backgroundColor: isNoticed ? theme.navActive : theme.cardBg,
                  },
                ]}
              >
                <Text style={[styles.pillText, { color: theme.accent }]}>
                  {isNoticed ? '✓' : 'Notice'}
                </Text>
              </Pressable>
            </View>
          );
        })
      )}
    </View>
  );
};