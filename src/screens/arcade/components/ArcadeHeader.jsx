// src/screens/arcade/components/ArcadeHeader.jsx
// Top bar for Bloom Arcade matching the Figma design:
// Breadcrumb, Weather pill, Language toggle, Notification bell, and "My favourites" link.

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useI18n } from '../../../services/i18n';
import { soundService } from '../audio/soundService';
import { styles } from '../styles/ArcadeHeader.styles';

export const ArcadeHeader = ({
  onHomePress,
  onFavouritesPress,
  onNotificationPress,
}) => {
  const { theme } = useTheme();
  const { language, setLanguage } = useI18n();

  const handleHome = () => {
    soundService.playClick();
    onHomePress?.();
  };

  const handleFavourites = () => {
    soundService.playClick();
    onFavouritesPress?.();
  };

  const handleNotifications = () => {
    soundService.playClick();
    onNotificationPress?.();
  };

  const toggleLanguage = () => {
    soundService.playClick();
    if (language === 'en') setLanguage('sw');
    else if (language === 'sw') setLanguage('sheng');
    else setLanguage('en');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Breadcrumb */}
      <View style={styles.breadcrumb}>
        <TouchableOpacity onPress={handleHome} activeOpacity={0.7}>
          <Text style={[styles.breadcrumbLink, { color: theme.textSecondary }]}>
            My sanctuary
          </Text>
        </TouchableOpacity>
        <Text style={[styles.breadcrumbSep, { color: theme.textMuted }]}> / </Text>
        <Text style={[styles.breadcrumbActive, { color: theme.textPrimary }]}>
          Blooms arcade
        </Text>
      </View>

      {/* Right side controls */}
      <View style={styles.rightRow}>
        <TouchableOpacity
          style={[styles.langPill, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}
          onPress={toggleLanguage}
          activeOpacity={0.7}
        >
          <Text style={[styles.langText, { color: theme.textSecondary }]}>
            {language === 'en' ? 'EN' : language === 'sw' ? 'SW' : 'SH'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bellBtn, { backgroundColor: theme.heroBg }]}
          onPress={handleNotifications}
          activeOpacity={0.7}
        >
          <Text style={styles.bellIcon}>🔔</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.favBtn, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}
          onPress={handleFavourites}
          activeOpacity={0.75}
        >
          <Text style={[styles.favText, { color: theme.textPrimary }]}>♡ My favourites</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
