// src/components/modals/LocationPickerModal.jsx
// Lets users search and switch their current city/neighborhood or country anytime.
// Uses OpenStreetMap Nominatim API (free, keyless) + instant East Africa city presets.

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useI18n } from '../../services/i18n';
import { QUICK_CITIES, searchLocations } from '../../services/eventsService';

export const LocationPickerModal = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const { location, setLocation } = useI18n();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState(QUICK_CITIES);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (text) => {
    setQuery(text);
    if (!text.trim()) {
      setResults(QUICK_CITIES);
      return;
    }
    setSearching(true);
    const found = await searchLocations(text);
    setResults(found);
    setSearching(false);
  };

  const handleSelect = async (loc) => {
    await setLocation(loc);
    setQuery('');
    setResults(QUICK_CITIES);
    onClose?.();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={[s.card, { backgroundColor: theme.cardBg, borderColor: theme.divider || '#E8DFF2' }]}>
          <View style={s.header}>
            <View style={{ flex: 1 }}>
              <Text style={[s.tag, { color: theme.textMuted }]}>YOUR CURRENT LOCATION</Text>
              <Text style={[s.title, { color: theme.textPrimary }]}>Where are you right now?</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={s.closeBtn} activeOpacity={0.7}>
              <Text style={[s.closeText, { color: theme.textMuted }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={[s.sub, { color: theme.textSecondary }]}>
            Currently set to <Text style={{ fontWeight: '800' }}>{location?.city}, {location?.country}</Text>. Changing your location updates nearby physical events, weather, and local resources automatically.
          </Text>

          <View style={[s.searchRow, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
            <Text style={{ fontSize: 15 }}>🔍</Text>
            <TextInput
              style={[s.input, { color: theme.textPrimary }]}
              value={query}
              onChangeText={handleSearch}
              placeholder="Search any city or town (e.g. Kisumu, Kampala...)"
              placeholderTextColor={theme.textMuted}
              autoCorrect={false}
            />
            {searching && <ActivityIndicator size="small" color={theme.accent} />}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" style={{ maxHeight: 320 }}>
            <View style={{ gap: 8 }}>
              {results.map((item, idx) => {
                const isSelected =
                  location?.city?.toLowerCase() === item.city.toLowerCase() &&
                  location?.country?.toLowerCase() === item.country.toLowerCase();
                return (
                  <TouchableOpacity
                    key={`${item.city}_${item.country}_${idx}`}
                    style={[
                      s.row,
                      {
                        backgroundColor: isSelected ? theme.accentSoft : theme.heroBg,
                        borderColor: isSelected ? theme.accent : theme.heroBorder,
                      },
                    ]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.8}
                  >
                    <Text style={{ fontSize: 18 }}>📍</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[s.cityText, { color: theme.textPrimary }]}>{item.city}</Text>
                      <Text style={[s.countryText, { color: theme.textMuted }]} numberOfLines={1}>
                        {item.displayName || item.country}
                      </Text>
                    </View>
                    {isSelected && <Text style={{ color: theme.accent, fontWeight: '800' }}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
              {results.length === 0 && !searching && (
                <Text style={{ textAlign: 'center', paddingVertical: 20, color: theme.textMuted, fontSize: 13 }}>
                  No matching cities found. Try another town or city name.
                </Text>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 15, 30, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 460,
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  tag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontSize: 18,
    fontWeight: '700',
  },
  sub: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 13.5,
    paddingVertical: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  cityText: {
    fontSize: 14,
    fontWeight: '800',
  },
  countryText: {
    fontSize: 11.5,
    marginTop: 1,
  },
});
