// src/screens/journal/components/JournalArchive.jsx
// Sidebar card listing saved journal moments with real-time search
// Clean pill-shaped search bar with no browser outlines, and View All hook

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { styles } from '../styles/JournalArchive.styles';

export const JournalArchive = ({
  entries = [],
  onSelectEntry,
  onDeleteEntry,
  onViewAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase();
    return entries.filter(
      (e) =>
        e.title?.toLowerCase().includes(q) ||
        e.body?.toLowerCase().includes(q) ||
        e.feelingLabel?.toLowerCase().includes(q)
    );
  }, [entries, searchQuery]);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your journal</Text>
        <Text style={styles.subtitle}>
          {entries.length} saved moment{entries.length === 1 ? '' : 's'} · always here for you
        </Text>
      </View>

      {/* Search Input — Clean rounded pill with zero boxy outlines */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
                    underlineColorAndroid="transparent"
          style={styles.searchInput}
          placeholder="Find a moment..."
          placeholderTextColor="#A89BB5"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
            <Text style={styles.clearSearchText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Recent Entries Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>RECENT ENTRIES</Text>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Entry List */}
      <View style={styles.list}>
        {filteredEntries.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No moments match your search.' : 'No saved entries yet. Take your time.'}
            </Text>
          </View>
        ) : (
          filteredEntries.slice(0, 4).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.entryRow}
              onPress={() => onSelectEntry?.(item)}
              activeOpacity={0.8}
            >
              {/* Date Day Badge */}
              <View
                style={[
                  styles.dayBadge,
                  { backgroundColor: item.badgeBg || '#EDF5EE' },
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    { color: item.badgeColor || '#2C5A38' },
                  ]}
                >
                  {item.dayNumber || '16'}
                </Text>
              </View>

              {/* Title & Feeling */}
              <View style={styles.entryMeta}>
                <Text style={styles.entryTitle} numberOfLines={1}>
                  {item.voiceNote ? '🎙️ ' : ''}{item.title || 'Untitled reflection'}
                </Text>
                {item.feelingLabel && (
                  <Text style={styles.entryFeeling} numberOfLines={1}>
                    · {item.feelingLabel}
                  </Text>
                )}
              </View>

              {/* Delete Quick Action */}
              {onDeleteEntry && (
                <TouchableOpacity
                  style={{ padding: 6 }}
                  onPress={(e) => {
                    e?.stopPropagation?.();
                    if (Platform.OS === 'web') {
                      if (window.confirm(`Let go of "${item.title || 'this reflection'}"?`)) {
                        onDeleteEntry(item.id);
                      }
                    } else {
                      Alert.alert(
                        'Let Go of This Moment',
                        `Let go of "${item.title || 'this reflection'}"?`,
                        [
                          { text: 'Keep it', style: 'cancel' },
                          { text: 'Let go', style: 'destructive', onPress: () => onDeleteEntry(item.id) },
                        ]
                      );
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 13, color: '#C0392B' }}>🗑️</Text>
                </TouchableOpacity>
              )}

              {/* Arrow */}
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );
};

