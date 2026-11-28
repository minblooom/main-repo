// src/screens/community/SmallWinsScreen.jsx
// Standalone Small Wins Wall screen with persistent navigation dock

import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { styles } from './styles/SmallWinsScreen.styles';
import { useTheme } from '../../theme/ThemeContext';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { SidebarNav } from '../../components/navigation/SidebarNav';
import { BottomNavBar } from '../../components/navigation/BottomNavBar';
import { BackButton } from '../../features/community/baraza/BackButton';
import { SmallWinsSection } from '../../features/community/smallWins/SmallWinsSection';

export const SmallWinsScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;
  const companionId = route?.params?.companion || 'noodle';

  const handleNavigate = (routeId) => {
    if (routeId === 'home') {
      navigation.navigate('Home');
    } else if (routeId === 'journal') {
      navigation.navigate('Journal');
    } else if (routeId === 'arcade') {
      navigation.navigate('Arcade');
    } else if (routeId === 'chill' || routeId === 'soundscapes') {
      navigation.navigate('Chill');
    } else if (routeId === 'sanctuary') {
      navigation.navigate('Profile');
    } else if (routeId === 'baraza' || routeId === 'community') {
      navigation.navigate('Community');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <View style={[styles.rootContainer, { backgroundColor: theme.bg }]}>
        {isWide && (
          <SidebarNav
            activeRoute="baraza"
            onNavigate={handleNavigate}
            companionId={companionId}
          />
        )}

        <View style={[styles.mainContent, { backgroundColor: theme.bg }]}>
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

          {!isWide && (
            <BottomNavBar
              activeRoute="community"
              onNavigate={handleNavigate}
              companionId={companionId}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};
