// src/screens/home/components/HomeHeader.jsx
// Sanctuary top header with breadcrumb, peaceful weather widget, language toggle, and profile.
// Fully integrated with dynamic theme context and localization.

// src/screens/home/components/HomeHeader.jsx
// Sanctuary top header with breadcrumb, peaceful weather widget, language toggle, and profile.
// Fully integrated with dynamic theme context.

// src/screens/home/components/HomeHeader.jsx
import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { COMPANION_MAP } from '../../../constants/companions';
import { useTheme } from '../../../theme/ThemeContext';
import { useI18n } from '../../../services/i18n';
import { WeatherService } from '../../../services/weatherService';
import { styles } from '../styles/HomeHeader.styles';

export const HomeHeader = ({
  companionId: propCompanionId,
  onProfilePress,
  currentPage = 'Home',
  onBackPress,
}) => {
  const { theme, companionId: globalCompanionId } = useTheme();
  const { language, setLanguage, countryData, t } = useI18n();

  const [weatherData, setWeatherData] = useState({
    pillText: '☀️ Warm & Calm · 25°C',
    hydrationTip: 'Stay refreshed with small sips of water today.',
  });

  const companionKey = propCompanionId || globalCompanionId || 'noodle';
  const companion = COMPANION_MAP[companionKey] || COMPANION_MAP.noodle;

  useEffect(() => {
    let isMounted = true;
    const lat = countryData?.lat ?? -1.2921;
    const lon = countryData?.lon ?? 36.8219;
    const capital = countryData?.capital || 'Nairobi';

    WeatherService.getCurrentWeather(lat, lon, capital).then((data) => {
      if (isMounted && data) {
        setWeatherData(data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [countryData?.code]);

  const handleNotifications = () => {
    Alert.alert('Quiet Sanctuary', 'No unread alerts. Your space is calm and peaceful.');
  };

  const toggleLanguage = () => {
    if (language === 'en') setLanguage('sw');
    else if (language === 'sw') setLanguage('sheng');
    else setLanguage('en');
  };

  return (
    <View style={styles.header}>
      <View style={styles.breadcrumb}>
        {onBackPress ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Back to My sanctuary"
            onPress={onBackPress}
            activeOpacity={0.7}
          >
            <Text style={[styles.breadcrumbText, { color: theme.textMuted }]}>
              My sanctuary  /  <Text style={{ color: theme.textPrimary }}>{currentPage}</Text>
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={[styles.breadcrumbText, { color: theme.textMuted }]}>
            My sanctuary  /  {currentPage}
          </Text>
        )}
        <Text style={[styles.breadcrumbText, { color: theme.textMuted }]}>
          {t('sanctuary_home')}
        </Text>
      </View>

      <View style={styles.controlsRow}>
        <View style={[styles.weatherPill, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}>
          <Text style={[styles.weatherText, { color: theme.textPrimary }]}>☀️ Warm & Calm · 25°C</Text>
        </View>

        {/* Language Toggle */}
        <TouchableOpacity
          onPress={toggleLanguage}
          style={styles.langBtn}
          activeOpacity={0.7}
        >
          <Text style={[styles.langText, { color: theme.textMuted }]}>
            <Text style={language === 'en' ? [styles.langActive, { color: theme.textPrimary }] : [styles.langInactive, { color: theme.textMuted }]}>EN</Text>
            {' · '}
            <Text style={language === 'sw' ? [styles.langActive, { color: theme.textPrimary }] : [styles.langInactive, { color: theme.textMuted }]}>SW</Text>
            {' · '}
            <Text style={language === 'sheng' ? [styles.langActive, { color: theme.textPrimary }] : [styles.langInactive, { color: theme.textMuted }]}>SH</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: theme.heroBg }]}
          onPress={handleNotifications}
          activeOpacity={0.7}
        >
          <Text style={styles.iconEmoji}>🔔</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.avatarCircle, { backgroundColor: companion.accent || theme.accentSoft, borderColor: theme.cardBg }]}
          onPress={onProfilePress}
          activeOpacity={0.8}
        >
          <Image
            source={companion.cutoutImage || companion.image}
            style={styles.avatarImg}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};