// src/features/community/identity/NewToTheCityView.jsx
// src/features/community/identity/NewToTheCityView.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../theme/ThemeContext';
import { todayKey } from '../utils/dateKeys';
import { FiresideThread } from './FiresideThread';
import { MeetingSpotDirectory } from './MeetingSpotDirectory';
import { verifiedSpots } from '../data/meetingSpots';

const CITY_COMFORT_TAGS = [
  'Settling in',
  'Spot recommendation',
  'Routine check-in',
  'Looking for company',
  'Quiet encouragement',
];

const DAILY_CITY_PROMPTS = [
  'What is one small routine or corner that made this new city feel a little more like home today?',
  'If someone arrived in town this week, what gentle advice or calm spot would you share with them?',
  'How is your energy holding up with the pace of a new place—and how can this circle support you?',
  'What is one unfamiliar thing you navigated recently that you deserve credit for?',
  'Where do you go when you need a quiet breather away from city noise?',
];

const CIRCLE_REACTIONS = [
  { key: 'welcome', label: 'Warm welcome 🏡' },
  { key: 'helpful', label: 'Helpful spot 📍' },
  { key: 'withYou', label: 'With you 🤝' },
];

const SEED_CITY_NOTES = [
  {
    id: 'city-note-1',
    authorId: 'peer-amara',
    authorHandle: 'Amara',
    tag: 'Spot recommendation',
    body: 'Tried Cafe Kaya in Westlands yesterday afternoon—super calm outdoor seating if anyone wants a low-pressure place to read or meet a couple of peers without loud music.',
    timeLabel: '24m ago',
    reactions: { helpful: true, welcome: true },
  },
  {
    id: 'city-note-2',
    authorId: 'peer-kofi',
    authorHandle: 'Kofi',
    tag: 'Settling in',
    body: 'Week three since moving here and figuring out transport routes still drains me by evening. Glad we have this little family corner to unwind and check in.',
    timeLabel: '1h ago',
    reactions: { withYou: true },
  },
  {
    id: 'city-note-3',
    authorId: 'peer-nia',
    authorHandle: 'Nia',
    tag: 'Routine check-in',
    body: 'Mode Cafe on Kirichwa Road has great morning coffee and peaceful brunch tables. Happy to grab a quiet table there this weekend if anyone else is finding their footing.',
    timeLabel: '3h ago',
    reactions: { welcome: true, helpful: true },
  },
];

const getAutomatedDailyPrompt = () => {
  const key = todayKey();
  const seed = [...key].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return DAILY_CITY_PROMPTS[seed % DAILY_CITY_PROMPTS.length];
};

export const NewToTheCityView = ({
  space,
  joined = false,
  onToggleJoin,
  safetyAcknowledged = true,
  onAcknowledgeSafety,
  blockedAuthorIds = [],
  onBlockAuthor,
}) => {
  const { theme } = useTheme();
  const baseFont = theme.fontFamily ? { fontFamily: theme.fontFamily } : null;
  const scrollRef = useRef(null);

  const storageKey = 'mindbloom:community:new-to-the-city:v1';
  const dailyPrompt = useMemo(() => getAutomatedDailyPrompt(), []);

  const [notes, setNotes] = useState(SEED_CITY_NOTES);
  const [reportedIds, setReportedIds] = useState([]);
  const [selectedTag, setSelectedTag] = useState(CITY_COMFORT_TAGS[0]);
  const [draftBody, setDraftBody] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(storageKey);
        if (!active || !raw) return;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.notes) && parsed.notes.length > 0) {
          setNotes(parsed.notes);
        }
      } catch {}
    })();
    return () => {
      active = false;
    };
  }, []);

  const persistNotes = async (nextNotes) => {
    setNotes(nextNotes);
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify({ notes: nextNotes }));
    } catch {}
  };

  const handleJoinAndEnter = () => {
    onToggleJoin?.(space?.id || 'new-to-the-city');
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  };

  const handleSendNote = async () => {
    const clean = draftBody.trim();
    if (!clean || !safetyAcknowledged) return;

    const entry = {
      id: `city-note-${Date.now()}`,
      authorId: 'me-local',
      authorHandle: 'You',
      tag: selectedTag,
      body: clean,
      timeLabel: 'Just now',
      reactions: {},
    };

    await persistNotes([...notes, entry]);
    setDraftBody('');
  };

  const toggleReaction = async (noteId, key) => {
    const nextNotes = notes.map((n) => {
      if (n.id !== noteId) return n;
      return {
        ...n,
        reactions: {
          ...n.reactions,
          [key]: !n.reactions?.[key],
        },
      };
    });
    await persistNotes(nextNotes);
  };

  const visibleNotes = useMemo(
    () =>
      notes.filter(
        (n) =>
          !blockedAuthorIds.includes(n.authorId) &&
          !reportedIds.includes(n.id)
      ),
    [notes, blockedAuthorIds, reportedIds]
  );

  if (!joined) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View
          style={[
            styles.welcomeCard,
            { backgroundColor: theme.heroBg, borderColor: theme.heroBorder },
          ]}
        >
          <Text style={[styles.kicker, baseFont, { color: theme.accent }]}>
            NEW TO THE CITY · COMMUNITY HOME
          </Text>
          <Text style={[styles.welcomeTitle, baseFont, { color: theme.textPrimary }]}>
            A safe corner while you find your footing
          </Text>
          <Text style={[styles.descText, baseFont, { color: theme.textSecondary }]}>
            {space?.description ||
              'Connect with others navigating a new place and new routines. Share honest check-ins, swap calm café recommendations, and build a grounded wellness circle at your own pace.'}
          </Text>

          <View style={styles.highlights}>
            <Text style={[styles.highlightItem, baseFont, { color: theme.textPrimary }]}>
              - Peer circle for daily check-ins, city tips, and mutual support
            </Text>
            <Text style={[styles.highlightItem, baseFont, { color: theme.textPrimary }]}>
              - Verified group-friendly meet-up spots with map directions
            </Text>
            <Text style={[styles.highlightItem, baseFont, { color: theme.textPrimary }]}>
              - Gentle, no-pressure pace—share or just listen
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={handleJoinAndEnter}
            style={[styles.enterBtn, { backgroundColor: theme.accent }]}
          >
            <Text style={[styles.enterBtnText, baseFont, { color: theme.bg }]}>
              Join & Enter Circle
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      ref={scrollRef}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      <View
        style={[
          styles.statusBar,
          { backgroundColor: theme.heroBg, borderColor: theme.heroBorder },
        ]}
      >
        <View style={styles.statusTextCol}>
          <Text style={[styles.kicker, baseFont, { color: theme.accent }]}>
            NEW TO THE CITY · HOME CIRCLE
          </Text>
          <Text style={[styles.descText, baseFont, { color: theme.textPrimary }]}>
            Welcome home. Check in with peers settling in, swap spot reviews, or plan a calm meetup.
          </Text>
        </View>

        {onToggleJoin && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Leave circle"
            onPress={() => onToggleJoin(space?.id || 'new-to-the-city')}
            style={[
              styles.leaveBtn,
              { backgroundColor: theme.cardBg, borderColor: theme.divider },
            ]}
          >
            <Text style={[styles.leaveText, baseFont, { color: theme.textSecondary }]}>
              Leave
            </Text>
          </Pressable>
        )}
      </View>

      <FiresideThread
        sectionLabel="CITY CIRCLE CHECK-INS"
        promptLabel="TODAY’S CIRCLE CHECK-IN"
        dailyPrompt={dailyPrompt}
        notes={visibleNotes}
        reactions={CIRCLE_REACTIONS}
        tags={CITY_COMFORT_TAGS}
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
        draftBody={draftBody}
        onChangeDraft={setDraftBody}
        onSendNote={handleSendNote}
        onToggleReaction={toggleReaction}
        safetyAcknowledged={safetyAcknowledged}
        onAcknowledgeSafety={onAcknowledgeSafety}
        safetyMessage="Keep this circle a safe wellness home—be gentle with newcomers and avoid sharing private addresses or phone numbers."
        enableLabel="Enable circle chat"
        placeholder="Share how settling in feels, or recommend a spot…"
        emptyMessage="The circle is quiet right now—say hello whenever you’re ready."
        onBlockAuthor={onBlockAuthor}
        onReportNote={(noteId) => setReportedIds((prev) => [...prev, noteId])}
      />

      <View
        style={[
          styles.directoryCard,
          { backgroundColor: theme.cardBg, borderColor: theme.divider },
        ]}
      >
        <MeetingSpotDirectory
          spots={verifiedSpots}
          heading="Low-key meet-up spots"
          hint="Tap the map pin for directions, or reach out to the venue directly to arrange a small group session."
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    gap: 20,
    paddingBottom: 32,
  },
  welcomeCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    gap: 14,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
  },
  highlights: {
    gap: 8,
    marginTop: 2,
  },
  highlightItem: {
    fontSize: 13.5,
    fontWeight: '500',
    lineHeight: 19,
  },
  enterBtn: {
    marginTop: 6,
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enterBtnText: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  statusBar: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  statusTextCol: {
    flex: 1,
    gap: 4,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  descText: {
    fontSize: 13.5,
    fontWeight: '500',
    lineHeight: 19,
  },
  leaveBtn: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  leaveText: {
    fontSize: 12,
    fontWeight: '600',
  },
  directoryCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    gap: 14,
  },
});