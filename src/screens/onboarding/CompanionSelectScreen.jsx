// src/screens/onboarding/CompanionSelectScreen.jsx
// Companion selection onboarding screen – Figma "Choose your companion" design
// 2×2 animal grid with animated selection, responsive layout

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
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

// Companions using assets we have. Names match the Figma bilingual style.
const COMPANIONS = [
  {
    id: 'sloth',
    name: 'Pole',
    swName: 'Polepole',
    trait: 'Calm & steady',
    swTrait: 'Tulivu na imara',
    image: require('../../../assets/images/sloth.jpg'),
    accent: '#E8DEFF', // soft lavender
  },
  {
    id: 'fox',
    name: 'Mbweha',
    swName: 'Mbweha',
    trait: 'Curious & bright',
    swTrait: 'Mdadisi na angavu',
    image: require('../../../assets/images/fox.jpg'),
    accent: '#FFE8D6', // soft peach
  },
  {
    id: 'turtle',
    name: 'Kobe',
    swName: 'Kobe',
    trait: 'Wise & grounded',
    swTrait: 'Mwenye hekima',
    image: require('../../../assets/images/turtle.jpg'),
    accent: '#D6EFDE', // soft mint
  },
  {
    id: 'panda',
    name: 'Panda',
    swName: 'Panda',
    trait: 'Gentle & playful',
    swTrait: 'Mpole na mchangamfu',
    image: require('../../../assets/images/sloth.jpg'), // fallback to sloth until panda asset exists
    accent: '#FFEEF3', // soft pink
  },
];

export const CompanionSelectScreen = ({ navigation }) => {
  const { width, isMobile, isTablet, isDesktop } = useResponsiveLayout();
  const [selected, setSelected] = useState(null);
  const [language, setLanguage] = useState('EN');

  // Per-card bounce animations
  const bounceAnims = useRef(COMPANIONS.map(() => new Animated.Value(1))).current;
  // Entrance fade-in
  const fadeAnim = useRef(new Animated.Value(0)).current;
  // Selected companion float animation
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    // Gentle idle float loop
    Animated.loop(
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
    ).start();
  }, []);

  const handleSelect = (id, index) => {
    setSelected(id);
    // Bounce the tapped card
    Animated.sequence([
      Animated.timing(bounceAnims[index], {
        toValue: 0.93,
        duration: 100,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(bounceAnims[index], {
        toValue: 1,
        friction: 4,
        tension: 200,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  };

  const handleContinue = () => {
    if (!selected) return;
    // Navigate to main app (Home) — will be wired when Home screen is built
    // For now we just go back or could navigate forward
    if (navigation) {
      navigation.navigate('Signup'); // temporary — replace with 'Home' once built
    }
  };

  const isWide = isDesktop || isTablet;
  const cardWidth = isWide
    ? Math.min((width - 160) / 2, 220)
    : (width - 56) / 2;

  const selectedCompanion = COMPANIONS.find((c) => c.id === selected);

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[styles.wrapper, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            isWide && styles.scrollWide,
          ]}
        >
          {/* ── HEADER ──────────────────────────────────────── */}
          <View style={styles.header}>
            <Text style={styles.brand}>mindbloom</Text>
            <TouchableOpacity
              onPress={() => setLanguage(language === 'EN' ? 'SW' : 'EN')}
              style={styles.langBtn}
            >
              <Text style={styles.langText}>
                <Text style={language === 'EN' ? styles.langOn : styles.langOff}>EN</Text>
                {' | '}
                <Text style={language === 'SW' ? styles.langOn : styles.langOff}>SW</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── TITLE BLOCK ─────────────────────────────────── */}
          <View style={[styles.titleBlock, isWide && styles.titleBlockWide]}>
            <Text style={styles.sectionTag}>
              {language === 'EN' ? 'STEP 2 OF 3  ·  YOUR COMPANION' : 'HATUA 2 KWA 3  ·  MWENZI WAKO'}
            </Text>
            <Text style={styles.mainTitle}>
              {language === 'EN'
                ? 'Choose your companion.'
                : 'Chagua mwenzi wako.'}
            </Text>
            <Text style={styles.subtitle}>
              {language === 'EN'
                ? "They'll be with you every step of the way — no pressure, just presence."
                : 'Watakuwa nawe kila hatua — bila shinikizo, tu uwepo.'}
            </Text>
          </View>

          {/* ── 2×2 COMPANION GRID ──────────────────────────── */}
          <View style={[styles.grid, isWide && styles.gridWide]}>
            {COMPANIONS.map((companion, index) => {
              const isSelected = selected === companion.id;
              return (
                <Animated.View
                  key={companion.id}
                  style={{ transform: [{ scale: bounceAnims[index] }] }}
                >
                  <TouchableOpacity
                    activeOpacity={0.88}
                    onPress={() => handleSelect(companion.id, index)}
                    style={[
                      styles.card,
                      { width: cardWidth, backgroundColor: companion.accent },
                      isSelected && styles.cardSelected,
                    ]}
                  >
                    {/* Selected checkmark badge */}
                    {isSelected && (
                      <View style={styles.checkBadge}>
                        <Text style={styles.checkText}>✓</Text>
                      </View>
                    )}

                    {/* Animal Image */}
                    <Animated.View
                      style={[
                        styles.animalImageWrap,
                        isSelected && {
                          transform: [{ translateY: floatAnim }],
                        },
                      ]}
                    >
                      <Image
                        source={companion.image}
                        style={styles.animalImage}
                        resizeMode="cover"
                      />
                    </Animated.View>

                    {/* Name & Trait */}
                    <Text style={[styles.cardName, isSelected && styles.cardNameSelected]}>
                      {companion.name}
                    </Text>
                    <Text style={styles.cardTrait}>
                      {language === 'EN' ? companion.trait : companion.swTrait}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          {/* ── SELECTED COMPANION PREVIEW ──────────────────── */}
          {selectedCompanion && (
            <Animated.View
              style={[styles.selectedPreview, { borderColor: selectedCompanion.accent }]}
            >
              <Text style={styles.selectedHi}>
                {language === 'EN'
                  ? `Meet ${selectedCompanion.name} 👋`
                  : `Kutana na ${selectedCompanion.swName} 👋`}
              </Text>
              <Text style={styles.selectedMessage}>
                {language === 'EN'
                  ? `"I'll be your quiet companion through every feeling. You don't have to rush."`
                  : `"Nitakuwa mwenzi wako wa kimya kupitia kila hisia. Huhitaji kukimbilia."`}
              </Text>
            </Animated.View>
          )}

          {/* ── CTA BUTTON ──────────────────────────────────── */}
          <TouchableOpacity
            style={[
              styles.ctaButton,
              !selected && styles.ctaButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selected}
            activeOpacity={0.88}
          >
            <Text style={styles.ctaText}>
              {language === 'EN'
                ? selected
                  ? `Begin with ${selectedCompanion?.name} →`
                  : 'Pick a companion to continue'
                : selected
                  ? `Anza na ${selectedCompanion?.swName} →`
                  : 'Chagua mwenzi kuendelea'}
            </Text>
          </TouchableOpacity>

          {/* ── FOOTER MICRO-COPY ───────────────────────────── */}
          <Text style={styles.footer}>
            {language === 'EN'
              ? 'You can change your companion anytime from your profile.'
              : 'Unaweza kubadilisha mwenzi wako wakati wowote kutoka wasifu wako.'}
          </Text>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAF7F4', // cream background matching splash
  },
  wrapper: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  scrollWide: {
    paddingHorizontal: 48,
  },

  // Header
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 20,
  },
  brand: {
    fontSize: 22,
    fontWeight: '800',
    color: '#492542',
    letterSpacing: -0.4,
  },
  langBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  langText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#888',
  },
  langOn: {
    color: '#1A1A1A',
    fontWeight: '800',
  },
  langOff: {
    color: '#AAA',
  },

  // Title Block
  titleBlock: {
    width: '100%',
    marginBottom: 24,
  },
  titleBlockWide: {
    maxWidth: 560,
    alignSelf: 'center',
    textAlign: 'center',
  },
  sectionTag: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#8B6DA8',
    letterSpacing: 1,
    marginBottom: 6,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13.5,
    color: '#666',
    lineHeight: 20,
  },

  // 2×2 Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
  },
  gridWide: {
    maxWidth: 520,
    alignSelf: 'center',
  },

  // Companion Card
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
    minHeight: 160,
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
  animalImageWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  animalImage: {
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

  // Selected Preview Banner
  selectedPreview: {
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
  selectedHi: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  selectedMessage: {
    fontSize: 12.5,
    fontStyle: 'italic',
    color: '#555',
    lineHeight: 18,
  },

  // CTA
  ctaButton: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#492542',
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 14,
  },
  ctaButtonDisabled: {
    backgroundColor: '#C4A8C8',
    shadowOpacity: 0,
    elevation: 0,
  },
  ctaText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  // Footer
  footer: {
    fontSize: 10.5,
    color: '#AAA',
    textAlign: 'center',
    lineHeight: 15,
    maxWidth: 300,
  },
});
