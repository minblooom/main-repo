// src/features/community/identity/MeetingSpotDirectory.jsx
import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeContext';
import { requestWholeDay } from '../utils/venueRequest';
import { styles } from './styles/MeetingSpotDirectory.styles';

const openDirections = (spot) => {
  if (spot.mapUrl) {
    Linking.openURL(spot.mapUrl).catch(() => {});
    return;
  }

  // Clean venue + neighborhood + city query resolves reliably to the exact Google/Apple Maps place pin
  const placeQuery = encodeURIComponent(
    `${spot.name}, ${spot.area ? `${spot.area}, ` : ''}Nairobi, Kenya`
  );

  const url = Platform.select({
    ios: `http://maps.apple.com/?q=${placeQuery}`,
    android: `https://www.google.com/maps/search/?api=1&query=${placeQuery}`,
    default: `https://www.google.com/maps/search/?api=1&query=${placeQuery}`,
  });

  Linking.openURL(url).catch(() => {});
};

export const MeetingSpotDirectory = ({ spots, heading, hint }) => {
  const { theme } = useTheme();
  const [category, setCategory] = useState('All');
  const [groupOnly, setGroupOnly] = useState(false);

  const categories = useMemo(
    () => ['All', ...new Set(spots.map((s) => s.category).filter(Boolean))],
    [spots]
  );

  const filtered = useMemo(
    () =>
      spots.filter(
        (s) => (category === 'All' || s.category === category) && (!groupOnly || s.groupFriendly)
      ),
    [spots, category, groupOnly]
  );

  const chip = (label, selected, onPress) => (
    <Pressable
      key={label}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.chip,
        { borderColor: theme.divider, backgroundColor: selected ? theme.accent : theme.bg },
      ]}
    >
      <Text style={[styles.chipText, { color: selected ? theme.bg : theme.textSecondary }]}>{label}</Text>
    </Pressable>
  );

  if (spots.length === 0) {
    return (
      <Text style={[styles.empty, { color: theme.textMuted }]}>
        Meet-up spots are being added. Check back soon.
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: theme.textPrimary }]}>{heading}</Text>
      <Text style={[styles.hint, { color: theme.textSecondary }]}>{hint}</Text>

      <View style={styles.chips}>
        {categories.map((c) => chip(c, category === c, () => setCategory(c)))}
        {chip('Good for groups', groupOnly, () => setGroupOnly((g) => !g))}
      </View>

      {filtered.length === 0 ? (
        <Text style={[styles.empty, { color: theme.textMuted }]}>No spots match these filters yet.</Text>
      ) : (
        filtered.map((spot) => (
          <View key={spot.id} style={[styles.card, { backgroundColor: theme.bg, borderColor: theme.divider }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: theme.textPrimary }]}>{spot.name}</Text>
                <Text style={[styles.meta, { color: theme.textMuted }]}>
                  {spot.category} · {spot.area}
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Open map for ${spot.name}`}
                onPress={() => openDirections(spot)}
                hitSlop={8}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: theme.accent,
                  backgroundColor: theme.accentSoft,
                }}
              >
                <Ionicons name="location-sharp" size={14} color={theme.accent} />
                <Text style={{ fontSize: 11.5, fontWeight: '700', color: theme.textPrimary }}>Map</Text>
              </Pressable>
            </View>

            <Text style={[styles.address, { color: theme.textSecondary }]}>{spot.address}</Text>
            {!!spot.notes && <Text style={[styles.notes, { color: theme.textSecondary }]}>{spot.notes}</Text>}
            {spot.wholeDayRequests && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Request ${spot.name} for a group day`}
                onPress={() => requestWholeDay(spot, { date: 'To be confirmed', groupSize: 'a few' })}
                style={[styles.button, { borderColor: theme.accent }]}
              >
                <Text style={[styles.buttonText, { color: theme.accent }]}>Request for a group day</Text>
              </Pressable>
            )}
          </View>
        ))
      )}
    </View>
  );
};