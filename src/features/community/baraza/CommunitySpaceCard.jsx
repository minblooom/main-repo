// src/features/community/baraza/CommunitySpaceCard.jsx
import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { useSpaceTone } from '../utils/spaceTones';
import { styles } from './styles/CommunitySpaceCard.styles';

export const CommunitySpaceCard = ({
  type = 'group',
  title,
  description,
  meta,
  preview,
  joined = false,
  onPress,
  quickLabel,
  onQuick,
}) => {
  const t = useSpaceTone(type);
  const subline = preview || meta;

  const handleQuickPress = (e) => {
    e?.stopPropagation?.();
    onQuick?.(e);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={[title, joined ? 'Joined' : null, description].filter(Boolean).join('. ')}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: t.card, borderColor: t.border },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.accentBar, { backgroundColor: t.accent }]} />
      <View style={styles.body}>
        <View style={styles.footerRow}>
          <Text style={[styles.title, { color: t.title, flex: 1 }]} numberOfLines={1}>
            {title}
          </Text>
          {joined ? (
            <Text style={[styles.badge, { color: t.accent }]}>JOINED</Text>
          ) : (
            !!quickLabel && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${quickLabel} ${title}`}
                onPress={handleQuickPress}
                hitSlop={6}
                style={[styles.quick, { borderColor: t.accent }]}
              >
                <Text style={[styles.quickText, { color: t.accent }]}>{quickLabel}</Text>
              </Pressable>
            )
          )}
        </View>

        {!!description && (
          <Text style={[styles.description, { color: t.body }]} numberOfLines={2}>
            {description}
          </Text>
        )}

        {!!subline && (
          <Text style={[styles.meta, { color: t.accent }]} numberOfLines={1}>
            {subline}
          </Text>
        )}
      </View>
    </Pressable>
  );
};