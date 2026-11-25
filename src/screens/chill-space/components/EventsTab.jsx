import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useI18n } from '../../../services/i18n';
import { WeatherService } from '../../../services/weatherService';
import { initialEvents } from '../chillData';
import { styles } from '../styles/ChillScreen.styles';

export const EventsTab = () => {
  const { theme } = useTheme();
  const { countryData } = useI18n();
  const [events, setEvents] = useState(initialEvents);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'nearby' | 'online'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [weatherLine, setWeatherLine] = useState('');

  const activeCity = countryData?.capital && countryData.capital !== 'Global'
    ? countryData.capital
    : 'Nairobi';

  useEffect(() => {
    let mounted = true;
    const lat = countryData?.lat ?? -1.2921;
    const lon = countryData?.lon ?? 36.8219;
    WeatherService.getCurrentWeather(lat, lon, activeCity).then((w) => {
      if (mounted && w) {
        setWeatherLine(`${w.icon} ${w.temperature}°C · ${w.condition}`);
      }
    });
    return () => {
      mounted = false;
    };
  }, [countryData?.code, activeCity]);

  const filteredEvents = useMemo(() => {
    if (filterMode === 'online') return events.filter((ev) => ev.isOnline);
    if (filterMode === 'nearby') {
      return events.filter(
        (ev) =>
          ev.isOnline ||
          ev.city?.toLowerCase() === activeCity.toLowerCase() ||
          ev.country?.toLowerCase() === countryData?.name?.toLowerCase()
      );
    }
    return events;
  }, [events, filterMode, activeCity, countryData?.name]);

  function handleRsvp(id) {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== id) return ev;
        const nextGoing = !ev.isGoing;
        return {
          ...ev,
          isGoing: nextGoing,
          joinedCount: nextGoing ? ev.joinedCount + 1 : Math.max(0, ev.joinedCount - 1),
        };
      })
    );
    setSelectedEvent((prev) => {
      if (!prev || prev.id !== id) return prev;
      const nextGoing = !prev.isGoing;
      return {
        ...prev,
        isGoing: nextGoing,
        joinedCount: nextGoing ? prev.joinedCount + 1 : Math.max(0, prev.joinedCount - 1),
      };
    });
  }

  function handleOpenDirections(ev) {
    const dest =
      ev.lat && ev.lon
        ? `${ev.lat},${ev.lon}`
        : encodeURIComponent(ev.locationStr || ev.city || 'Nairobi');

    const openUrl = (originParam = '') => {
      const url = `https://www.google.com/maps/dir/?api=1${originParam}&destination=${dest}&travelmode=transit`;
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        Linking.openURL(url).catch(() => {});
      }
    };

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          openUrl(`&origin=${pos.coords.latitude},${pos.coords.longitude}`);
        },
        () => openUrl(''),
        { timeout: 3500 }
      );
    } else {
      openUrl('');
    }
  }

  return (
    <View>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.sectionHeading, { color: theme?.textPrimary || '#2A192E' }]}>
            East Africa Wellness Circles 🗓️
          </Text>
          <Text style={[styles.sectionSubtext, { color: theme?.textMuted || '#7E726D' }]}>
            Physical gatherings around you & online circles open everywhere
          </Text>
        </View>
      </View>

      {/* Location & Live Weather Context Bar */}
      <View
        style={[
          styles.card,
          {
            padding: 14,
            marginBottom: 12,
            backgroundColor: theme?.cardBg || '#FFFFFF',
            borderColor: theme?.divider || '#E8DFF2',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          },
        ]}
      >
        <Text style={{ fontSize: 18 }}>📍</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12.5, fontWeight: '800', color: theme?.textPrimary || '#2A192E' }}>
            Showing Circles for {activeCity} ({countryData?.name || 'Kenya'})
          </Text>
          <Text style={{ fontSize: 11, color: theme?.textMuted || '#7E726D', marginTop: 2 }}>
            {weatherLine || 'East Africa Region'}
          </Text>
        </View>
      </View>

      {/* Filter Pills */}
      <View style={[styles.chipRow, { marginBottom: 14 }]}>
        {[
          { id: 'all', label: `All Circles (${events.length})` },
          { id: 'nearby', label: `Nearby ${activeCity} 📍` },
          { id: 'online', label: 'Online Rooms 🌐' },
        ].map((pill) => {
          const active = filterMode === pill.id;
          return (
            <TouchableOpacity
              key={pill.id}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? (theme?.accent || '#E06D3B') : (theme?.cardBg || '#FFFFFF'),
                  borderColor: active ? (theme?.accent || '#E06D3B') : (theme?.divider || '#E8DFF2'),
                  borderWidth: 1,
                },
              ]}
              onPress={() => setFilterMode(pill.id)}
            >
              <Text style={[styles.chipText, { color: active ? '#FFFFFF' : (theme?.textPrimary || '#2A192E') }]}>
                {pill.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Event Cards */}
      {filteredEvents.map((ev) => (
        <TouchableOpacity
          key={ev.id}
          style={[
            styles.card,
            {
              backgroundColor: theme?.cardBg || '#FFFFFF',
              borderColor: ev.isLive ? '#DC2626' : (theme?.divider || '#E8DFF2'),
            },
          ]}
          onPress={() => setSelectedEvent(ev)}
          activeOpacity={0.86}
        >
          {ev.isLive && (
            <View style={[styles.liveBadge, { alignSelf: 'flex-start', marginBottom: 8 }]}>
              <Text style={styles.liveText}>● HAPPENING NOW · TAP TO JOIN</Text>
            </View>
          )}

          <View style={styles.cardTop}>
            <View style={styles.authorRow}>
              <View style={[styles.avatar, { backgroundColor: ev.emojiBg }]}>
                <Text style={{ fontSize: 20 }}>{ev.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.authorName, { color: theme?.textPrimary || '#2A192E' }]}>{ev.title}</Text>
                <Text style={styles.metaText}>{ev.host}</Text>
                <Text style={{ fontSize: 11, fontWeight: '700', color: ev.isOnline ? '#16A34A' : '#E06D3B', marginTop: 2 }}>
                  {ev.isOnline ? '🌐 Online · Open across East Africa' : `📍 ${ev.locationStr}`}
                </Text>
              </View>
            </View>

            <View style={{ backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
              <Text style={{ fontSize: 10.5, fontWeight: '800', color: '#166534' }}>{ev.tag}</Text>
            </View>
          </View>

          <Text style={[styles.bodyText, { color: theme?.textSecondary || '#5C4D60' }]} numberOfLines={2}>
            {ev.description}
          </Text>

          <View style={styles.cardBottom}>
            <View>
              <Text style={[styles.authorName, { fontSize: 12, color: theme?.textPrimary || '#2A192E' }]}>
                📅 {ev.dateStr}
              </Text>
              <Text style={styles.metaText}>
                {ev.joinedCount}/{ev.capacity} joined
              </Text>
            </View>

            <View style={[styles.rsvpBtn, ev.isGoing && styles.rsvpBtnGoing]}>
              <Text style={[styles.rsvpText, ev.isGoing && styles.rsvpTextGoing]}>
                {ev.isGoing ? 'Going ✓' : 'View Details →'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      {/* Event Details Popup Modal (with Map & Directions for physical events) */}
      <Modal
        visible={!!selectedEvent}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedEvent(null)}
      >
        <View style={styles.modalBg}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: theme?.cardBg || '#FFFFFF',
                borderRadius: 28,
                maxHeight: '88%',
                borderWidth: 1,
                borderColor: theme?.divider || '#E8DFF2',
              },
            ]}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                <View style={[styles.avatar, { backgroundColor: selectedEvent?.emojiBg || '#FCEFE9' }]}>
                  <Text style={{ fontSize: 22 }}>{selectedEvent?.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: theme?.textPrimary || '#2A192E' }}>
                    {selectedEvent?.title}
                  </Text>
                  <Text style={{ fontSize: 12, color: theme?.textMuted || '#7E726D' }}>
                    {selectedEvent?.host}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setSelectedEvent(null)} style={{ padding: 6 }}>
                <Text style={{ fontSize: 17, fontWeight: '700', color: theme?.textMuted || '#7E726D' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedEvent && (
                <>
                  <View style={{ backgroundColor: theme?.bg || '#FAF6EF', borderRadius: 16, padding: 14, gap: 6, marginBottom: 12 }}>
                    <Text style={{ fontSize: 12.5, fontWeight: '700', color: theme?.textPrimary || '#2A192E' }}>
                      📅 {selectedEvent.dateStr}
                    </Text>
                    <Text style={{ fontSize: 12.5, fontWeight: '700', color: selectedEvent.isOnline ? '#16A34A' : '#E06D3B' }}>
                      {selectedEvent.isOnline ? `🌐 ${selectedEvent.locationStr}` : `📍 ${selectedEvent.locationStr}`}
                    </Text>
                    <Text style={{ fontSize: 12, color: theme?.textMuted || '#7E726D' }}>
                      👥 {selectedEvent.joinedCount}/{selectedEvent.capacity} joined · {selectedEvent.tag}
                    </Text>
                  </View>

                  <Text style={[styles.bodyText, { fontSize: 14, lineHeight: 22, color: theme?.textSecondary || '#5C4D60' }]}>
                    {selectedEvent.description}
                  </Text>

                  {/* Embedded Interactive Map Preview for Physical Events on Web */}
                  {!selectedEvent.isOnline && selectedEvent.lat && selectedEvent.lon && Platform.OS === 'web' && (
                    <View style={{ borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: theme?.divider || '#E8DFF2', marginTop: 10, marginBottom: 12, height: 170 }}>
                      <iframe
                        title="Event Map"
                        width="100%"
                        height="170"
                        style={{ border: 0 }}
                        loading="lazy"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedEvent.lon - 0.015}%2C${selectedEvent.lat - 0.012}%2C${selectedEvent.lon + 0.015}%2C${selectedEvent.lat + 0.012}&layer=mapnik&marker=${selectedEvent.lat}%2C${selectedEvent.lon}`}
                      />
                    </View>
                  )}

                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                    {!selectedEvent.isOnline && (
                      <TouchableOpacity
                        style={[styles.primaryBtn, { flex: 1, backgroundColor: '#1F6F78' }]}
                        onPress={() => handleOpenDirections(selectedEvent)}
                      >
                        <Text style={styles.primaryBtnText}>📍 Directions</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={[
                        styles.primaryBtn,
                        {
                          flex: 1,
                          backgroundColor: selectedEvent.isGoing ? '#16A34A' : (theme?.accent || '#E06D3B'),
                        },
                      ]}
                      onPress={() => handleRsvp(selectedEvent.id)}
                    >
                      <Text style={styles.primaryBtnText}>
                        {selectedEvent.isGoing ? 'Going ✓' : "I'm going"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};
