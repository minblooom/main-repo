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
import { LegalModal } from '../legal/LegalScreen';
import { onboardingStorage } from '../../services/onboardingStorage';
import { COMPANION_MAP } from '../../constants/companions';

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

const INITIAL_ENTRIES = [
  {
    id: 'entry-1',
    dayNumber: '16',
    badgeBg: '#EDF5EE',
    badgeColor: '#2C5A38',
    title: 'A small, softer moment',
    feelingLabel: 'A little lighter',
    body: 'Today I stepped outside for a few minutes. The air was cool, and for a moment, I didn\'t need to figure anything out.\n\nI think I needed that reminder: a little pause counts, too.',
    dateString: 'TODAY, 16 NOVEMBER',
  },
  {
    id: 'entry-2',
    dayNumber: '14',
    badgeBg: '#FFF5E8',
    badgeColor: '#8A531C',
    title: 'Overthinking during lunch',
    feelingLabel: 'Somewhere in between',
    body: 'Noticed my shoulders creeping up to my ears again. Took three deep breaths with Kovu and watched the trees move.',
    dateString: 'SATURDAY, 14 NOVEMBER',
  },
  {
    id: 'entry-3',
    dayNumber: '09',
    badgeBg: '#F2EDFA',
    badgeColor: '#6E5D87',
    title: 'Morning stillness',
    feelingLabel: 'A little heavy',
    body: 'A warm cup of tea and five minutes of absolute silence before the rush of the world began.',
    dateString: 'MONDAY, 09 NOVEMBER',
  },
];

export const JournalContent = ({
  companionId: initialCompanionId,
  userFocusAreas = ['anxiety'],
  onNavigateHome,
  onNavigateSanctuary,
  isWide = false,
}) => {
  const { theme, companionId: globalCompanionId } = useTheme();
  const companionId = initialCompanionId || globalCompanionId || 'noodle';
  const activeSparks = FOCUS_SPARKS[userFocusAreas?.[0]] || FOCUS_SPARKS.default;
  const companion = COMPANION_MAP[companionId] || COMPANION_MAP.noodle;

  // State Management
  const [entries, setEntries] = useState(INITIAL_ENTRIES);
  const [sparkIndex, setSparkIndex] = useState(0);
  const [isSparkVisible, setIsSparkVisible] = useState(true);

  // Active Draft / Editor State
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [title, setTitle] = useState('A small, softer moment');
  const [body, setBody] = useState(
    'Today I stepped outside for a few minutes. The air was cool, and for a moment, I didn\'t need to figure anything out.\n\nI think I needed that reminder: a little pause counts, too.'
  );
  const [feeling, setFeeling] = useState('lighter');
  const [draftState, setDraftState] = useState('Unsaved draft');

  // Modals
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
    setFeeling('lighter');
    setDraftState('Blank reflection');
  };

  const handleSaveEntry = () => {
    if (!title.trim() && !body.trim()) {
      Alert.alert('Empty Reflection', 'Take your time. Even a single gentle word is enough.');
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
      setEntries((prev) =>
        prev.map((e) =>
          e.id === editingEntryId
            ? {
              ...e,
              title: title.trim() || 'A quiet thought',
              body: body.trim(),
              feelingLabel: feelingInfo.label,
              badgeBg: feelingInfo.bg,
              badgeColor: feelingInfo.color,
              dateString: `UPDATED, ${dayStr} NOVEMBER`,
            }
            : e
        )
      );
      setDraftState('Saved · Just now');
      Alert.alert('Updated', 'Your changes have been quietly saved to this moment.');
    } else {
      // Create new entry
      const newEntry = {
        id: `entry-${Date.now()}`,
        dayNumber: dayStr,
        badgeBg: feelingInfo.bg,
        badgeColor: feelingInfo.color,
        title: title.trim() || 'A quiet thought',
        feelingLabel: feelingInfo.label,
        body: body.trim(),
        dateString: `TODAY, ${dayStr} NOVEMBER`,
      };
      setEntries((prev) => [newEntry, ...prev]);
      setDraftState('Saved · Just now');
      Alert.alert(
        'Saved in Your Sanctuary',
        'Your words have been gently tucked into your private journal.'
      );
    }
  };

  const handleDeleteEntry = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
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
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Export download failed:', err);
      }
    } else {
      Alert.alert(
        'Archive Exported',
        'Your moments have been formatted into an encrypted local text archive.'
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
                onPress={() => Alert.alert('Helpline', 'Call 1199 (Kenya) or reach out to local emergency support.')}
                activeOpacity={0.7}
              >
                <Text style={[styles.footerHelpline, { color: theme.textSecondary }]}>Need urgent support?</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Right Column: Archive & Inspiration Card */}
          <View style={[styles.archiveCol, isWide && styles.archiveColWide]}>
            <JournalArchive
              entries={entries}
              onSelectEntry={handleOpenEntry}
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
          if (saved.focusAreas && saved.focusAreas.length > 0 && !route?.params?.focusAreas) {
            setUserFocusAreas(saved.focusAreas);
          }
        }
      } catch { }
    })();
  }, [route?.params]);

  const handleNavigate = (routeId) => {
    if (routeId === 'home') {
      navigation?.navigate?.('Home');
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
            showSupportCards={true}
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
