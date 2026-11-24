// src/features/community/encouragement/EncouragementPage.jsx
// src/features/community/encouragement/EncouragementPage.jsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../theme/ThemeContext';
import { AnimatedCompanion } from '../../../components/companion/AnimatedCompanion';
import { buildGarden, gardenStreak } from '../utils/gardenGrowth';
import { toDateKey, formatDayLabel } from '../utils/dateKeys';
import { GardenStrip } from './GardenStrip';

const SEEDS_STORAGE_KEY = 'mindbloom:community:sanctuarySeeds:v1';
const KEEPSAKES_STORAGE_KEY = 'mindbloom:community:sanctuaryKeepsakes:v1';

const STARTER_SEEDS = [
  { id: 'seed-rest', title: 'Pause for 3 slow breaths before evening', completedDates: [] },
  { id: 'seed-water', title: 'Drink a full glass of water in the morning', completedDates: [] },
];

export const EncouragementPage = ({
  checkInState,
  goalState,
  companionId = 'noodle',
}) => {
  const { theme } = useTheme();
  const todayKey = toDateKey(new Date());

  const [localSeeds, setLocalSeeds] = useState(STARTER_SEEDS);
  const [newSeedText, setNewSeedText] = useState('');
  const [keepsakes, setKeepsakes] = useState({});
  const [keepsakeDraft, setKeepsakeDraft] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [rawSeeds, rawKeepsakes] = await Promise.all([
          AsyncStorage.getItem(SEEDS_STORAGE_KEY),
          AsyncStorage.getItem(KEEPSAKES_STORAGE_KEY),
        ]);
        if (!active) return;
        if (rawSeeds) {
          const parsed = JSON.parse(rawSeeds);
          if (Array.isArray(parsed) && parsed.length > 0) setLocalSeeds(parsed);
        }
        if (rawKeepsakes) {
          const parsedK = JSON.parse(rawKeepsakes);
          if (parsedK && typeof parsedK === 'object') {
            setKeepsakes(parsedK);
            if (parsedK[todayKey]) setKeepsakeDraft(parsedK[todayKey]);
          }
        }
      } catch {}
    })();
    return () => {
      active = false;
    };
  }, [todayKey]);

  const persistSeeds = async (next) => {
    setLocalSeeds(next);
    try {
      await AsyncStorage.setItem(SEEDS_STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const handleAddSeed = async () => {
    const trimmed = newSeedText.trim();
    if (!trimmed) return;
    const item = {
      id: `seed-${Date.now()}`,
      title: trimmed,
      completedDates: [],
    };
    setNewSeedText('');
    await persistSeeds([item, ...localSeeds]);
  };

  const toggleSeedToday = async (id) => {
    const next = localSeeds.map((seed) => {
      if (seed.id !== id) return seed;
      const doneToday = seed.completedDates.includes(todayKey);
      return {
        ...seed,
        completedDates: doneToday
          ? seed.completedDates.filter((d) => d !== todayKey)
          : [...seed.completedDates, todayKey],
      };
    });
    await persistSeeds(next);
  };

  const saveKeepsake = async () => {
    const next = { ...keepsakes, [todayKey]: keepsakeDraft.trim() };
    setKeepsakes(next);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
    try {
      await AsyncStorage.setItem(KEEPSAKES_STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const combinedGoals = [...(goalState?.goals ?? []), ...localSeeds];
  const garden = buildGarden({
    checkIns: checkInState?.checkIns ?? [],
    goals: combinedGoals,
    days: 14,
  });

  const recentKeepsakes = Object.entries(keepsakes)
    .filter(([, text]) => text && text.trim().length > 0)
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .slice(0, 4);

  return (
    <View style={styles.page}>
      {/* 1. 14-Day Living Sanctuary Plot */}
      <View
        style={[
          styles.card,
          { backgroundColor: theme.cardBg, borderColor: theme.heroBorder },
        ]}
      >
        <View style={styles.heroHeader}>
          <View style={styles.heroText}>
            <Text style={[styles.overline, { color: '#2C5A38' }]}>
              YOUR LIVING SANCTUARY · 14 DAYS
            </Text>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
              Every quiet step leaves a trace of green.
            </Text>
          </View>
          <AnimatedCompanion
            companionId={companionId}
            size={64}
            state="idle"
            showAura={true}
            interactive={true}
          />
        </View>

        <GardenStrip garden={garden} streak={gardenStreak(garden)} />
      </View>

      {/* 2. Personal Seeds to Tend */}
      <View
        style={[
          styles.card,
          { backgroundColor: theme.cardBg, borderColor: theme.heroBorder },
        ]}
      >
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
          Seeds you are tending
        </Text>
        <Text style={[styles.cardSub, { color: theme.textSecondary }]}>
          Gentle rhythms—no timers, no missed-day penalties.
        </Text>

        <View style={styles.inputRow}>
          <TextInput
            value={newSeedText}
            onChangeText={setNewSeedText}
            placeholder="Plant a small intention (e.g. Step outside at noon)…"
            placeholderTextColor={theme.textMuted}
            onSubmitEditing={handleAddSeed}
            style={[
              styles.input,
              {
                color: theme.textPrimary,
                backgroundColor: theme.bg,
                borderColor: theme.divider,
              },
            ]}
          />
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={handleAddSeed}
            style={[styles.addBtn, { backgroundColor: theme.accent }]}
          >
            <Text style={[styles.addBtnText, { color: theme.bg }]}>Plant</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.seedList}>
          {localSeeds.map((seed) => {
            const tendedToday = seed.completedDates.includes(todayKey);
            const totalTends = seed.completedDates.length;
            const stageIcon =
              totalTends >= 3 ? '🌳' : totalTends >= 1 ? '🌱' : '🌰';

            return (
              <TouchableOpacity
                key={seed.id}
                accessibilityRole="button"
                accessibilityState={{ selected: tendedToday }}
                activeOpacity={0.85}
                onPress={() => toggleSeedToday(seed.id)}
                style={[
                  styles.seedRow,
                  {
                    backgroundColor: tendedToday ? '#EDF5EE' : theme.bg,
                    borderColor: tendedToday ? '#C6E3CB' : theme.divider,
                  },
                ]}
              >
                <Text style={styles.seedIcon}>{stageIcon}</Text>
                <View style={styles.seedInfo}>
                  <Text style={[styles.seedTitle, { color: theme.textPrimary }]}>
                    {seed.title}
                  </Text>
                  <Text style={[styles.seedMeta, { color: theme.textMuted }]}>
                    {totalTends === 0
                      ? 'Newly planted'
                      : `Tended ${totalTends} ${totalTends === 1 ? 'time' : 'times'}`}
                  </Text>
                </View>
                <View
                  style={[
                    styles.tendPill,
                    {
                      backgroundColor: tendedToday ? '#2C5A38' : theme.cardBg,
                      borderColor: tendedToday ? '#2C5A38' : theme.divider,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tendPillText,
                      { color: tendedToday ? '#FFFFFF' : theme.textSecondary },
                    ]}
                  >
                    {tendedToday ? 'Tended ✓' : 'Tend today'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 3. Today's Sanctuary Keepsake */}
      <View
        style={[
          styles.card,
          { backgroundColor: theme.cardBg, borderColor: theme.heroBorder },
        ]}
      >
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
          Leave a keepsake in the soil
        </Text>
        <Text style={[styles.cardSub, { color: theme.textSecondary }]}>
          One small moment from today worth remembering—stored privately on your device.
        </Text>

        <TextInput
          value={keepsakeDraft}
          onChangeText={setKeepsakeDraft}
          placeholder="e.g., Took ten quiet minutes with warm tea…"
          placeholderTextColor={theme.textMuted}
          multiline
          style={[
            styles.keepsakeInput,
            {
              color: theme.textPrimary,
              backgroundColor: theme.bg,
              borderColor: theme.divider,
            },
          ]}
        />

        <View style={styles.keepsakeFooter}>
          <Text style={[styles.savedHint, { color: '#2C5A38' }]}>
            {savedNotice ? 'Saved in your sanctuary ✓' : 'Private · On-device only'}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={saveKeepsake}
            style={[styles.saveBtn, { backgroundColor: theme.accent }]}
          >
            <Text style={[styles.saveBtnText, { color: theme.bg }]}>
              Save keepsake
            </Text>
          </TouchableOpacity>
        </View>

        {recentKeepsakes.length > 0 && (
          <View style={styles.keepsakeList}>
            {recentKeepsakes.map(([dateKey, note]) => (
              <View
                key={dateKey}
                style={[
                  styles.keepsakeItem,
                  { backgroundColor: theme.heroBg, borderColor: theme.heroBorder },
                ]}
              >
                <Text style={[styles.keepsakeDate, { color: theme.accent }]}>
                  {formatDayLabel(dateKey)}
                </Text>
                <Text style={[styles.keepsakeNote, { color: theme.textPrimary }]}>
                  {note}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    gap: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    gap: 12,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  heroText: {
    flex: 1,
    gap: 4,
  },
  overline: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  cardSub: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
  },
  addBtn: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  seedList: {
    gap: 8,
  },
  seedRow: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  seedIcon: {
    fontSize: 20,
  },
  seedInfo: {
    flex: 1,
    gap: 2,
  },
  seedTitle: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  seedMeta: {
    fontSize: 11.5,
  },
  tendPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tendPillText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  keepsakeInput: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    fontSize: 13,
    minHeight: 68,
    textAlignVertical: 'top',
  },
  keepsakeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  savedHint: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  saveBtn: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  saveBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  keepsakeList: {
    gap: 8,
    marginTop: 4,
  },
  keepsakeItem: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 3,
  },
  keepsakeDate: {
    fontSize: 11,
    fontWeight: '800',
  },
  keepsakeNote: {
    fontSize: 13,
    lineHeight: 18,
  },
});