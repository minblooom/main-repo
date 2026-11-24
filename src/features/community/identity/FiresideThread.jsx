// src/features/community/identity/FiresideThread.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { getCompanionByIndex } from '../../../constants/companions';
import { styles } from './styles/FiresideThread.styles';

export const FiresideThread = ({
  sectionLabel = 'CIRCLE THREAD',
  promptLabel = 'TODAY’S PROMPT',
  dailyPrompt,
  notes = [],
  reactions = [],
  tags = [],
  selectedTag,
  onSelectTag,
  draftBody = '',
  onChangeDraft,
  onSendNote,
  onToggleReaction,
  safetyAcknowledged = true,
  onAcknowledgeSafety,
  safetyMessage = 'Keep this circle gentle and avoid sharing private contact details.',
  enableLabel = 'Enable chat',
  placeholder = 'Share a thought…',
  emptyMessage = 'Nothing here yet—say hello whenever you’re ready.',
  onBlockAuthor,
  onReportNote,
  maxLength = 320,
}) => {
  const { theme } = useTheme();
  const baseFont = theme.fontFamily ? { fontFamily: theme.fontFamily } : null;
  const [menuNoteId, setMenuNoteId] = useState(null);

  const canSend = !!draftBody.trim() && safetyAcknowledged;

  return (
    <View
      style={[
        styles.sectionCard,
        { backgroundColor: theme.cardBg, borderColor: theme.divider },
      ]}
    >
      <Text style={[styles.sectionLabel, baseFont, { color: theme.textSecondary }]}>
        {sectionLabel} · {notes.length}
      </Text>

      {!!dailyPrompt && (
        <View
          style={[
            styles.promptBox,
            { backgroundColor: theme.bg, borderColor: theme.divider },
          ]}
        >
          <Text style={[styles.promptLabel, baseFont, { color: theme.accent }]}>
            {promptLabel}
          </Text>
          <Text style={[styles.promptText, baseFont, { color: theme.textPrimary }]}>
            {dailyPrompt}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.chatThread,
          { backgroundColor: theme.bg, borderColor: theme.divider },
        ]}
      >
        {notes.length === 0 ? (
          <Text style={[styles.emptyText, baseFont, { color: theme.textSecondary }]}>
            {emptyMessage}
          </Text>
        ) : (
          notes.map((note, idx) => {
            const isMine = note.authorId === 'me-local';
            const comp = getCompanionByIndex(idx);
            const menuOpen = menuNoteId === note.id;

            return (
              <View
                key={note.id}
                style={[
                  styles.msgRow,
                  isMine ? styles.msgRowRight : styles.msgRowLeft,
                ]}
              >
                {!isMine && (
                  <View
                    style={[
                      styles.chatAvatar,
                      { backgroundColor: comp.accent || theme.accentSoft },
                    ]}
                  >
                    <Image
                      source={comp.image}
                      style={styles.chatAvatarImg}
                      resizeMode="cover"
                    />
                  </View>
                )}

                <View
                  style={[
                    styles.bubble,
                    {
                      backgroundColor: isMine ? theme.navActive : theme.cardBg,
                      borderColor: isMine ? theme.accent : theme.divider,
                    },
                  ]}
                >
                  <View style={styles.bubbleHead}>
                    <View style={styles.authorMeta}>
                      <Text style={[styles.authorName, baseFont, { color: theme.textPrimary }]}>
                        {note.authorHandle}
                      </Text>
                      {!!note.tag && (
                        <Text style={[styles.tagSub, baseFont, { color: theme.accent }]}>
                          · {note.tag}
                        </Text>
                      )}
                    </View>

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Note options"
                      onPress={() => setMenuNoteId(menuOpen ? null : note.id)}
                      hitSlop={8}
                    >
                      <Text style={[styles.dots, baseFont, { color: theme.textSecondary }]}>
                        {menuOpen ? '×' : '•••'}
                      </Text>
                    </Pressable>
                  </View>

                  {menuOpen && (
                    <View style={styles.menuActions}>
                      {onReportNote && (
                        <Pressable
                          accessibilityRole="button"
                          onPress={() => {
                            onReportNote(note.id);
                            setMenuNoteId(null);
                          }}
                          style={[styles.menuChip, { borderColor: theme.accent }]}
                        >
                          <Text style={[styles.menuChipText, baseFont, { color: theme.accent }]}>
                            Report
                          </Text>
                        </Pressable>
                      )}
                      {!isMine && onBlockAuthor && (
                        <Pressable
                          accessibilityRole="button"
                          onPress={() => {
                            onBlockAuthor(note.authorId);
                            setMenuNoteId(null);
                          }}
                          style={[styles.menuChip, { borderColor: theme.divider }]}
                        >
                          <Text style={[styles.menuChipText, baseFont, { color: theme.textSecondary }]}>
                            Block
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  )}

                  <Text style={[styles.bubbleText, baseFont, { color: theme.textPrimary }]}>
                    {note.body}
                  </Text>

                  <View style={styles.bubbleFoot}>
                    <View style={styles.reactWrap}>
                      {reactions.map((r) => {
                        const active = !!note.reactions?.[r.key];
                        return (
                          <Pressable
                            key={r.key}
                            accessibilityRole="button"
                            accessibilityState={{ selected: active }}
                            onPress={() => onToggleReaction?.(note.id, r.key)}
                            style={[
                              styles.reactTag,
                              {
                                backgroundColor: active ? theme.accentSoft : 'transparent',
                                borderColor: active ? theme.accent : theme.divider,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.reactTagText,
                                baseFont,
                                { color: active ? theme.textPrimary : theme.textSecondary },
                              ]}
                            >
                              {r.label}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                    {!!note.timeLabel && (
                      <Text style={[styles.timeText, baseFont, { color: theme.textSecondary }]}>
                        {note.timeLabel}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>

      {!safetyAcknowledged ? (
        <View
          style={[
            styles.safetyNotice,
            { backgroundColor: theme.bg, borderColor: theme.accent },
          ]}
        >
          <Text style={[styles.mutedTiny, baseFont, { color: theme.textPrimary }]}>
            {safetyMessage}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={onAcknowledgeSafety}
            style={[styles.primaryPillBtn, { backgroundColor: theme.accent, alignSelf: 'flex-start' }]}
          >
            <Text style={[styles.primaryPillText, baseFont, { color: theme.bg }]}>
              {enableLabel}
            </Text>
          </Pressable>
        </View>
      ) : (
        <View
          style={[
            styles.composerBar,
            { backgroundColor: theme.bg, borderColor: theme.divider },
          ]}
        >
          {tags.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagRow}
            >
              {tags.map((tag) => {
                const selected = selectedTag === tag;
                return (
                  <TouchableOpacity
                    key={tag}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => onSelectTag?.(tag)}
                    style={[
                      styles.tagPill,
                      {
                        backgroundColor: selected ? theme.accentSoft : theme.cardBg,
                        borderColor: selected ? theme.accent : theme.divider,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.tagPillText,
                        baseFont,
                        { color: selected ? theme.textPrimary : theme.textSecondary },
                      ]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          <View style={styles.inputRow}>
            <TextInput
              value={draftBody}
              onChangeText={onChangeDraft}
              placeholder={placeholder}
              placeholderTextColor={theme.textMuted}
              maxLength={maxLength}
              multiline
              style={[
                styles.chatInput,
                baseFont,
                {
                  color: theme.textPrimary,
                  backgroundColor: theme.cardBg,
                  borderColor: theme.divider,
                },
              ]}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Send note"
              disabled={!canSend}
              onPress={onSendNote}
              style={[
                styles.sendBtn,
                { backgroundColor: theme.accent },
                !canSend && styles.dimmed,
              ]}
            >
              <Text style={[styles.sendIcon, baseFont, { color: theme.bg }]}>→</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};