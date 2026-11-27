// src/screens/journal/JournalScreen.jsx
// MindBloom Journal Sanctuary matching the Figma design
// Full separation of concerns, reactive prompt sparks, live archive search, entry persistence,
// and dynamic full-app theme awareness with clean English typography.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { useTheme } from '../../theme/ThemeContext';
import { styles } from './styles/JournalScreen.styles';

// Modular Navigation
import { SidebarNav } from '../../components/navigation/SidebarNav';
import { BottomNavBar } from '../../components/navigation/BottomNavBar';

// Modular Journal Components
import { JournalHeader } from './components/JournalHeader';
import { JournalEditor } from './components/JournalEditor';
import { JournalArchive } from './components/JournalArchive';
import { JournalInspirationCard } from './components/JournalInspirationCard';
import { JournalEntryModal } from './components/JournalEntryModal';
import { AllEntriesModal } from './components/AllEntriesModal';
import { JournalPrivacyModal } from './components/JournalPrivacyModal';
import { ReleaseToWorldModal } from './components/ReleaseToWorldModal';
import { LegalModal } from '../legal/LegalScreen';
import { onboardingStorage } from '../../services/onboardingStorage';
import { journalStorage } from '../../services/journalStorage';
import { COMPANION_MAP } from '../../constants/companions';
import { useI18n } from '../../services/i18n';

const FOCUS_SPARKS = {
  anxiety: [
    'What is one thing that felt gentle or safe today?',
    'What made you feel tight in your chest today?',
    'A thought you can tell yourself: "I am safe in this quiet moment."',
    'What is one expectation you can take off your shoulders right now?',
  ],
  burnout: [
    'What can you put down or let go of today?',
    'What would true rest feel like right now without guilt?',
    'Where did you spend emotional energy today that you want back?',
    'What is one boundary that kept you a little more at peace?',
  ],
  sleep: [
    'What thoughts are asking for your attention tonight?',
    'Permission to put the day to sleep. What can wait until tomorrow?',
    'What is one peaceful sensation you noticed today?',
  ],
  low_mood: [
    'What is one tiny, gentle thing you did for yourself today?',
    'How would you comfort a friend feeling the way you feel right now?',
    'It is okay not to feel sunny. What does your heart need right now?',
  ],
  body: [
    'How did your body carry you through today?',
    'What is one way you can offer your body kindness and softness right now?',
  ],
  strong_one: [
    'You do not have to hold everything alone. What can you share or set down?',
  ],
  default: [
    'What is one thing you want to say out loud right now?',
    'If today was a weather pattern, what did it feel like?',
    'What is one little thing you did that you are grateful for?',
  ],
};

export const JournalContent = ({
  companionId: initialCompanionId,
  userFocusAreas = ['anxiety'],
  onNavigateHome,
  onNavigateSanctuary,
  isWide = false,
}) => {
  const { theme, companionId: globalCompanionId } = useTheme();
  const { countryData, t } = useI18n();
  const companionId = initialCompanionId || globalCompanionId || 'noodle';
  const activeSparks = FOCUS_SPARKS[userFocusAreas?.[0]] || FOCUS_SPARKS.default;
  const companion = COMPANION_MAP[companionId] || COMPANION_MAP.noodle;

  // State Management
  const [entries, setEntries] = useState([]);
  const [sparkIndex, setSparkIndex] = useState(0);
  const [isSparkVisible, setIsSparkVisible] = useState(true);

  // Active Draft / Editor State
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [voiceNote, setVoiceNote] = useState(null);
  const [feeling, setFeeling] = useState('lighter');
  const [draftState, setDraftState] = useState('New entry');

  // Load real saved entries from local device storage on mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await journalStorage.getEntries();
        if (saved && Array.isArray(saved)) {
          setEntries(saved);
        }
      } catch (err) {
        console.warn('Failed to load journal entries:', err);
        Alert.alert(
          'Private journal unavailable',
          'MindBloom could not open encrypted journal storage on this device. Your saved entries have not been deleted.',
        );
      }
    })();
  }, []);

  // Modals
  const [editorMode, setEditorMode] = useState('journal'); // 'journal' | 'vent'
  const [releaseModalVisible, setReleaseModalVisible] = useState(false);
  const [releasePreview, setReleasePreview] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [singleModalVisible, setSingleModalVisible] = useState(false);
  const [allEntriesVisible, setAllEntriesVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState(null);

  // Handlers
  const handleNextSpark = () => {
    setSparkIndex((prev) => (prev + 1) % activeSparks.length);
  };

  const handleUsePrompt = (promptText) => {
    if (!title.trim() || title === 'A small, softer moment') {
      setTitle(promptText);
    } else {
      setBody((prev) => (prev ? `${prev}\n\nPrompt: "${promptText}"\n` : `Prompt: "${promptText}"\n`));
    }
    setDraftState('Draft updated');
  };

  const handleNewEntry = () => {
    setEditingEntryId(null);
    setTitle('');
    setBody('');
    setVoiceNote(null);
    setFeeling('lighter');
    setDraftState('Blank reflection');
  };

  // Ephemeral vent release — clears immediately from memory and never saves or tracks
  const handleReleaseToWorld = () => {
    if (!title.trim() && !body.trim() && !voiceNote) {
      Alert.alert('Nothing to Release', 'Speak, dictate, or write whatever is weighing on you first.');
      return;
    }
    const snippet = body.trim() || title.trim() || 'Voice vent';
    setReleasePreview(snippet);
    setEditingEntryId(null);
    setTitle('');
    setBody('');
    setVoiceNote(null);
    setDraftState('Released · Not saved');
    setReleaseModalVisible(true);
  };

  const handleSaveEntry = async () => {
    if (!title.trim() && !body.trim() && !voiceNote) {
      Alert.alert('Empty Reflection', 'Take your time. Even a single gentle word or voice note is enough.');
      return;
    }

    const feelingMap = {
      heavy: { label: 'A little heavy', bg: '#F2EDFA', color: '#6E5D87' },
      between: { label: 'Somewhere in between', bg: '#FFF5E8', color: '#8A531C' },
      lighter: { label: 'A little lighter', bg: '#EDF5EE', color: '#2C5A38' },
    };

    const feelingInfo = feelingMap[feeling] || feelingMap.lighter;
    const now = new Date();
    const dayStr = String(now.getDate()).padStart(2, '0');

    if (editingEntryId) {
      // Update existing entry
      const updatedEntries = entries.map((e) =>
        e.id === editingEntryId
          ? {
            ...e,
            title: title.trim() || (voiceNote ? 'Voice reflection' : 'A quiet thought'),
            body: body.trim(),
            voiceNote,
            feelingLabel: feelingInfo.label,
            badgeBg: feelingInfo.bg,
            badgeColor: feelingInfo.color,
            dateString: `UPDATED, ${dayStr} ${now.toLocaleString('default', { month: 'short' }).toUpperCase()}`,
          }
          : e
      );
      if (!(await journalStorage.saveEntries(updatedEntries))) {
        Alert.alert('Could not save securely', 'Your journal changes were not saved. Check device storage and try again.');
        return;
      }
      setEntries(updatedEntries);
      setDraftState('Saved · Just now');
      Alert.alert('Updated', 'Your changes have been quietly saved to this moment.');
    } else {
      // Create new entry
      const newEntry = {
        id: `entry-${Date.now()}`,
        dayNumber: dayStr,
        badgeBg: feelingInfo.bg,
        badgeColor: feelingInfo.color,
        title: title.trim() || (voiceNote ? 'Voice reflection' : 'A quiet thought'),
        feelingLabel: feelingInfo.label,
        body: body.trim(),
        voiceNote,
        dateString: `TODAY, ${dayStr} ${now.toLocaleString('default', { month: 'short' }).toUpperCase()}`,
      };
      const updatedEntries = [newEntry, ...entries];
      if (!(await journalStorage.saveEntries(updatedEntries))) {
        Alert.alert('Could not save securely', 'Your journal entry was not saved. Check device storage and try again.');
        return;
      }
      setEntries(updatedEntries);
      setDraftState('Saved · Just now');
      Alert.alert(
        'Saved in Your Sanctuary',
        'Your words have been gently tucked into your private journal.'
      );
    }
  };

  const handleDeleteEntry = async (id) => {
    const updated = entries.filter((e) => e.id !== id);
    if (!(await journalStorage.saveEntries(updated))) {
      Alert.alert('Could not delete securely', 'Your journal entry was not deleted. Check device storage and try again.');
      return;
    }
    setEntries(updated);
    if (editingEntryId === id) {
      handleNewEntry();
    }
  };

  const handleOpenEntry = (entry) => {
    setSelectedEntry(entry);
    setSingleModalVisible(true);
  };

  const handleLoadIntoEditor = (entry) => {
    setEditingEntryId(entry.id);
    setTitle(entry.title || '');
    setBody(entry.body || '');
    setVoiceNote(entry.voiceNote || null);
    if (entry.feelingLabel?.toLowerCase().includes('heavy')) setFeeling('heavy');
    else if (entry.feelingLabel?.toLowerCase().includes('between')) setFeeling('between');
    else setFeeling('lighter');
    setDraftState('Editing saved moment');
  };

  const handlePrivacyInfo = () => {
    setPrivacyModalVisible(true);
  };

  const handleExportEntries = () => {
    if (!entries || entries.length === 0) {
      Alert.alert('Archive Empty', 'You have no saved moments yet to export.');
      return;
    }

    const header = [
      '======================================================',
      '        MINDBLOOM PRIVATE JOURNAL ARCHIVE             ',
      '        Exported: ' + new Date().toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }),
      '        Sanctuary: Polepole · your pace                ',
      '======================================================\n\n',
    ].join('\n');

    const formattedMoments = entries
      .map((e, index) => {
        return [
          `[#${entries.length - index}] ${e.title || 'Untitled Moment'}`,
          `Date: ${e.dateString || 'Undated'} | Mood: ${e.feelingLabel || 'Neutral'}`,
          '------------------------------------------------------',
          e.body || '(No reflection text saved)',
          '\n\n',
        ].join('\n');
      })
      .join('\n');

    const fullArchiveText = header + formattedMoments;

    if (Platform.OS === 'web') {
      try {
        const blob = new Blob([fullArchiveText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mindbloom_journal_backup_${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        window.alert('Plain-text export downloaded. This file is not encrypted; keep it somewhere private.');
      } catch (err) {
        console.error('Export download failed:', err);
        window.alert('The journal text export could not be downloaded. Please try again.');
      }
    } else {
      Alert.alert(
        'Journal export unavailable',
        'Text export is currently available only on web. Voice-note audio is not included in the text export.'
      );
    }
  };

  return (
    <>
      <View style={[styles.contentWrapper, isWide && styles.contentWrapperWide]}>
        {/* Header with Breadcrumbs & Weather */}
        <JournalHeader
          companionId={companionId}
          onPrivacyPress={handlePrivacyInfo}
          onProfilePress={onNavigateSanctuary}
          onHomePress={onNavigateHome}
        />

        {/* Title & Subtitle with Privacy Button */}
        <View style={styles.titleSection}>
          <View style={styles.titleCol}>
            <Text style={[styles.pageTitle, { color: theme.textPrimary }]}>What's on your heart?</Text>
            <Text style={[styles.pageSubtitle, { color: theme.textSecondary }]}>
              No word counts. No right answers. Just a moment for you.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.privacyBtn, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}
            onPress={handlePrivacyInfo}
            activeOpacity={0.8}
          >
            <Text style={[styles.privacyBtnText, { color: theme.textPrimary }]}>Privacy settings 🔒</Text>
          </TouchableOpacity>
        </View>

        {/* 2-Column Responsive Layout */}
        <View style={[styles.columnsRow, isWide && styles.columnsRowWide]}>
          {/* Left Column: Clearly Defined Writing Editor */}
          <View style={styles.editorCol}>
            <JournalEditor
              dateString="MONDAY, 16 NOVEMBER"
              title={title}
              onChangeTitle={(t) => {
                setTitle(t);
                setDraftState('Unsaved draft');
              }}
              body={body}
              onChangeBody={(b) => {
                setBody(b);
                setDraftState('Unsaved draft');
              }}
              voiceNote={voiceNote}
              onChangeVoiceNote={(vn) => {
                setVoiceNote(vn);
                setDraftState('Unsaved draft');
              }}
              selectedFeeling={feeling}
              onSelectFeeling={setFeeling}
              prompt={activeSparks[sparkIndex % activeSparks.length]}
              isPromptVisible={isSparkVisible}
              onUsePrompt={handleUsePrompt}
              onNextPrompt={handleNextSpark}
              onHidePrompt={() => setIsSparkVisible(false)}
              onShowPrompt={() => setIsSparkVisible(true)}
              onSave={handleSaveEntry}
              onNewEntry={handleNewEntry}
              draftState={draftState}
              isEditingExisting={Boolean(editingEntryId)}
            />

            {/* Gentle Footer Tagline */}
            <View style={styles.editorFooterRow}>
              <Text style={[styles.footerWordsPace, { color: theme.textMuted }]}>Your words. Your pace.</Text>
              <TouchableOpacity
                onPress={() => {
                  const title = t('need_support');
                  const msg = `${countryData?.helplineName || 'Local Support'}: ${countryData?.helplinePhone || 'Dial local emergency services'}. You are never alone.`;
                  if (Platform.OS === 'web') {
                    window.alert(`${title}\n\n${msg}`);
                  } else {
                    Alert.alert(title, msg);
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.footerHelpline, { color: theme.textSecondary }]}>{t('need_support')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Right Column: Archive & Inspiration Card */}
          <View style={[styles.archiveCol, isWide && styles.archiveColWide]}>
            <JournalArchive
              entries={entries}
              onSelectEntry={handleOpenEntry}
              onDeleteEntry={handleDeleteEntry}
              onViewAll={() => setAllEntriesVisible(true)}
            />

            <JournalInspirationCard companionName={companion.name} />
          </View>
        </View>
      </View>

      {/* Single Entry Detail Modal */}
      <JournalEntryModal
        visible={singleModalVisible}
        entry={selectedEntry}
        onClose={() => setSingleModalVisible(false)}
        onLoadIntoEditor={handleLoadIntoEditor}
        onDeleteEntry={handleDeleteEntry}
      />

      {/* "View All" Complete Journal History Modal */}
      <AllEntriesModal
        visible={allEntriesVisible}
        entries={entries}
        onClose={() => setAllEntriesVisible(false)}
        onSelectEntry={handleLoadIntoEditor}
        onDeleteEntry={handleDeleteEntry}
      />

      {/* Dedicated Journal Privacy Settings Modal */}
      <JournalPrivacyModal
        visible={privacyModalVisible}
        onClose={() => setPrivacyModalVisible(false)}
        onOpenPrivacyPolicy={() => setLegalModalTab('privacy')}
        onExportEntries={handleExportEntries}
      />

      <ReleaseToWorldModal
        visible={releaseModalVisible}
        previewText={releasePreview}
        onClose={() => {
          setReleaseModalVisible(false);
          setReleasePreview('');
        }}
      />

      {/* In-App Legal Modal Popup for Privacy Policy */}
      <LegalModal
        visible={!!legalModalTab}
        initialTab={legalModalTab || 'privacy'}
        onClose={() => setLegalModalTab(null)}
      />
    </>
  );
};

export const JournalScreen = ({ navigation, route }) => {
  const { theme, companionId: themeCompanionId } = useTheme();
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;

  const companionId = themeCompanionId || route?.params?.companion || 'noodle';
  const [userFocusAreas, setUserFocusAreas] = useState(route?.params?.focusAreas || ['anxiety']);

  useEffect(() => {
    (async () => {
      try {
        const saved = await onboardingStorage.getPreferences();
        if (saved) {
          if (saved.companion && !route?.params?.companion) {
            setCompanionId(saved.companion);
          }
          if (Array.isArray(saved.focusAreas) && !route?.params?.focusAreas) {
            setUserFocusAreas(saved.focusAreas);
          }
        }
      } catch { }
    })();
  }, [route?.params]);

  const handleNavigate = (routeId) => {
    if (routeId === 'home') {
      navigation?.navigate?.('Home');
    } else if (routeId === 'arcade') {
      navigation?.navigate?.('Arcade');
    } else if (routeId === 'soundscapes' || routeId === 'chill') {
      navigation?.navigate?.('Chill');
    } else if (routeId === 'baraza' || routeId === 'community') {
      navigation?.navigate?.('Community');
    } else if (routeId === 'sanctuary') {
      navigation?.navigate?.('Profile', {
        companion: companionId,
        focusAreas: userFocusAreas,
      });
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <View style={[styles.rootContainer, { backgroundColor: theme.bg }]}>
        {isWide && (
          <SidebarNav
            activeRoute="journal"
            onNavigate={handleNavigate}
            companionId={companionId}
          />
        )}

        <View style={[styles.mainContent, { backgroundColor: theme.bg }]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContainer,
              isWide && styles.scrollContainerWide,
              { backgroundColor: theme.bg },
            ]}
          >
            <JournalContent
              companionId={companionId}
              userFocusAreas={userFocusAreas}
              onNavigateHome={() => handleNavigate('home')}
              onNavigateSanctuary={() => handleNavigate('sanctuary')}
              isWide={isWide}
            />
          </ScrollView>

          {!isWide && (
            <BottomNavBar
              activeRoute="journal"
              onNavigate={handleNavigate}
              companionId={companionId}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};
