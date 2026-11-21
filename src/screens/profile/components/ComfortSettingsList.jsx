// src/screens/profile/components/ComfortSettingsList.jsx
// "Your comfort comes first" settings section
// Clean English text, clear Privacy Shield purpose, customize disguise trigger, and dynamic theme integration.

import React from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';

export const ComfortSettingsList = ({
  onNotificationsPress,
  onLanguagePress,
  onPrivacyPress,
  onDiscreetShieldPress,
}) => {
  const { theme, isDark, toggleDark, privacyShield, togglePrivacyShield } = useTheme();

  return (
    <View style={[styles.section, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}>
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
        Your comfort comes first
      </Text>
      <Text style={[styles.sectionSub, { color: theme.textMuted }]}>
        Little adjustments. A space that feels like you.
      </Text>

      {/* Dark mode switch */}
      <View style={[styles.row, { borderBottomColor: theme.heroBorder }]}>
        <View style={styles.rowText}>
          <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>Dark mode</Text>
          <Text style={[styles.rowSublabel, { color: theme.textMuted }]}>
            {isDark ? 'On · Night mode active' : 'Off · Light mode active'}
          </Text>
        </View>
        <Switch
          value={isDark}
          onValueChange={toggleDark}
          trackColor={{ false: theme.heroBorder, true: theme.accent }}
          thumbColor={isDark ? '#FFFFFF' : theme.bg}
        />
      </View>

      {/* Discreet Privacy Shield Row */}
      <TouchableOpacity
        style={[styles.row, { borderBottomColor: theme.heroBorder }]}
        onPress={onDiscreetShieldPress}
        activeOpacity={0.8}
      >
        <View style={styles.rowText}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>Discreet Privacy Shield</Text>
            <Text style={{ fontSize: 13 }}>🛡️</Text>
          </View>
          <Text style={[styles.rowSublabel, { color: theme.textMuted }]}>
            {privacyShield
              ? 'Active · Tap to customize notification app disguise & preview'
              : 'Disguise notifications & mask reflections when in public · Tap to configure'}
          </Text>
        </View>
        <Switch
          value={privacyShield}
          onValueChange={togglePrivacyShield}
          trackColor={{ false: theme.heroBorder, true: theme.accent }}
          thumbColor={privacyShield ? '#FFFFFF' : theme.bg}
        />
      </TouchableOpacity>

      {/* Notifications Row */}
      <TouchableOpacity
        style={[styles.row, { borderBottomColor: theme.heroBorder }]}
        onPress={onNotificationsPress}
        activeOpacity={0.75}
      >
        <View style={styles.rowText}>
          <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>Notifications</Text>
          <Text style={[styles.rowSublabel, { color: theme.textMuted }]}>
            Choose your gentle nudges.
          </Text>
        </View>
        <Text style={[styles.arrow, { color: theme.textMuted }]}>›</Text>
      </TouchableOpacity>

      {/* Language & Region Row */}
      <TouchableOpacity
        style={[styles.row, { borderBottomColor: theme.heroBorder }]}
        onPress={onLanguagePress}
        activeOpacity={0.75}
      >
        <View style={styles.rowText}>
          <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>Language & Region</Text>
          <Text style={[styles.rowSublabel, { color: theme.textMuted }]}>
            English · Kenya
          </Text>
        </View>
        <Text style={[styles.arrow, { color: theme.textMuted }]}>›</Text>
      </TouchableOpacity>

      {/* Privacy & Data Row */}
      <TouchableOpacity
        style={[styles.row, { borderBottomWidth: 0 }]}
        onPress={onPrivacyPress}
        activeOpacity={0.75}
      >
        <View style={styles.rowText}>
          <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>Privacy & Data</Text>
          <Text style={[styles.rowSublabel, { color: theme.textMuted }]}>
            Your information, your choice
          </Text>
        </View>
        <Text style={[styles.arrow, { color: theme.textMuted }]}>›</Text>
      </TouchableOpacity>
    </View>
  );
};

import { styles } from '../styles/ComfortSettingsList.styles';
