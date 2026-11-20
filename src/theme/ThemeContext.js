// src/theme/ThemeContext.js
// Dynamic theme provider for MindBloom: supports Savannah Warmth, Deep Horizon, Sage Meadow, and Teal Clarity,
// with dedicated high-contrast, beautiful Light and Dark palettes for every theme,
// along with Dark Mode and Discreet Privacy Shield toggles.

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const THEME_PALETTES = {
  savannah: {
    id: 'savannah',
    name: 'Savannah Warmth',
    tag: 'Solar Bento',
    desc: 'Solar Bento · Warm Amber',
    light: {
      id: 'savannah',
      name: 'Savannah Warmth',
      isDark: false,
      bg: '#FAF6EF',
      sidebarBg: '#F5EFE4',
      cardBg: '#FFFFFF',
      heroBg: '#EAE3F7',
      heroBorder: '#DFD5F0',
      accent: '#492542',
      accentSoft: '#FFF5E8',
      accentBorder: '#FFE6C9',
      textPrimary: '#2E1E46',
      textSecondary: '#6E5D87',
      textMuted: '#8B6DA8',
      pillBg: '#FFF5E8',
      pillText: '#8A531C',
      divider: 'rgba(73, 37, 66, 0.08)',
      navActive: '#EAE3F7',
    },
    dark: {
      id: 'savannah',
      name: 'Savannah Warmth',
      isDark: true,
      bg: '#14111D',
      sidebarBg: '#0F0C17',
      cardBg: '#1D182A',
      heroBg: '#281F39',
      heroBorder: '#3C2F55',
      accent: '#E5A97A',
      accentSoft: '#291E3B',
      accentBorder: '#4E376E',
      textPrimary: '#F8F6FC',
      textSecondary: '#D2C7E4',
      textMuted: '#9E8EB7',
      pillBg: '#2A1F3D',
      pillText: '#F7C582',
      divider: 'rgba(255, 255, 255, 0.08)',
      navActive: '#2C2240',
    },
  },
  deep_horizon: {
    id: 'deep_horizon',
    name: 'Deep Horizon',
    tag: 'Mindful silence',
    desc: 'Mindful silence · Midnight Violet',
    light: {
      id: 'deep_horizon',
      name: 'Deep Horizon',
      isDark: false,
      bg: '#F3F1F9',
      sidebarBg: '#EBE7F5',
      cardBg: '#FFFFFF',
      heroBg: '#E7E0F8',
      heroBorder: '#D5C7F0',
      accent: '#5B21B6',
      accentSoft: '#F0EAFF',
      accentBorder: '#D8B4FE',
      textPrimary: '#1F1436',
      textSecondary: '#5E4A7D',
      textMuted: '#8672A4',
      pillBg: '#F0EAFF',
      pillText: '#5B21B6',
      divider: 'rgba(91, 33, 182, 0.08)',
      navActive: '#E7E0F8',
    },
    dark: {
      id: 'deep_horizon',
      name: 'Deep Horizon',
      isDark: true,
      bg: '#0F0C18',
      sidebarBg: '#0A0812',
      cardBg: '#181426',
      heroBg: '#231D38',
      heroBorder: '#382E57',
      accent: '#C4B5FD',
      accentSoft: '#231C35',
      accentBorder: '#4D3C72',
      textPrimary: '#F5F3FF',
      textSecondary: '#D1C4E9',
      textMuted: '#9E8FB2',
      pillBg: '#231C35',
      pillText: '#DDD6FE',
      divider: 'rgba(255, 255, 255, 0.08)',
      navActive: '#2C2146',
    },
  },
  sage_meadow: {
    id: 'sage_meadow',
    name: 'Sage Meadow',
    tag: 'Vitality & growth',
    desc: 'Vitality & growth · Forest Sage',
    light: {
      id: 'sage_meadow',
      name: 'Sage Meadow',
      isDark: false,
      bg: '#F2F7F4',
      sidebarBg: '#E7F2EB',
      cardBg: '#FFFFFF',
      heroBg: '#E5F3E8',
      heroBorder: '#CBE5D0',
      accent: '#265435',
      accentSoft: '#EBF6ED',
      accentBorder: '#D2EBD7',
      textPrimary: '#14331C',
      textSecondary: '#3F6147',
      textMuted: '#688B70',
      pillBg: '#EBF6ED',
      pillText: '#265435',
      divider: 'rgba(38, 84, 53, 0.08)',
      navActive: '#DCEDE0',
    },
    dark: {
      id: 'sage_meadow',
      name: 'Sage Meadow',
      isDark: true,
      bg: '#0D1711',
      sidebarBg: '#08100C',
      cardBg: '#14231A',
      heroBg: '#1B3224',
      heroBorder: '#2A4C37',
      accent: '#6EE7B7',
      accentSoft: '#192E21',
      accentBorder: '#294C37',
      textPrimary: '#EBF8EE',
      textSecondary: '#BCE5C7',
      textMuted: '#80A88B',
      pillBg: '#192E21',
      pillText: '#6EE7B7',
      divider: 'rgba(255, 255, 255, 0.08)',
      navActive: '#213E2D',
    },
  },
  teal_clarity: {
    id: 'teal_clarity',
    name: 'Teal Clarity',
    tag: 'Social joy',
    desc: 'Social joy · Clear Horizons',
    light: {
      id: 'teal_clarity',
      name: 'Teal Clarity',
      isDark: false,
      bg: '#EEF8FA',
      sidebarBg: '#E0F1F5',
      cardBg: '#FFFFFF',
      heroBg: '#DEEFF3',
      heroBorder: '#BDE1E8',
      accent: '#0E6476',
      accentSoft: '#E6F6F9',
      accentBorder: '#BCE8F0',
      textPrimary: '#0C353F',
      textSecondary: '#2F616D',
      textMuted: '#588894',
      pillBg: '#E6F6F9',
      pillText: '#0E6476',
      divider: 'rgba(14, 100, 118, 0.08)',
      navActive: '#D3ECF1',
    },
    dark: {
      id: 'teal_clarity',
      name: 'Teal Clarity',
      isDark: true,
      bg: '#0A151A',
      sidebarBg: '#070F13',
      cardBg: '#112129',
      heroBg: '#18313C',
      heroBorder: '#264A5A',
      accent: '#38BDF8',
      accentSoft: '#152E38',
      accentBorder: '#274B5B',
      textPrimary: '#EBF8FA',
      textSecondary: '#AFDFE8',
      textMuted: '#70A5AF',
      pillBg: '#152E38',
      pillText: '#38BDF8',
      divider: 'rgba(255, 255, 255, 0.08)',
      navActive: '#1E3E4C',
    },
  },
};

// Legacy backward-compatible export
export const THEMES = {
  savannah: THEME_PALETTES.savannah.light,
  deep_horizon: THEME_PALETTES.deep_horizon.dark,
  sage_meadow: THEME_PALETTES.sage_meadow.light,
  teal_clarity: THEME_PALETTES.teal_clarity.light,
};

const THEME_STORAGE_KEY = '@mindbloom:theme_settings';

const ThemeContext = createContext({
  theme: THEME_PALETTES.savannah.light,
  themeId: 'savannah',
  companionId: 'noodle',
  isDark: false,
  privacyShield: false,
  setThemeId: () => {},
  setCompanionId: () => {},
  toggleDark: () => {},
  togglePrivacyShield: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [themeId, setThemeIdState] = useState('savannah');
  const [companionId, setCompanionIdState] = useState('noodle');
  const [isDark, setIsDark] = useState(false);
  const [privacyShield, setPrivacyShield] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.themeId && THEME_PALETTES[parsed.themeId]) {
            setThemeIdState(parsed.themeId);
          }
          if (parsed.companionId) {
            setCompanionIdState(parsed.companionId);
          }
          if (typeof parsed.isDark === 'boolean') {
            setIsDark(parsed.isDark);
          }
          if (typeof parsed.privacyShield === 'boolean') {
            setPrivacyShield(parsed.privacyShield);
          }
        }

        // Also check onboarding storage for initial companion if not in theme settings
        const onb = await AsyncStorage.getItem('@mindbloom_onboarding_prefs');
        if (onb) {
          const parsedOnb = JSON.parse(onb);
          const comp = parsedOnb.companionId || parsedOnb.companion;
          if (comp) {
            setCompanionIdState(comp);
          }
        }
      } catch {}
    })();
  }, []);

  const saveSettings = async (newThemeId, newIsDark, newPrivacy, newCompId = companionId) => {
    try {
      await AsyncStorage.setItem(
        THEME_STORAGE_KEY,
        JSON.stringify({
          themeId: newThemeId,
          companionId: newCompId,
          isDark: newIsDark,
          privacyShield: newPrivacy,
        })
      );
    } catch {}
  };

  const setThemeId = (newId) => {
    if (THEME_PALETTES[newId]) {
      setThemeIdState(newId);
      saveSettings(newId, isDark, privacyShield, companionId);
    }
  };

  const setCompanionId = async (newId) => {
    if (!newId) return;
    setCompanionIdState(newId);
    saveSettings(themeId, isDark, privacyShield, newId);
    try {
      const onb = await AsyncStorage.getItem('@mindbloom_onboarding_prefs');
      const parsed = onb ? JSON.parse(onb) : {};
      parsed.companion = newId;
      parsed.companionId = newId;
      await AsyncStorage.setItem('@mindbloom_onboarding_prefs', JSON.stringify(parsed));
    } catch {}
  };

  const toggleDark = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    saveSettings(themeId, nextDark, privacyShield, companionId);
  };

  const togglePrivacyShield = () => {
    const nextPrivacy = !privacyShield;
    setPrivacyShield(nextPrivacy);
    saveSettings(themeId, isDark, nextPrivacy, companionId);
  };

  // Resolve palette based on current themeId and isDark state
  const palette = THEME_PALETTES[themeId] || THEME_PALETTES.savannah;
  const activeTheme = isDark ? palette.dark : palette.light;

  return (
    <ThemeContext.Provider
      value={{
        theme: activeTheme,
        themeId,
        companionId,
        isDark,
        privacyShield,
        setThemeId,
        setCompanionId,
        toggleDark,
        togglePrivacyShield,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  return {
    theme: ctx?.theme || THEME_PALETTES.savannah.light,
    themeId: ctx?.themeId || 'savannah',
    companionId: ctx?.companionId || 'noodle',
    isDark: ctx?.isDark || false,
    privacyShield: ctx?.privacyShield || false,
    setThemeId: ctx?.setThemeId || (() => {}),
    setCompanionId: ctx?.setCompanionId || (() => {}),
    toggleDark: ctx?.toggleDark || (() => {}),
    togglePrivacyShield: ctx?.togglePrivacyShield || (() => {}),
  };
};
