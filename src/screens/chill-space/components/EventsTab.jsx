import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { initialEvents } from '../chillData';
import { styles } from '../styles/ChillScreen.styles';

export const EventsTab = () => {
  const [events, setEvents] = useState(initialEvents);

  function handleRsvp(id) {
    const updated = events.map((ev) => {
      if (ev.id === id) {
        if (ev.isGoing) {
          return { ...ev, isGoing: false, joinedCount: ev.joinedCount - 1 };
        }
        return { ...ev, isGoing: true, joinedCount: ev.joinedCount + 1 };
      }
      return ev;
    });
    setEvents(updated);
  }

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeading}>🎟️ Healing Circles & Events</Text>
        <Text style={styles.sectionSubtext}>East Africa UTC+3</Text>
      </View>

      {events.map((ev) => (
        <View key={ev.id} style={styles.card}>
          <View style={styles.cardTop}>
            <View style={styles.authorRow}>
              <View style={[styles.avatar, { backgroundColor: ev.emojiBg }]}>
                <Text style={{ fontSize: 20 }}>{ev.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.authorName}>{ev.title}</Text>
                <Text style={styles.metaText}>Hosted by {ev.host}</Text>
              </View>
            </View>

            {ev.isLive && (
              <View style={styles.liveBadge}>
                <Text style={styles.liveText}>● LIVE</Text>
              </View>
            )}
          </View>

          <Text style={styles.bodyText}>{ev.description}</Text>

          <View style={styles.cardBottom}>
            <View>
              <Text style={styles.authorName}>📅 {ev.dateStr}</Text>
              <Text style={styles.metaText}>
                {ev.joinedCount}/{ev.capacity} joined{ev.extraNote}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.rsvpBtn, ev.isGoing && styles.rsvpBtnGoing]}
              onPress={() => handleRsvp(ev.id)}
            >
              <Text style={[styles.rsvpText, ev.isGoing && styles.rsvpTextGoing]}>
                {ev.isGoing ? 'Going ✓' : 'RSVP'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};