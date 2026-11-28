// src/components/modals/ShareToCircleModal.jsx
// Lets users share any Meme, Story, or Podcast from Chill Space directly into their Community Circles.
// Respects internal age/gender matching without exposing cohort labels to the user.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  } from 'react-native';
import { s } from './styles/ShareToCircleModal.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../theme/ThemeContext';
import { onboardingStorage } from '../../services/onboardingStorage';
import { AuthService } from '../../core/api/authService';
import { getMatchingCirclesForUser } from '../../features/community/services/circleMatchingService';
import { apiClient } from '../../core/api/client';
import { showAlert } from '../../utils/alert';

export function formatChillShareText(type, item) {
  if (!item) return '';
  if (type === 'meme') {
    const title = item.title || 'Check out this meme';
    const sub = item.subtext ? `\n${item.subtext}` : '';
    const link = item.imageUrl ? `\n${item.imageUrl}` : '';
    return `😂 Shared a Chill Meme:\n"${title}"${sub}${link}`;
  }
  if (type === 'story') {
    const title = item.title || 'Community Story';
    const excerpt = item.excerpt || item.description || '';
    const short = excerpt.length > 160 ? `${excerpt.slice(0, 157)}...` : excerpt;
    const link = item.url ? `\nRead more: ${item.url}` : '';
    return `📖 Shared a Story — "${title}":\n${short}${link}`;
  }
  if (type === 'podcast') {
    const title = item.title || item.trackName || 'Wellness Audio';
    const host = item.collectionName || item.guide || 'MindBloom Sanctuary';
    const link = item.audioUrl || item.previewUrl ? `\nListen: ${item.audioUrl || item.previewUrl}` : '';
    return `🎧 Shared a Podcast/Audio:\n"${title}" · ${host}${link}`;
  }
  return item.title || '';
}

export const ShareToCircleModal = ({ visible, type, item, onClose, onShared }) => {
  const { theme } = useTheme();
  const [circles, setCircles] = useState([]);
  const [sendingId, setSendingId] = useState(null);
  const [userName, setUserName] = useState('You');

  useEffect(() => {
    if (!visible) return;
    (async () => {
      try {
        const [prefs, user] = await Promise.all([
          onboardingStorage.getPreferences(),
          AuthService.getStoredUser(),
        ]);
        const nick = user?.nickname || prefs?.nickname || 'You';
        setUserName(nick);
        const match = getMatchingCirclesForUser({
          age: prefs?.ageBand || user?.ageBand || prefs?.age || '18-24',
          gender: prefs?.gender || user?.gender || 'prefer_not',
          focusAreas: prefs?.focusAreas || user?.primaryStruggles || [],
          interests: prefs?.interests || user?.interests || [],
        });
        setCircles(match.eligibleCircles || []);
      } catch {
        setCircles([]);
      }
    })();
  }, [visible]);

  const handleSendToCircle = async (circle) => {
    if (!circle || !item) return;
    setSendingId(circle.id);
    const text = formatChillShareText(type, item);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      let savedMsg = {
        id: `msg-${Date.now()}`,
        sender: userName,
        isMe: true,
        text,
        time: timeStr,
        dateLabel: 'Today',
        reactions: { hugs: 0, hearts: 0, pray: 0, green: 0 },
      };

      try {
        const res = await apiClient.post(`/community/circles/${circle.id}/messages`, { text });
        if (res?.data?.data?.id) {
          savedMsg.id = res.data.data.id;
        }
      } catch {
        // Offline / network fallback: still persist locally in circle cache
      }

      const storageKey = `@mindbloom:baraza_msgs_${circle.id}`;
      const raw = await AsyncStorage.getItem(storageKey);
      const existing = raw ? JSON.parse(raw) : [];
      existing.push(savedMsg);
      await AsyncStorage.setItem(storageKey, JSON.stringify(existing));

      onShared?.(circle, savedMsg);
      onClose?.();
      showAlert('Shared to Circle 💬', `Sent to ${circle.title}!`);
    } finally {
      setSendingId(null);
    }
  };

  const previewText = formatChillShareText(type, item);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={[s.card, { backgroundColor: theme.cardBg, borderColor: theme.divider || '#E8DFF2' }]}>
          <View style={s.header}>
            <View style={{ flex: 1 }}>
              <Text style={[s.tag, { color: theme.textMuted }]}>SHARE TO COMMUNITY</Text>
              <Text style={[s.title, { color: theme.textPrimary }]}>Send to a Circle 💬</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={{ padding: 6 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: theme.textMuted }}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={[s.previewBox, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
            <Text style={[s.previewText, { color: theme.textSecondary }]} numberOfLines={3}>
              {previewText}
            </Text>
          </View>

          <Text style={[s.label, { color: theme.textMuted }]}>Choose a circle:</Text>
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 280 }}>
            <View style={{ gap: 8 }}>
              {circles.map((c) => {
                const isSending = sendingId === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[s.row, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}
                    onPress={() => handleSendToCircle(c)}
                    disabled={!!sendingId}
                    activeOpacity={0.8}
                  >
                    <View style={[s.iconBox, { backgroundColor: c.iconBg || '#EFE8FA' }]}>
                      <Text style={{ fontSize: 18 }}>{c.icon || '💬'}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[s.circleName, { color: theme.textPrimary }]}>{c.title}</Text>
                      <Text style={[s.circleMeta, { color: theme.textMuted }]} numberOfLines={1}>
                        {c.description || 'Tap to share with peers'}
                      </Text>
                    </View>
                    {isSending ? (
                      <ActivityIndicator size="small" color={theme.accent} />
                    ) : (
                      <Text style={{ fontSize: 12, fontWeight: '800', color: theme.accent }}>Send →</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
