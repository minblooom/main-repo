// src/screens/journal/components/JournalHeader.jsx
// Top sanctuary navigation bar for the Journal screen with breadcrumb, weather, and privacy toggle

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { styles } from '../styles/JournalHeader.styles';
import { COMPANION_MAP } from '../../../constants/companions';
import { WeatherService } from '../../../services/weatherService';

export const JournalHeader = ({
  companionId = 'noodle',
  onPrivacyPress,
  onProfilePress,
  onHomePress,
}) => {
  const [language, setLanguage] = useState('EN');
  const [weatherData, setWeatherData] = useState({
    pillText: 'â˜€ï¸  Warm & Calm Â· 25Â°C',
    hydrationTip: 'Stay refreshed with small sips of water today.',
  });

  const companion = COMPANION_MAP[companionId] || COMPANION_MAP.noodle;

  useEffect(() => {
    let isMounted = true;
    WeatherService.getCurrentWeather().then((data) => {
      if (isMounted && data) {
        setWeatherData(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

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

  return (
    <View style={styles.container}>
      {/* Breadcrumb / Location Indicator */}
      <TouchableOpacity
        style={styles.breadcrumb}
        onPress={onHomePress}
        activeOpacity={0.7}
      >
        <Text style={styles.breadcrumbText}>
          <Text style={styles.breadcrumbLink}>My sanctuary</Text>  /  Journal
        </Text>
      </TouchableOpacity>

      {/* Auxiliary Controls */}
      <View style={styles.controlsRow}>
        {/* Live Weather Pill with Hydration Care Advice */}
        <TouchableOpacity
          style={styles.weatherPill}
          onPress={() => Alert.alert("Today's Environment", weatherData.hydrationTip)}
          activeOpacity={0.8}
        >
          <Text style={styles.weatherText}>{weatherData.pillText}</Text>
        </TouchableOpacity>

        {/* Language Toggle */}
        <TouchableOpacity
          onPress={() => setLanguage(language === 'EN' ? 'SW' : 'EN')}
          style={styles.langBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.langText}>
            <Text style={language === 'EN' ? styles.langActive : styles.langInactive}>EN</Text>
            {' / '}
            <Text style={language === 'SW' ? styles.langActive : styles.langInactive}>SW</Text>
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

