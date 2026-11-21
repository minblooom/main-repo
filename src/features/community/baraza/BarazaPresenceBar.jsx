// src/features/community/baraza/BarazaPresenceBar.jsx
// src/features/community/baraza/BarazaPresenceBar.jsx
// src/features/community/baraza/BarazaPresenceBar.jsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../theme/ThemeContext';
import { COMPANION_MAP } from '../../../constants/companions';

const STORAGE_KEY = 'mindbloom:community:barazaLanterns:v1';

const COMPANION_KEYS = Object.keys(COMPANION_MAP);
const pickCompanion = (index, fallback) =>
  COMPANION_MAP[COMPANION_KEYS[index]] || COMPANION_MAP[fallback] || COMPANION_MAP.noodle;

const LANTERNS = [
  {
    key: 'lantern',
    companion: pickCompanion(0, 'noodle'),
    label: 'Light a lantern',
    icon: '🏮',
    baseCount: 18,
    glowBg: '#FFF6E5',
    glowBorder: '#F3D7A4',
    glowAccent: '#9A5B13',
    blessing: 'A warm light is lit in the room for anyone carrying something quietly today.',
  },
  {
    key: 'chai',
    companion: pickCompanion(1, 'pip'),
    label: 'Pour chai',
    icon: '🫖',
    baseCount: 24,
    glowBg: '#F9EFEA',
    glowBorder: '#E7C9BC',
    glowAccent: '#7D442B',
    blessing: 'A fresh cup is poured at the table—sit awhile, no rush to speak.',
  },
  {
    key: 'wildflower',
    companion: pickCompanion(2, 'sunny'),
    label: 'Leave a flower',
    icon: '🌼',
    baseCount: 14,
    glowBg: '#EDF5EE',
    glowBorder: '#CFE5D2',
    glowAccent: '#2C5A38',
    blessing: 'A small wildflower rests on the table—a gentle reminder that growth takes time.',
  },
  {
    key: 'presence',
    companion: pickCompanion(3, 'mochi'),
    label: 'Hold space',
    icon: '🕯️',
    baseCount: 31,
    glowBg: '#F0EAFA',
    glowBorder: '#D9CBEF',
    glowAccent: '#5B3765',
    blessing: 'Steady, quiet company for everyone who simply needed somewhere safe to land.',
  },
];

export const BarazaPresenceBar = () => {
  const { theme } = useTheme();
  const [litKeys, setLitKeys] = useState([]);
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (active && raw) {
          const parsed = JSON.parse(raw);
          const today = new Date().toISOString().slice(0, 10);
          if (parsed?.date === today && Array.isArray(parsed?.litKeys)) {
            setLitKeys(parsed.litKeys);
            if (parsed.litKeys.length > 0) {
              setActiveKey(parsed.litKeys[parsed.litKeys.length - 1]);
            }
          }
        }
      } catch {}
    })();
    return () => {
      active = false;
    };
  }, []);

  const toggleLantern = async (key) => {
    const alreadyLit = litKeys.includes(key);
    const nextLit = alreadyLit
      ? litKeys.filter((k) => k !== key)
      : [...litKeys, key];

    setLitKeys(nextLit);
    setActiveKey(alreadyLit ? nextLit[nextLit.length - 1] ?? null : key);

    try {
      const today = new Date().toISOString().slice(0, 10);
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ date: today, litKeys: nextLit })
      );
    } catch {}
  };

  const totalTableGlow =
    LANTERNS.reduce((sum, item) => sum + item.baseCount, 0) + litKeys.length;

  const activeLantern = LANTERNS.find((l) => l.key === activeKey) ?? null;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.cardBg, borderColor: theme.heroBorder },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.titleBlock}>
          <Text style={[styles.question, { color: theme.textPrimary }]}>
            The Baraza table
          </Text>
          <Text style={[styles.subline, { color: theme.textSecondary }]}>
            Leave a quiet gesture for others gathering here today.
          </Text>
        </View>

        <View
          style={[
            styles.counterPill,
            { backgroundColor: theme.heroBg, borderColor: theme.heroBorder },
          ]}
        >
          <Text style={[styles.counterText, { color: theme.accent }]}>
            ✨ {totalTableGlow} warmths today
          </Text>
        </View>
      </View>

      {/* 4 Static Companion Lantern Tiles */}
      <View style={styles.tileRow}>
        {LANTERNS.map((item) => {
          const isLit = litKeys.includes(item.key);
          const count = item.baseCount + (isLit ? 1 : 0);
          const accentBg = item.companion?.accent || theme.accentSoft;

          return (
            <TouchableOpacity
              key={item.key}
              accessibilityRole="button"
              accessibilityState={{ selected: isLit }}
              accessibilityLabel={`${item.label}, ${count} shared today`}
              activeOpacity={0.85}
              onPress={() => toggleLantern(item.key)}
              style={[
                styles.tile,
                {
                  backgroundColor: isLit ? item.glowBg : theme.bg,
                  borderColor: isLit ? item.glowBorder : theme.divider,
                },
              ]}
            >
              <View style={styles.avatarWrap}>
                <View
                  style={[
                    styles.avatarRing,
                    {
                      backgroundColor: accentBg,
                      borderColor: isLit ? item.glowAccent : 'transparent',
                    },
                  ]}
                >
                  <Image
                    source={item.companion.image}
                    style={styles.avatarImg}
                    resizeMode="cover"
                  />
                </View>

                <View
                  style={[
                    styles.badgeCircle,
                    {
                      backgroundColor: isLit ? item.glowAccent : theme.cardBg,
                      borderColor: isLit ? item.glowBg : theme.divider,
                    },
                  ]}
                >
                  <Text style={styles.badgeEmoji}>{item.icon}</Text>
                </View>
              </View>

              <Text
                numberOfLines={1}
                style={[
                  styles.tileLabel,
                  { color: isLit ? item.glowAccent : theme.textPrimary },
                ]}
              >
                {item.label}
              </Text>

              <Text
                style={[
                  styles.tileCount,
                  { color: isLit ? item.glowAccent : theme.textMuted },
                ]}
              >
                {isLit ? `Lit · ${count}` : `${count} shared`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Shared Table Blessing */}
      {activeLantern && (
        <View
          style={[
            styles.blessingBox,
            {
              backgroundColor: activeLantern.glowBg,
              borderColor: activeLantern.glowBorder,
            },
          ]}
          accessibilityLiveRegion="polite"
        >
          <Text style={styles.blessingIcon}>{activeLantern.icon}</Text>
          <Text style={[styles.blessingText, { color: activeLantern.glowAccent }]}>
            {activeLantern.blessing}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  titleBlock: {
    flex: 1,
    minWidth: 180,
    gap: 2,
  },
  question: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subline: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  counterPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  counterText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  tileRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tile: {
    flex: 1,
    minWidth: 110,
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 2,
  },
  avatarRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  badgeCircle: {
    position: 'absolute',
    right: -4,
    bottom: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeEmoji: {
    fontSize: 11,
  },
  tileLabel: {
    fontSize: 12.5,
    fontWeight: '800',
    textAlign: 'center',
  },
  tileCount: {
    fontSize: 11,
    fontWeight: '600',
  },
  blessingBox: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  blessingIcon: {
    fontSize: 18,
  },
  blessingText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },
});