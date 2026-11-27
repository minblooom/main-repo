// src/services/i18n.js
// Lightweight, reactive multi-language & localization engine for MindBloom
// Supports English (EN), Kiswahili (SW), and Sheng (SH) without external heavy dependencies.

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onboardingStorage } from './onboardingStorage';

const LANGUAGE_KEY = '@mindbloom:selected_language';
const COUNTRY_KEY = '@mindbloom:selected_country';
const LOCATION_KEY = '@mindbloom:user_location';

export const SUPPORTED_LANGUAGES = [
  { id: 'en', code: 'EN', name: 'English' },
  { id: 'sw', code: 'SW', name: 'Kiswahili' },
  { id: 'sheng', code: 'SH', name: 'Sheng' },
];

export const COUNTRY_DATA = {
  ke: {
    code: 'KE',
    name: 'Kenya',
    capital: 'Nairobi',
    lat: -1.2921,
    lon: 36.8219,
    helplineName: 'Kenya Red Cross & Befrienders Kenya',
    helplinePhone: '1199 / +254 722 178 177',
    primaryCallNum: '1199',
    secondaryCallNum: '+254722178177',
    regionName: 'Kenya · East Africa',
    supportedLanguages: ['en'],
  },
  ug: {
    code: 'UG',
    name: 'Uganda',
    capital: 'Kampala',
    lat: 0.3476,
    lon: 32.5825,
    helplineName: 'Mental Health Uganda / Lifeline',
    helplinePhone: '0800 21 21 21',
    primaryCallNum: '0800212121',
    secondaryCallNum: null,
    regionName: 'Uganda · East Africa',
    supportedLanguages: ['en'],
  },
  tz: {
    code: 'TZ',
    name: 'Tanzania',
    capital: 'Dar es Salaam',
    lat: -6.7924,
    lon: 39.2083,
    helplineName: 'Tanzania National Helpline (C-SEMA)',
    helplinePhone: '116',
    primaryCallNum: '116',
    secondaryCallNum: null,
    regionName: 'Tanzania · East Africa',
    supportedLanguages: ['en'],
  },
  et: {
    code: 'ET',
    name: 'Ethiopia',
    capital: 'Addis Ababa',
    lat: 9.0320,
    lon: 38.7423,
    helplineName: 'Ethiopian Mental Health Support',
    helplinePhone: '952',
    primaryCallNum: '952',
    secondaryCallNum: null,
    regionName: 'Ethiopia · Horn of Africa',
    supportedLanguages: ['en'],
  },
  rw: {
    code: 'RW',
    name: 'Rwanda',
    capital: 'Kigali',
    lat: -1.9441,
    lon: 30.0619,
    helplineName: 'Rwanda Mental Health Crisis Line',
    helplinePhone: '114',
    primaryCallNum: '114',
    secondaryCallNum: null,
    regionName: 'Rwanda · East Africa',
    supportedLanguages: ['en'],
  },
  global: {
    code: 'GL',
    name: 'International',
    capital: 'Global',
    lat: -1.2921,
    lon: 36.8219,
    helplineName: 'Befrienders Worldwide & IASP',
    helplinePhone: 'befrienders.org',
    primaryCallNum: null,
    secondaryCallNum: null,
    regionName: 'Global Citizen',
    supportedLanguages: ['en'],
  },
};

const TRANSLATIONS = {
  en: {
    welcome_back: 'KARIBU TENA · WELCOME BACK',
    hero_heading: 'Big feelings.\nSmall steps.\nStill you.',
    sloth_quote: '"No catching up needed. Just come as you are."',
    companion_sub: 'Pole · your quiet pocket of calm',
    good_to_see_you: 'Good to see you.',
    pick_up_where: 'Pick up wherever you are today.',
    create_account: 'Create account',
    sign_in: 'Sign in',
    email_or_nickname: 'Email, phone or nickname *',
    password: 'Your password *',
    come_on_in: 'Come on in →',
    need_support: 'Need urgent support?',
    urgent_support_alert: 'If you need immediate help, reach out to {helplineName} at {helplinePhone}. You are not alone.',
    understood: 'Understood',
    how_is_your_heart: "How's your heart today?",
    no_right_answer: 'No right answer. Just a moment for you.',
    skip_note: 'You can skip this, too.',
    save_checkin: "Save today's check-in",
    checkin_saved: '✓ Recorded to your rhythm',
    what_touching_heart: "What's touching your heart right now? (Optional)",
    your_space_pace: 'Your space. Your pace. Your kind of brave.',
    new_here: 'New here?',
    create_your_space: 'Create your space',
    forgot_password: 'Forgot password?',
    sanctuary_home: 'My sanctuary  /  Home',
    sanctuary_journal: 'My sanctuary  /  Journal',
    greeting_overline: 'POLEPOLE, ONE MOMENT AT A TIME.',
    greeting_title: 'Sema, {name}. Make yourself at home.',
    greeting_subtitle: "Whatever today feels like, there's a little space for you here.",
    call_now: 'Call Now →',
  },
  sw: {
    welcome_back: 'KARIBU TENA · TUKO PAMOJA',
    hero_heading: 'Hisia nzito.\nHatua ndogo.\nBado ni wewe.',
    sloth_quote: '"Hakuna haraka. Njoo vile ulivyo, polepole."',
    companion_sub: 'Pole · kimbilio lako la utulivu',
    good_to_see_you: 'Furaha kukuona tena.',
    pick_up_where: 'Endelea pale ulipoachia leo.',
    create_account: 'Fungua nafasi',
    sign_in: 'Ingia ndani',
    email_or_nickname: 'Barua pepe, simu au jina la utani *',
    password: 'Nenosiri lako *',
    come_on_in: 'Ingia ndani →',
    need_support: 'Unahitaji usaidizi wa dharura?',
    urgent_support_alert: 'Ukiwa unahitaji usaidizi wa haraka, piga simu kwa {helplineName}: {helplinePhone}. Huko peke yako kamwe.',
    understood: 'Nimeelewa',
    how_is_your_heart: 'Moyo wako uko aje leo?',
    no_right_answer: 'Hakuna jibu baya. Ni wakati wako tu.',
    skip_note: 'Unaweza kuruka hatua hii pia.',
    save_checkin: 'Hifadhi hisia za leo',
    checkin_saved: '✓ Imehifadhiwa vizuri',
    what_touching_heart: 'Ni nini kimegusa moyo wako kwa sasa? (Sio lazima)',
    your_space_pace: 'Nafasi yako. Mwendo wako. Ushujaa wako.',
    new_here: 'Mgeni hapa?',
    create_your_space: 'Fungua nafasi yako',
    forgot_password: 'Umesahau nenosiri?',
    sanctuary_home: 'Kimbilio langu  /  Nyumbani',
    sanctuary_journal: 'Kimbilio langu  /  Shajara',
    greeting_overline: 'POLEPOLE, HATUA KWA HATUA.',
    greeting_title: 'Habari yako, {name}. Karibu sana nyumbani.',
    greeting_subtitle: 'Hata siku ya leo iweje, kuna nafasi ya amani kwa ajili yako hapa.',
    call_now: 'Piga Sasa →',
  },
  sheng: {
    welcome_back: 'NOMA SANA · KARIBU TENA',
    hero_heading: 'Feelings mzito.\nSteps ndogo ndogo.\nBado uko fiti.',
    sloth_quote: '"Hakuna pressure maze. Kuja vile uko, polepole tu."',
    companion_sub: 'Pole · zone yako ya kurelax',
    good_to_see_you: 'Form ni gani leo?',
    pick_up_where: 'Anzia mahali uliachia.',
    create_account: 'Unda account',
    sign_in: 'Ingia ndani',
    email_or_nickname: 'Email, namba ya simu ama nickname *',
    password: 'Password yako *',
    come_on_in: 'Ingia rada →',
    need_support: 'Unada usaidizi wa chap chap?',
    urgent_support_alert: 'Kama unajiskia off ama unahitaji usaidizi wa haraka, piga {helplineName}: {helplinePhone}. Hauko solo maze.',
    understood: 'Nimeshika',
    how_is_your_heart: 'Moyo unasemaje leo?',
    no_right_answer: 'Hakuna jibu mbaya. Ni moment yako tu.',
    skip_note: 'Unaweza iskip kama huko in the mood.',
    save_checkin: 'Save hisia za leo',
    checkin_saved: '✓ Iko recorded kwa rhythm',
    what_touching_heart: 'Ni nini inakushughulisha leo? (Optional)',
    your_space_pace: 'Space yako. Pace yako. Hustle yako.',
    new_here: 'Mgeni hapa?',
    create_your_space: 'Unda space yako',
    forgot_password: 'Umesahau password?',
    sanctuary_home: 'Sanctuary yangu  /  Base',
    sanctuary_journal: 'Sanctuary yangu  /  Diaries',
    greeting_overline: 'POLEPOLE, STEP KWA STEP BILA PRESSURE.',
    greeting_title: 'Niaje, {name}. Fika kwa base utulie.',
    greeting_subtitle: 'Hata vile day inakaa maze, tuko na space safi ya wewe ku-relax.',
    call_now: 'Piga Simu Chap →',
  },
};

const I18nContext = createContext({
  language: 'en',
  country: 'ke',
  countryData: COUNTRY_DATA.ke,
  availableLanguages: [SUPPORTED_LANGUAGES[0]],
  setLanguage: () => {},
  cycleLanguage: () => {},
  setCountry: () => {},
  t: (key) => key,
});

export const detectCountryFromTimezone = () => {
  try {
    const tz = Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone || '';
    if (tz.includes('Kampala')) return 'ug';
    if (tz.includes('Dar_es_Salaam') || tz.includes('Zanzibar')) return 'tz';
    if (tz.includes('Addis_Ababa')) return 'et';
    if (tz.includes('Kigali')) return 'rw';
    if (tz.includes('Nairobi')) return 'ke';
  } catch {}
  return 'ke';
};

export const I18nProvider = ({ children }) => {
  const [language, setLanguageState] = useState('en');
  const [country, setCountryState] = useState('ke');
  const [customLocation, setCustomLocation] = useState(null); // { city, country, countryId, lat, lon }

  useEffect(() => {
    (async () => {
      try {
        const [savedLang, savedCountry, savedLoc, prefs] = await Promise.all([
          AsyncStorage.getItem(LANGUAGE_KEY),
          AsyncStorage.getItem(COUNTRY_KEY),
          AsyncStorage.getItem(LOCATION_KEY),
          onboardingStorage.getPreferences(),
        ]);

        let resolvedCountry = 'ke';
        if (savedCountry) {
          resolvedCountry = savedCountry;
        } else if (prefs?.country) {
          resolvedCountry = prefs.country.toLowerCase();
        } else {
          resolvedCountry = detectCountryFromTimezone();
        }
        setCountryState(resolvedCountry);

        if (savedLoc) {
          try {
            setCustomLocation(JSON.parse(savedLoc));
          } catch {}
        } else if (prefs?.userLocation) {
          setCustomLocation(prefs.userLocation);
        }

        setLanguageState('en');
      } catch (err) {
        console.warn('[I18nProvider] Failed to load preferences:', err);
      }
    })();
  }, []);

  const setLanguage = async (newLang) => {
    let norm = 'en';
    const l = (newLang || '').toLowerCase();
    if (l === 'sw' || l.includes('kiswahili')) norm = 'sw';
    else if (l === 'sheng' || l === 'sh') norm = 'sheng';
    setLanguageState(norm);
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, norm);
      await onboardingStorage.savePreferences({ language: norm });
    } catch {}
  };

  const setCountry = async (newCountry) => {
    const norm = (newCountry || 'ke').toLowerCase();
    setCountryState(norm);
    const nextCountryData = COUNTRY_DATA[norm] || COUNTRY_DATA.ke;
    const allowed = nextCountryData.supportedLanguages || ['en'];

    if (!allowed.includes(language)) {
      const fallbackLang = allowed[0] || 'en';
      setLanguageState(fallbackLang);
      try {
        await AsyncStorage.setItem(LANGUAGE_KEY, fallbackLang);
        await onboardingStorage.savePreferences({ language: fallbackLang });
      } catch {}
    }

    try {
      await AsyncStorage.setItem(COUNTRY_KEY, norm);
      // Update city/coords to match new country's capital when country switches
      const nextLoc = {
        city: nextCountryData.capital && nextCountryData.capital !== 'Global' ? nextCountryData.capital : 'Nairobi',
        country: nextCountryData.name,
        countryId: norm,
        lat: nextCountryData.lat,
        lon: nextCountryData.lon,
      };
      setCustomLocation(nextLoc);
      await AsyncStorage.setItem(LOCATION_KEY, JSON.stringify(nextLoc));
      await onboardingStorage.savePreferences({ country: norm, userLocation: nextLoc, location: `${nextLoc.city}, ${nextLoc.country}` });
    } catch {}
  };

  const setLocation = async ({ city, country: countryName, countryId, lat, lon }) => {
    const resolvedId = (countryId || country || 'ke').toLowerCase();
    const baseData = COUNTRY_DATA[resolvedId] || COUNTRY_DATA.ke;
    const nextLoc = {
      city: city || baseData.capital || 'Nairobi',
      country: countryName || baseData.name || 'Kenya',
      countryId: resolvedId,
      lat: typeof lat === 'number' ? lat : baseData.lat,
      lon: typeof lon === 'number' ? lon : baseData.lon,
    };
    setCustomLocation(nextLoc);
    if (countryId && COUNTRY_DATA[resolvedId]) {
      setCountryState(resolvedId);
    }
    try {
      await AsyncStorage.setItem(LOCATION_KEY, JSON.stringify(nextLoc));
      if (countryId && COUNTRY_DATA[resolvedId]) {
        await AsyncStorage.setItem(COUNTRY_KEY, resolvedId);
      }
      await onboardingStorage.savePreferences({
        country: resolvedId,
        userLocation: nextLoc,
        location: `${nextLoc.city}, ${nextLoc.country}`,
      });
    } catch {}
  };

  const baseCountryData = COUNTRY_DATA[country] || COUNTRY_DATA.ke;
  const activeCountryData = {
    ...baseCountryData,
    capital: customLocation?.city || baseCountryData.capital,
    lat: typeof customLocation?.lat === 'number' ? customLocation.lat : baseCountryData.lat,
    lon: typeof customLocation?.lon === 'number' ? customLocation.lon : baseCountryData.lon,
    city: customLocation?.city || (baseCountryData.capital !== 'Global' ? baseCountryData.capital : 'Nairobi'),
    regionName: customLocation?.city
      ? `${customLocation.city}, ${customLocation.country || baseCountryData.name}`
      : baseCountryData.regionName,
  };
  const allowedLangIds = activeCountryData.supportedLanguages || ['en'];
  const availableLanguages = allowedLangIds
    .map((id) => SUPPORTED_LANGUAGES.find((l) => l.id === id))
    .filter(Boolean);

  const cycleLanguage = () => {
    if (availableLanguages.length <= 1) return;
    const idx = availableLanguages.findIndex((l) => l.id === language);
    const next = availableLanguages[(idx + 1) % availableLanguages.length];
    if (next) setLanguage(next.id);
  };

  const t = (key) => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    let text = langDict[key] || TRANSLATIONS.en[key] || key;
    if (typeof text === 'string') {
      text = text.replace('{helplineName}', activeCountryData.helplineName);
      text = text.replace('{helplinePhone}', activeCountryData.helplinePhone);
    }
    return text;
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        country,
        location: customLocation || {
          city: activeCountryData.city,
          country: activeCountryData.name,
          countryId: country,
          lat: activeCountryData.lat,
          lon: activeCountryData.lon,
        },
        countryData: activeCountryData,
        availableLanguages,
        setLanguage,
        cycleLanguage,
        setCountry,
        setLocation,
        t,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
