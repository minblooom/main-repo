// src/features/community/baraza/BarazaPresenceBar.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../theme/ThemeContext';
import { getCompanionByIndex } from '../../../constants/companions';
import { todayKey } from '../utils/dateKeys';
import { styles } from './styles/BarazaPresenceBar.styles';

const STORAGE_KEY = 'mindbloom:community:barazaLanterns:v1';

const LANTERNS = [
  {
    key: 'lantern',
    companion: getCompanionByIndex(0),
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
    companion: getCompanionByIndex(1),
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
    companion: getCompanionByIndex(2),
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
    companion: getCompanionByIndex(3),
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
          const today = todayKey();
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
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ date: todayKey(), litKeys: nextLit })
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