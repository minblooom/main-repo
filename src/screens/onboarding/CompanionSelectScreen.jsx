// src/screens/onboarding/CompanionSelectScreen.jsx
// "Who's coming with you?" — Figma screen 05
// Companion picker with 2×2 animated grid, bounce select, and preview

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { COMPANIONS } from '../../constants/companions';
import { OnboardingHeader } from './components/OnboardingHeader';
import { onboardingStyles as s } from './onboardingStyles';

export const CompanionSelectScreen = ({ navigation, route }) => {
  const { width, isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;
  const [selected, setSelected] = useState('noodle');

  const bounceAnims = useRef(COMPANIONS.map(() => new Animated.Value(1))).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -5,
          duration: 2000,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const handleSelect = (id, index) => {
    setSelected(id);
    Animated.sequence([
      Animated.timing(bounceAnims[index], {
        toValue: 0.92,
        duration: 90,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(bounceAnims[index], {
        toValue: 1,
        friction: 4,
        tension: 220,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  };

  const handleContinue = () => {
    if (!selected || !navigation) return;
    navigation.navigate('AgeSelect', {
      ...(route?.params ?? {}),
      companion: selected,
    });
  };

  const selectedCompanion = COMPANIONS.find((c) => c.id === selected) || COMPANIONS[0];
  const cardSize = isWide ? 200 : (width - 56) / 2;

  return (
    <SafeAreaView style={s.safeArea}>
      <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[s.scrollContainer, isWide && s.scrollContainerWide]}
        >
          <View style={[s.pageWrapper, isWide && s.pageWrapperWide]}>
            <OnboardingHeader navigation={navigation} />

            <View style={styles.centerBlock}>
              <Text style={s.stepTag}>STEP 3 OF 7 · YOUR COMPANION</Text>
              <Text style={s.title}>Who's coming with you?</Text>
              <Text style={s.subtitle}>
                Pick a little pocket of encouragement. Any companion is fine.
              </Text>

              {/* 2×2 Grid */}
              <View style={[styles.grid, isWide && { maxWidth: 440 }]}>
                {COMPANIONS.map((c, i) => {
                  const isSelected = selected === c.id;
                  return (
                    <Animated.View
                      key={c.id}
                      style={{ transform: [{ scale: bounceAnims[i] }] }}
                    >
                      <TouchableOpacity
                        activeOpacity={0.88}
                        onPress={() => handleSelect(c.id, i)}
                        style={[
                          styles.card,
                          { width: cardSize, backgroundColor: c.accent },
                          isSelected && styles.cardSelected,
                        ]}
                      >
                        {isSelected && (
                          <View style={styles.checkBadge}>
                            <Text style={styles.checkText}>✓</Text>
                          </View>
                        )}
                        <Animated.View
                          style={[
                            styles.imgWrap,
                            isSelected && { transform: [{ translateY: floatAnim }] },
                          ]}
                        >
                          <Image source={c.image} style={styles.img} resizeMode="cover" />
                        </Animated.View>
                        <Text
                          style={[
                            styles.cardName,
                            isSelected && styles.cardNameSelected,
                          ]}
                        >
                          {c.name}
                        </Text>
                        <Text style={styles.cardTrait}>{c.trait}</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </View>

              {/* Selected Preview Box */}
              {selectedCompanion && (
                <View
                  style={[
                    styles.preview,
                    { borderColor: selectedCompanion.accent },
                  ]}
                >
                  <Text style={styles.previewHi}>Meet {selectedCompanion.name} 👋</Text>
                  <Text style={styles.previewMsg}>
                    "I'll be your quiet companion through every feeling. No rush, ever."
                  </Text>
                </View>
              )}

              {/* CTA */}
              <TouchableOpacity
                style={[s.primaryBtn, styles.ctaBtn, !selected && s.primaryBtnDisabled]}
                onPress={handleContinue}
                disabled={!selected}
                activeOpacity={0.88}
              >
                <Text style={s.primaryBtnText}>
                  {selected
                    ? `Me + ${selectedCompanion?.name}. Let's go →`
                    : 'Pick a companion to continue'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation?.navigate('AgeSelect', {
                    ...(route?.params ?? {}),
                    companion: null,
                  })
                }
                style={s.skipBtn}
              >
                <Text style={s.skipBtnText}>Choose later</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centerBlock: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
  },
  card: {
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 155,
    justifyContent: 'center',
  },
  cardSelected: {
    borderColor: '#492542',
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 5,
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#492542',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  imgWrap: {
    width: 78,
    height: 78,
    borderRadius: 39,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  cardName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  cardNameSelected: {
    color: '#492542',
  },
  cardTrait: {
    fontSize: 10.5,
    color: '#777',
    textAlign: 'center',
  },
  preview: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  previewHi: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  previewMsg: {
    fontSize: 12.5,
    fontStyle: 'italic',
    color: '#555',
    lineHeight: 18,
  },
  ctaBtn: {
    width: '100%',
    maxWidth: 500,
  },
});
