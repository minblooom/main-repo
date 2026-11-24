// src/screens/journal/components/JournalHeader.jsx
// Top sanctuary navigation bar for the Journal screen with breadcrumb, weather, and privacy toggle

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { styles } from '../styles/JournalHeader.styles';
import { COMPANION_MAP } from '../../../constants/companions';
import { WeatherService } from '../../../services/weatherService';
import { useI18n } from '../../../services/i18n';

export const JournalHeader = ({
  companionId = 'noodle',
  onPrivacyPress,
  onProfilePress,
  onHomePress,
}) => {
  const { language, setLanguage, countryData, t } = useI18n();
  const [weatherData, setWeatherData] = useState({
    pillText: '☀️ Warm & Calm · 25°C',
    hydrationTip: 'Stay refreshed with small sips of water today.',
  });

  const companion = COMPANION_MAP[companionId] || COMPANION_MAP.noodle;

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
    Alert.alert('Quiet Sanctuary', 'Your journal notifications are muted. No pressure or streak reminders.');
  };

  const handlePrivacy = () => {
    if (onPrivacyPress) {
      onPrivacyPress();
      return;
    }
    Alert.alert(
      'Journal Privacy & Security 🔒',
      'Your reflections are saved locally and privately on this device. They are never sold, analyzed, or shared with third parties.'
    );
  };

  const toggleLanguage = () => {
    if (language === 'en') setLanguage('sw');
    else if (language === 'sw') setLanguage('sheng');
    else setLanguage('en');
  };

  return (
    <View style={styles.container}>
      {/* Breadcrumb / Location Indicator */}
      <TouchableOpacity
        style={styles.breadcrumb}
        onPress={onHomePress}
        activeOpacity={0.7}
      >
        <Text style={styles.breadcrumbText}>
          <Text style={styles.breadcrumbLink}>{t('sanctuary_journal')}</Text>
        </Text>
      </TouchableOpacity>

      {/* Auxiliary Controls */}
      <View style={styles.controlsRow}>
        {/* Language Toggle with EN / SW / SH */}
        <TouchableOpacity
          onPress={toggleLanguage}
          style={styles.langBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.langText}>
            <Text style={language === 'en' ? styles.langActive : styles.langInactive}>EN</Text>
            {' · '}
            <Text style={language === 'sw' ? styles.langActive : styles.langInactive}>SW</Text>
            {' · '}
            <Text style={language === 'sheng' ? styles.langActive : styles.langInactive}>SH</Text>
          </Text>
        </TouchableOpacity>

        {/* Notification Bell */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={handleNotifications}
          activeOpacity={0.7}
        >
          <Text style={styles.iconEmoji}>🔔</Text>
        </TouchableOpacity>

        {/* Profile Companion Avatar */}
        <TouchableOpacity
          style={[styles.avatarCircle, { backgroundColor: companion.accent || '#EAE3F7' }]}
          onPress={onProfilePress}
          activeOpacity={0.8}
        >
          <Image
            source={companion.cutoutImage || companion.image}
            style={styles.avatarImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
