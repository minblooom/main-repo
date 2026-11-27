// src/screens/chill-space/components/EventsTab.jsx
// Location-first wellness events with public OpenStreetMap Overpass + Open-Meteo APIs,
// dynamic location switching, live RSVP sync, and verifiable Digital Event Passes
// for both physical and online events.

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useI18n } from '../../../services/i18n';
import { WeatherService } from '../../../services/weatherService';
import { onboardingStorage } from '../../../services/onboardingStorage';
import { AuthService } from '../../../core/api/authService';
import {
  fetchLocalPublicEvents,
  sortEventsByLocation,
  getRsvpPasses,
  saveRsvpPass,
  removeRsvpPass,
} from '../../../services/eventsService';
import { LocationPickerModal } from '../../../components/modals/LocationPickerModal';
import { apiClient } from '../../../core/api/client';
import { initialEvents } from '../chillData';
import { styles } from '../styles/ChillScreen.styles';

function buildGCalUrl(ev) {
  const title = encodeURIComponent(ev.title || '');
  const location = encodeURIComponent(ev.locationStr || (ev.isOnline ? 'Online' : ''));
  const details = encodeURIComponent(ev.description || '');
  const toGCal = (iso) => (iso ? iso.replace(/[-:]/g, '').replace('.000', '') : '');
  const start = toGCal(ev.startISO);
  const end = toGCal(ev.endISO);
  const dates = start && end ? `${start}/${end}` : '';
  return `https://calendar.google.com/calendar/r/eventedit?text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

function openUrl(url) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    Linking.openURL(url).catch(() => {});
  }
}

// Deterministic 7x7 visual verification matrix generated from ticketCode
function buildPassMatrix(code = 'MB-PASS') {
  const rows = 7;
  const cols = 7;
  let seed = 0;
  for (let i = 0; i < code.length; i++) {
    seed = (seed * 31 + code.charCodeAt(i)) % 99991;
  }
  const grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      // Corner finder anchors for authentic pass look
      const isCorner =
        (r < 2 && c < 2) ||
        (r < 2 && c >= cols - 2) ||
        (r >= rows - 2 && c < 2);
      if (isCorner) {
        row.push(true);
      } else {
        const bit = ((seed >> ((r * cols + c) % 16)) + r * 3 + c * 5) % 2 === 0;
        row.push(bit);
      }
    }
    grid.push(row);
  }
  return grid;
}

export const EventsTab = () => {
  const { theme } = useTheme();
  const { countryData, location } = useI18n();
  const [baseEvents, setBaseEvents] = useState(initialEvents);
  const [localPublicEvents, setLocalPublicEvents] = useState([]);
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'nearby' | 'online' | 'rsvps'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [weatherLine, setWeatherLine] = useState('');
  const [rsvpPasses, setRsvpPasses] = useState({});
  const [activePassEvent, setActivePassEvent] = useState(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [attendeeName, setAttendeeName] = useState('MindBloom Member');

  const activeCity = location?.city || (countryData?.capital && countryData.capital !== 'Global' ? countryData.capital : 'Nairobi');
  const activeCountry = location?.country || countryData?.name || 'Kenya';
  const activeLat = typeof location?.lat === 'number' ? location.lat : (countryData?.lat ?? -1.2921);
  const activeLon = typeof location?.lon === 'number' ? location.lon : (countryData?.lon ?? 36.8219);

  // Load attendee name & saved local RSVP passes
  useEffect(() => {
    Promise.all([
      onboardingStorage.getPreferences(),
      AuthService.getStoredUser(),
      getRsvpPasses(),
    ])
      .then(([prefs, user, passes]) => {
        const nick = user?.nickname || prefs?.nickname;
        if (nick) setAttendeeName(nick);
        if (passes) setRsvpPasses(passes);
      })
      .catch(() => {});
  }, []);

  // Re-fetch live weather, local public OSM venues, and backend RSVPs whenever location changes
  useEffect(() => {
    let mounted = true;

    WeatherService.getCurrentWeather(activeLat, activeLon, activeCity).then((w) => {
      if (mounted && w) {
        setWeatherLine(`${w.icon} ${w.temperature}°C · ${w.condition}`);
      }
    });

    setLoadingLocal(true);
    fetchLocalPublicEvents({
      lat: activeLat,
      lon: activeLon,
      city: activeCity,
      country: activeCountry,
    })
      .then((discovered) => {
        if (mounted) setLocalPublicEvents(discovered);
      })
      .finally(() => {
        if (mounted) setLoadingLocal(false);
      });

    apiClient
      .get('/community/events/rsvps')
      .then(async (res) => {
        const data = res?.data?.data;
        if (!mounted || !data) return;
        const myIds = new Set(data.myEventIds || []);
        const counts = data.counts || {};
        const serverPasses = data.myPasses || {};

        // Hydrate local pass store with canonical server ticketCodes for cross-device sync
        let updatedLocalPasses = { ...rsvpPasses };
        for (const evId of myIds) {
          const code = serverPasses[evId];
          if (code && (!updatedLocalPasses[evId] || updatedLocalPasses[evId].ticketCode !== code)) {
            const matchedEv = [...baseEvents, ...localPublicEvents].find((e) => e.id === evId) || { id: evId };
            updatedLocalPasses = await saveRsvpPass(matchedEv, attendeeName, code);
          }
        }
        if (mounted) setRsvpPasses(updatedLocalPasses);

        setBaseEvents((prev) =>
          prev.map((ev) => ({
            ...ev,
            isGoing: myIds.has(ev.id) || !!updatedLocalPasses[ev.id],
            joinedCount: typeof counts[ev.id] === 'number' ? counts[ev.id] : ev.joinedCount,
          }))
        );
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [activeCity, activeCountry, activeLat, activeLon]);

  // Merge curated + Overpass API discovered events, apply RSVP state, and sort strictly location-first
  const sortedEvents = useMemo(() => {
    const merged = [...baseEvents, ...localPublicEvents].map((ev) => ({
      ...ev,
      isGoing: ev.isGoing || !!rsvpPasses[ev.id],
    }));
    return sortEventsByLocation(merged, {
      city: activeCity,
      country: activeCountry,
      lat: activeLat,
      lon: activeLon,
    });
  }, [baseEvents, localPublicEvents, rsvpPasses, activeCity, activeCountry, activeLat, activeLon]);

  const rsvpCount = useMemo(
    () => sortedEvents.filter((ev) => ev.isGoing).length,
    [sortedEvents]
  );

  const filteredEvents = useMemo(() => {
    if (filterMode === 'online') return sortedEvents.filter((ev) => ev.isOnline);
    if (filterMode === 'nearby') {
      return sortedEvents.filter((ev) => !ev.isOnline && (ev.sameCity || ev.sameCountry));
    }
    if (filterMode === 'rsvps') return sortedEvents.filter((ev) => ev.isGoing);
    return sortedEvents;
  }, [sortedEvents, filterMode]);

  async function handleRsvp(targetEv) {
    if (!targetEv) return;
    const id = targetEv.id;
    const nextGoing = !targetEv.isGoing;

    // 1. Optimistic local pass & UI update
    let localTicketCode;
    if (nextGoing) {
      const updatedPasses = await saveRsvpPass(targetEv, attendeeName);
      setRsvpPasses(updatedPasses);
      localTicketCode = updatedPasses[id]?.ticketCode;
    } else {
      const updatedPasses = await removeRsvpPass(id);
      setRsvpPasses(updatedPasses);
    }

    const updateList = (list) =>
      list.map((ev) =>
        ev.id === id
          ? {
              ...ev,
              isGoing: nextGoing,
              joinedCount: nextGoing ? ev.joinedCount + 1 : Math.max(0, ev.joinedCount - 1),
            }
          : ev
      );

    setBaseEvents(updateList);
    setLocalPublicEvents(updateList);
    setSelectedEvent((prev) =>
      prev && prev.id === id
        ? {
            ...prev,
            isGoing: nextGoing,
            joinedCount: nextGoing ? prev.joinedCount + 1 : Math.max(0, prev.joinedCount - 1),
          }
        : prev
    );

    if (nextGoing) {
      setActivePassEvent({ ...targetEv, isGoing: true });
    }

    // 2. Sync to backend in background
    try {
      const res = await apiClient.post(`/community/events/${id}/rsvp`, {
        eventTitle: targetEv.title,
        eventDateStr: targetEv.dateStr,
        ticketCode: localTicketCode,
      });
      const serverData = res?.data?.data;
      if (serverData) {
        if (serverData.isGoing && serverData.ticketCode) {
          const syncedPasses = await saveRsvpPass(targetEv, attendeeName, serverData.ticketCode);
          setRsvpPasses(syncedPasses);
        }
        const syncServer = (list) =>
          list.map((ev) =>
            ev.id === id
              ? { ...ev, isGoing: serverData.isGoing, joinedCount: serverData.rsvpCount }
              : ev
          );
        setBaseEvents(syncServer);
        setLocalPublicEvents(syncServer);
      }
    } catch {}
  }

  function handleOpenDirections(ev) {
    const dest =
      ev.lat && ev.lon
        ? `${ev.lat},${ev.lon}`
        : encodeURIComponent(ev.locationStr || ev.city || activeCity);

    const doOpen = (originParam = '') => {
      openUrl(`https://www.google.com/maps/dir/?api=1${originParam}&destination=${dest}&travelmode=transit`);
    };

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => doOpen(`&origin=${pos.coords.latitude},${pos.coords.longitude}`),
        () => doOpen(''),
        { timeout: 3500 }
      );
    } else {
      doOpen('');
    }
  }

  const activePass = activePassEvent ? rsvpPasses[activePassEvent.id] : null;
  const passMatrix = useMemo(
    () => (activePass ? buildPassMatrix(activePass.ticketCode) : []),
    [activePass?.ticketCode]
  );

  return (
    <View>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.sectionHeading, { color: theme?.textPrimary || '#2A192E' }]}>
            Wellness Events Near You 🗓️
          </Text>
          <Text style={[styles.sectionSubtext, { color: theme?.textMuted || '#7E726D' }]}>
            Physical events in your area appear first, followed by other cities & online rooms
          </Text>
        </View>
      </View>

      {/* Location & Live Weather Context Bar with Change Location */}
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
            {activeCity}, {activeCountry}
          </Text>
          <Text style={{ fontSize: 11, color: theme?.textMuted || '#7E726D', marginTop: 2 }}>
            {weatherLine || 'Adapting local events'} {loadingLocal ? '· Finding nearby parks...' : ''}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setLocationModalOpen(true)}
          style={{
            backgroundColor: theme?.accentSoft || '#F0EAFA',
            borderColor: theme?.accentBorder || theme?.accent || '#42213D',
            borderWidth: 1,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 12,
          }}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 11.5, fontWeight: '800', color: theme?.accent || '#42213D' }}>
            Change 📍
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Pills */}
      <View style={[styles.chipRow, { marginBottom: 14 }]}>
        {[
          { id: 'all', label: `All (${sortedEvents.length})` },
          { id: 'nearby', label: `Near ${activeCity} 📍` },
          { id: 'online', label: 'Online Rooms 🌍' },
          { id: 'rsvps', label: `My Passes (${rsvpCount}) 🎟️` },
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

      {loadingLocal && filteredEvents.length === 0 && (
        <View style={{ paddingVertical: 24, alignItems: 'center' }}>
          <ActivityIndicator size="small" color={theme?.accent || '#42213D'} />
          <Text style={{ marginTop: 8, fontSize: 12, color: theme?.textMuted }}>
            Discovering wellness spaces in {activeCity}...
          </Text>
        </View>
      )}

      {filteredEvents.length === 0 && !loadingLocal && (
        <View style={[styles.card, { backgroundColor: theme?.cardBg || '#FFF', borderColor: theme?.divider || '#E8DFF2', alignItems: 'center', padding: 24 }]}>
          <Text style={{ fontSize: 28, marginBottom: 6 }}>🗓️</Text>
          <Text style={{ fontSize: 14, fontWeight: '800', color: theme?.textPrimary }}>
            {filterMode === 'rsvps' ? 'No RSVP passes yet' : `No nearby physical events found in ${activeCity}`}
          </Text>
          <Text style={{ fontSize: 12, color: theme?.textMuted, textAlign: 'center', marginTop: 4 }}>
            {filterMode === 'rsvps'
              ? 'Tap "I\'m going" on any event to get your digital pass.'
              : 'Try switching to "All" to see regional & online circles, or change your city.'}
          </Text>
        </View>
      )}

      {/* Event Cards */}
      {filteredEvents.map((ev) => {
        const distBadge = !ev.isOnline && typeof ev.distanceKm === 'number'
          ? ev.distanceKm < 1
            ? '<1 km away'
            : `${Math.round(ev.distanceKm)} km away`
          : null;

        return (
          <TouchableOpacity
            key={ev.id}
            style={[
              styles.card,
              {
                backgroundColor: theme?.cardBg || '#FFFFFF',
                borderColor: ev.isLive ? '#DC2626' : ev.sameCity ? (theme?.accent || '#E06D3B') : (theme?.divider || '#E8DFF2'),
              },
            ]}
            onPress={() => setSelectedEvent(ev)}
            activeOpacity={0.86}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
              {ev.isLive && (
                <View style={styles.liveBadge}>
                  <Text style={styles.liveText}>● HAPPENING NOW</Text>
                </View>
              )}
              {!ev.isOnline && ev.sameCity && (
                <View style={{ backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#92400E' }}>
                    📍 IN {activeCity.toUpperCase()} {distBadge ? `· ${distBadge}` : ''}
                  </Text>
                </View>
              )}
              {ev.isDiscovered && (
                <View style={{ backgroundColor: '#E0F2FE', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#0369A1' }}>
                    LIVE LOCAL VENUE
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.cardTop}>
              <View style={styles.authorRow}>
                <View style={[styles.avatar, { backgroundColor: ev.emojiBg }]}>
                  <Text style={{ fontSize: 20 }}>{ev.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.authorName, { color: theme?.textPrimary || '#2A192E' }]}>{ev.title}</Text>
                  <Text style={styles.metaText}>{ev.host}</Text>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: ev.isOnline ? '#16A34A' : '#E06D3B', marginTop: 2 }}>
                    {ev.isOnline
                      ? '🌍 Online · Join from anywhere'
                      : `📍 ${ev.locationStr}${!ev.sameCity && distBadge ? ` (${distBadge})` : ''}`}
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

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                {ev.isGoing && (
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation?.();
                      setActivePassEvent(ev);
                    }}
                    style={{
                      backgroundColor: '#42213D',
                      paddingHorizontal: 10,
                      paddingVertical: 7,
                      borderRadius: 12,
                    }}
                  >
                    <Text style={{ fontSize: 11.5, fontWeight: '800', color: '#FFFFFF' }}>🎟️ My Pass</Text>
                  </TouchableOpacity>
                )}
                <View style={[styles.rsvpBtn, ev.isGoing && styles.rsvpBtnGoing]}>
                  <Text style={[styles.rsvpText, ev.isGoing && styles.rsvpTextGoing]}>
                    {ev.isGoing ? 'Going ✓' : 'Details →'}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Event Details Popup Modal */}
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
                      {selectedEvent.isOnline ? `🌍 ${selectedEvent.locationStr}` : `📍 ${selectedEvent.locationStr}`}
                    </Text>
                    <Text style={{ fontSize: 12, color: theme?.textMuted || '#7E726D' }}>
                      👥 {selectedEvent.joinedCount}/{selectedEvent.capacity} joined · {selectedEvent.tag}
                    </Text>
                  </View>

                  <Text style={[styles.bodyText, { fontSize: 14, lineHeight: 22, color: theme?.textSecondary || '#5C4D60' }]}>
                    {selectedEvent.description}
                  </Text>

                  {!selectedEvent.isOnline && selectedEvent.lat && selectedEvent.lon && (
                    Platform.OS === 'web' ? (
                      <View style={{ borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: theme?.divider || '#E8DFF2', marginTop: 10, marginBottom: 12, height: 190 }}>
                        <iframe
                          title="Event Map"
                          width="100%"
                          height="190"
                          style={{ border: 0 }}
                          loading="lazy"
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedEvent.lon - 0.015}%2C${selectedEvent.lat - 0.012}%2C${selectedEvent.lon + 0.015}%2C${selectedEvent.lat + 0.012}&layer=mapnik&marker=${selectedEvent.lat}%2C${selectedEvent.lon}`}
                        />
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={{
                          borderRadius: 16,
                          borderWidth: 1,
                          borderColor: theme?.divider || '#E8DFF2',
                          backgroundColor: theme?.heroBg || '#F7F3FB',
                          padding: 14,
                          marginTop: 10,
                          marginBottom: 12,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                        onPress={() => openUrl(`https://www.openstreetmap.org/?mlat=${selectedEvent.lat}&mlon=${selectedEvent.lon}#map=15/${selectedEvent.lat}/${selectedEvent.lon}`)}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 13, fontWeight: '800', color: theme?.textPrimary || '#2A192E' }}>
                            🗺️ Open Interactive Map
                          </Text>
                          <Text style={{ fontSize: 11.5, color: theme?.textMuted || '#7E726D', marginTop: 2 }}>
                            {selectedEvent.lat.toFixed(4)}, {selectedEvent.lon.toFixed(4)} · Tap to view pin
                          </Text>
                        </View>
                        <Text style={{ fontSize: 13, fontWeight: '800', color: theme?.accent || '#E06D3B' }}>View ↗</Text>
                      </TouchableOpacity>
                    )
                  )}

                  {selectedEvent.joinUrl && (
                    <TouchableOpacity
                      style={[styles.primaryBtn, { backgroundColor: '#42213D', marginTop: 6, marginBottom: 6 }]}
                      onPress={() => openUrl(selectedEvent.joinUrl)}
                    >
                      <Text style={styles.primaryBtnText}>
                        {selectedEvent.isOnline ? '🔗 Join Live Session / Portal ↗' : '🔗 Event Info & Updates ↗'}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {selectedEvent.isGoing && (
                    <TouchableOpacity
                      style={[styles.primaryBtn, { backgroundColor: '#3B254A', marginTop: 4, marginBottom: 6 }]}
                      onPress={() => {
                        setSelectedEvent(null);
                        setActivePassEvent(selectedEvent);
                      }}
                    >
                      <Text style={styles.primaryBtnText}>🎟️ View My Digital Event Pass</Text>
                    </TouchableOpacity>
                  )}

                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
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
                      onPress={() => handleRsvp(selectedEvent)}
                    >
                      <Text style={styles.primaryBtnText}>
                        {selectedEvent.isGoing ? 'Going ✓ (Tap to Cancel)' : "I'm going · Get Pass"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Digital RSVP Pass Modal (Physical Entry Pass / Online Join Hub + Calendar Reminder) */}
      <Modal
        visible={!!activePassEvent && !!activePass}
        transparent
        animationType="slide"
        onRequestClose={() => setActivePassEvent(null)}
      >
        <View style={styles.modalBg}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: theme?.cardBg || '#FFFFFF',
                borderRadius: 28,
                borderWidth: 1,
                borderColor: theme?.divider || '#E8DFF2',
                padding: 22,
              },
            ]}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 }}>
                <Text style={{ fontSize: 11, fontWeight: '800', color: '#166534' }}>
                  ✓ CONFIRMED RSVP PASS
                </Text>
              </View>
              <TouchableOpacity onPress={() => setActivePassEvent(null)} style={{ padding: 4 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: theme?.textMuted }}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 18, fontWeight: '800', color: theme?.textPrimary, marginBottom: 4 }}>
              {activePassEvent?.emoji} {activePassEvent?.title}
            </Text>
            <Text style={{ fontSize: 12.5, color: theme?.textSecondary, marginBottom: 14 }}>
              📅 {activePassEvent?.dateStr}
            </Text>

            {/* Scannable Verification Matrix + Code */}
            <View
              style={{
                backgroundColor: theme?.heroBg || '#F7F3FB',
                borderRadius: 18,
                padding: 16,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: theme?.heroBorder || '#E8DFF2',
                marginBottom: 14,
              }}
            >
              <View style={{ backgroundColor: '#FFFFFF', padding: 10, borderRadius: 12, marginBottom: 10 }}>
                {passMatrix.map((row, rIdx) => (
                  <View key={rIdx} style={{ flexDirection: 'row' }}>
                    {row.map((filled, cIdx) => (
                      <View
                        key={cIdx}
                        style={{
                          width: 11,
                          height: 11,
                          margin: 1,
                          borderRadius: 2,
                          backgroundColor: filled ? '#2A192E' : '#F3EEF8',
                        }}
                      />
                    ))}
                  </View>
                ))}
              </View>
              <Text style={{ fontSize: 15, fontWeight: '900', letterSpacing: 1.5, color: theme?.textPrimary }}>
                {activePass?.ticketCode}
              </Text>
              <Text style={{ fontSize: 11.5, color: theme?.textMuted, marginTop: 2 }}>
                Attendee: {activePass?.attendeeName || attendeeName}
              </Text>
            </View>

            {/* Physical vs Online Action Instructions */}
            {activePassEvent?.isOnline ? (
              <View style={{ gap: 8, marginBottom: 12 }}>
                <Text style={{ fontSize: 12.5, color: theme?.textSecondary, textAlign: 'center', lineHeight: 18 }}>
                  {activePassEvent?.isLive
                    ? '🔴 This session is live right now! Tap below to join the room.'
                    : 'Save this to your calendar so you get notified right when the room opens, then tap Join below.'}
                </Text>
                {activePassEvent?.joinUrl && (
                  <TouchableOpacity
                    style={[styles.primaryBtn, { backgroundColor: '#16A34A' }]}
                    onPress={() => openUrl(activePassEvent.joinUrl)}
                  >
                    <Text style={styles.primaryBtnText}>🔗 Join Live Session Now ↗</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={{ gap: 8, marginBottom: 12 }}>
                <Text style={{ fontSize: 12.5, color: theme?.textSecondary, textAlign: 'center', lineHeight: 18 }}>
                  Show this pass code (<Text style={{ fontWeight: '800' }}>{activePass?.ticketCode}</Text>) at{' '}
                  <Text style={{ fontWeight: '700' }}>{activePassEvent?.locationStr}</Text> when you arrive.
                </Text>
                <TouchableOpacity
                  style={[styles.primaryBtn, { backgroundColor: '#1F6F78' }]}
                  onPress={() => handleOpenDirections(activePassEvent)}
                >
                  <Text style={styles.primaryBtnText}>📍 Get Directions to Venue</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: '#1A73E8', marginBottom: 8 }]}
              onPress={() => {
                if (activePassEvent) openUrl(buildGCalUrl(activePassEvent));
              }}
            >
              <Text style={styles.primaryBtnText}>📅 Add Reminder to Google Calendar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ alignItems: 'center', paddingVertical: 8 }}
              onPress={() => setActivePassEvent(null)}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: theme?.textMuted }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <LocationPickerModal
        visible={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
      />
    </View>
  );
};
