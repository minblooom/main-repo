// src/features/community/encouragement/GardenStrip.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../theme/ThemeContext';
import { formatDayLabel, todayKey } from '../utils/dateKeys';

const WATER_KEY = 'mindbloom:community:gardenWatered:v1';

const STAGE_INFO = {
  soil: {
    title: 'Resting soil',
    meaning: 'Quiet earth. Rest is part of every season.',
  },
  seed: {
    title: 'Planted seed',
    meaning: 'You showed up today—a small beginning took root.',
  },
  sprout: {
    title: 'Young sprout',
    meaning: 'You tended an intention. New leaves are opening.',
  },
  bloom: {
    title: 'Acacia bloom',
    meaning: 'You checked in and tended a seed. Full canopy.',
  },
};

const BotanicalPlot = ({ stage, selected, watered, onPress, accent }) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={styles.plotWrap}
    >
      <View style={styles.plantStage}>
        {watered && stage !== 'soil' && <View style={styles.dewDrop} />}

        {stage === 'bloom' && (
          <View style={styles.bloomGroup}>
            <View style={[styles.blossomCrown, { backgroundColor: '#F4A261' }]} />
            <View style={styles.canopyRow}>
              <View style={[styles.leafLeft, { backgroundColor: '#3E7B4E' }]} />
              <View style={[styles.leafRight, { backgroundColor: '#4E9460' }]} />
            </View>
            <View style={[styles.stemTall, { backgroundColor: '#3A6B46' }]} />
          </View>
        )}

        {stage === 'sprout' && (
          <View style={styles.sproutGroup}>
            <View style={styles.canopyRow}>
              <View style={[styles.leafLeftSmall, { backgroundColor: '#4E9460' }]} />
              <View style={[styles.leafRightSmall, { backgroundColor: '#63AB75' }]} />
            </View>
            <View style={[styles.stemMid, { backgroundColor: '#4E9460' }]} />
          </View>
        )}

        {stage === 'seed' && (
          <View style={styles.seedGroup}>
            <View style={styles.tinyBud} />
            <View style={styles.seedKernel} />
          </View>
        )}

        <View
          style={[
            styles.soilMound,
            selected && { borderColor: accent, borderWidth: 1.5 },
          ]}
        >
          <View style={styles.soilTopRim} />
          {stage === 'soil' && <View style={styles.soilPebble} />}
        </View>
      </View>
    </Pressable>
  );
};

export const GardenStrip = ({ garden = [], streak = 0 }) => {
  const { theme } = useTheme();
  const [selected, setSelected] = useState(garden[garden.length - 1] ?? null);
  const [wateredToday, setWateredToday] = useState(false);

  useEffect(() => {
    if (garden.length > 0 && !selected) {
      setSelected(garden[garden.length - 1]);
    }
  }, [garden]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(WATER_KEY);
        if (active && saved === todayKey()) setWateredToday(true);
      } catch {}
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleWater = async () => {
    const next = !wateredToday;
    setWateredToday(next);
    try {
      await AsyncStorage.setItem(WATER_KEY, next ? todayKey() : '');
    } catch {}
  };

  const info = selected ? STAGE_INFO[selected.stage] ?? STAGE_INFO.soil : null;

  return (
    <View style={styles.container}>
      <View style={styles.strip}>
        {garden.map((day, idx) => {
          const isToday = idx === garden.length - 1;
          return (
            <BotanicalPlot
              key={day.date}
              stage={day.stage}
              accent={theme.accent}
              selected={selected?.date === day.date}
              watered={isToday && wateredToday}
              onPress={() => setSelected(day)}
            />
          );
        })}
      </View>

      <View style={styles.footerRow}>
        <Text
          style={[styles.caption, { color: theme.textSecondary }]}
          accessibilityLiveRegion="polite"
        >
          {selected && info
            ? `${formatDayLabel(selected.date)} · ${info.title}: ${info.meaning}`
            : 'Tap any soil mound to see how that day grew.'}
        </Text>

        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.85}
          onPress={handleWater}
          style={[
            styles.waterBtn,
            {
              backgroundColor: wateredToday ? '#E3F2E6' : theme.heroBg,
              borderColor: wateredToday ? '#B8DFC0' : theme.heroBorder,
            },
          ]}
        >
          <Text
            style={[
              styles.waterBtnText,
              { color: wateredToday ? '#2C5A38' : theme.accent },
            ]}
          >
            {wateredToday ? 'Misted 💧' : 'Mist garden 💧'}
          </Text>
        </TouchableOpacity>
      </View>

      {streak > 1 && (
        <Text style={[styles.streak, { color: '#2C5A38' }]}>
          🌱 {streak} quiet days tended in a row
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 10 },
  strip: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 6,
    paddingTop: 8,
    paddingHorizontal: 2,
  },
  plotWrap: { flex: 1, alignItems: 'center' },
  plantStage: {
    width: '100%',
    height: 46,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  dewDrop: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#56CCF2',
    marginBottom: 2,
  },
  bloomGroup: { alignItems: 'center', marginBottom: -2 },
  blossomCrown: {
    width: 10,
    height: 7,
    borderRadius: 5,
    marginBottom: -2,
    zIndex: 2,
  },
  canopyRow: { flexDirection: 'row', alignItems: 'center', gap: 1 },
  leafLeft: {
    width: 11,
    height: 7,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    transform: [{ rotate: '-18deg' }],
  },
  leafRight: {
    width: 11,
    height: 7,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    transform: [{ rotate: '18deg' }],
  },
  stemTall: { width: 3, height: 16, borderRadius: 2 },
  sproutGroup: { alignItems: 'center', marginBottom: -2 },
  leafLeftSmall: {
    width: 8,
    height: 5,
    borderTopLeftRadius: 6,
    borderBottomRightRadius: 6,
    transform: [{ rotate: '-20deg' }],
  },
  leafRightSmall: {
    width: 8,
    height: 5,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 6,
    transform: [{ rotate: '20deg' }],
  },
  stemMid: { width: 2.5, height: 11, borderRadius: 2 },
  seedGroup: { alignItems: 'center', marginBottom: -2 },
  tinyBud: {
    width: 4,
    height: 5,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: '#63AB75',
  },
  seedKernel: {
    width: 8,
    height: 5,
    borderRadius: 4,
    backgroundColor: '#D49A5A',
  },
  soilMound: {
    width: '100%',
    maxWidth: 34,
    height: 11,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: '#7B5843',
    overflow: 'hidden',
    alignItems: 'center',
  },
  soilTopRim: { width: '100%', height: 4, backgroundColor: '#9E745A' },
  soilPebble: {
    width: 4,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#B8927A',
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  caption: { flex: 1, fontSize: 12, lineHeight: 17 },
  waterBtn: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  waterBtnText: { fontSize: 11, fontWeight: '700' },
  streak: { fontSize: 11.5, fontWeight: '700' },
});