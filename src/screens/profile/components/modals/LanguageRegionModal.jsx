// src/screens/profile/components/modals/LanguageRegionModal.jsx
// Live modal allowing user to dynamically switch their home country base and preferred language.
// Updates global i18n context, helplines, greetings, and regional settings immediately.

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../../../theme/ThemeContext';
import { useI18n, COUNTRY_DATA, SUPPORTED_LANGUAGES } from '../../../../services/i18n';
import { styles } from '../../styles/LanguageRegionModal.styles';

const COUNTRIES = [
  { id: 'ke', code: 'KE', name: 'Kenya', languages: 'Sheng, Kiswahili & English' },
  { id: 'ug', code: 'UG', name: 'Uganda', languages: 'Luganda & English' },
  { id: 'tz', code: 'TZ', name: 'Tanzania', languages: 'Kiswahili & English' },
  { id: 'et', code: 'ET', name: 'Ethiopia', languages: 'Amharic & English' },
  { id: 'rw', code: 'RW', name: 'Rwanda', languages: 'Kinyarwanda & English' },
  { id: 'global', code: 'GL', name: 'International', languages: 'Global & International resources' },
];

export const LanguageRegionModal = ({ visible, onClose, theme: propTheme }) => {
  const { theme: ctxTheme } = useTheme();
  const theme = propTheme || ctxTheme;
  const { country, language, setCountry, setLanguage, availableLanguages } = useI18n();

  const handleSelectCountry = (cId) => {
    setCountry(cId);
  };

  const handleSelectLanguage = (lId) => {
    setLanguage(lId);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.cardBg }]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.tag, { color: theme.textMuted }]}>PREFERENCES</Text>
              <Text style={[styles.title, { color: theme.textPrimary }]}>Language & Region</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Personalize your sanctuary's tone and crisis helpline to where you call home.
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {/* Country / Home Base Selection */}
            <View>
              <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Home Base / Region</Text>
              <View style={styles.countryList}>
                {COUNTRIES.map((c) => {
                  const isSelected = country === c.id;
                  return (
                    <TouchableOpacity
                      key={c.id}
                      style={[
                        styles.countryCard,
                        {
                          backgroundColor: isSelected ? theme.accentSoft : theme.heroBg,
                          borderColor: isSelected ? theme.accent : theme.heroBorder,
                        },
                      ]}
                      onPress={() => handleSelectCountry(c.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.countryLeft}>
                        <View
                          style={[
                            styles.flagBadge,
                            {
                              backgroundColor: isSelected ? theme.accent : theme.cardBg,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.flagText,
                              { color: isSelected ? '#FFFFFF' : theme.textPrimary },
                            ]}
                          >
                            {c.code}
                          </Text>
                        </View>
                        <View>
                          <Text style={[styles.countryName, { color: theme.textPrimary }]}>
                            {c.name}
                          </Text>
                          <Text style={[styles.countryLangs, { color: theme.textMuted }]}>
                            {c.languages}
                          </Text>
                        </View>
                      </View>
                      {isSelected && (
                        <Text style={[styles.checkText, { color: theme.accent }]}>✓</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Language Selection (only shown when selected country supports multiple languages) */}
            {availableLanguages.length > 1 && (
              <View>
                <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Language & Tone</Text>
                <View style={styles.langRow}>
                  {availableLanguages.map((l) => {
                    const isSelected = language === l.id;
                    return (
                      <TouchableOpacity
                        key={l.id}
                        style={[
                          styles.langChip,
                          {
                            backgroundColor: isSelected ? theme.accentSoft : theme.cardBg,
                            borderColor: isSelected ? theme.accent : theme.heroBorder,
                          },
                        ]}
                        onPress={() => handleSelectLanguage(l.id)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.langChipText,
                            { color: isSelected ? theme.accent : theme.textPrimary },
                            isSelected && { fontWeight: '800' },
                          ]}
                        >
                          {l.name} {isSelected ? '✓' : ''}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Live Regional Helpline Preview */}
            <View
              style={[
                styles.previewBanner,
                { backgroundColor: theme.heroBg, borderColor: theme.heroBorder, borderWidth: 1 },
              ]}
            >
              <Text style={[styles.previewTitle, { color: theme.textSecondary }]}>
                LOCAL CRISIS HELPLINE ({countryData?.name?.toUpperCase()})
              </Text>
              <Text style={[styles.previewBody, { color: theme.textPrimary, fontWeight: '700' }]}>
                {countryData?.helplineName}: {countryData?.helplinePhone}
              </Text>
              <Text style={[styles.previewBody, { color: theme.textMuted, fontSize: 12 }]}>
                Changes apply instantly across your whole sanctuary. No GPS tracking used.
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: theme.accent }]}
            onPress={onClose}
            activeOpacity={0.88}
          >
            <Text style={styles.saveBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
