// src/screens/community/SmallWinsScreen.jsx
// Standalone Small Wins Wall screen for MindBloom Baraza

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { BackButton } from '../../features/community/baraza/BackButton';
import { SmallWinsSection } from '../../features/community/smallWins/SmallWinsSection';

export const SmallWinsScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;
  const companionId = route?.params?.companion || 'noodle';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          isWide && styles.scrollContainerWide,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.maxWrapper, isWide && styles.maxWrapperWide]}>
          <View style={styles.headerRow}>
            <BackButton
              label="‹ Back to Baraza"
              onPress={() => navigation.goBack()}
            />
          </View>

          <View style={styles.titleBlock}>
            <Text style={[styles.pageTitle, { color: theme.textPrimary }]}>
              Small Wins Wall 🏆
            </Text>
            <Text style={[styles.pageSubtitle, { color: theme.textSecondary }]}>
              Every breath, boundary, and small step matters. Acknowledge and honor your progress here.
            </Text>
          </View>

          <SmallWinsSection companionId={companionId} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 48,
  },
  scrollContainerWide: {
    paddingHorizontal: 32,
    paddingTop: 24,
  },
  maxWrapper: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    gap: 16,
  },
  maxWrapperWide: {
    gap: 20,
  },
  headerRow: {
    marginBottom: 4,
  },
  titleBlock: {
    gap: 4,
    marginBottom: 8,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
});
