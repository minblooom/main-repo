// src/screens/journal/components/JournalArchive.jsx
// Sidebar card listing saved journal moments with real-time search
// Clean pill-shaped search bar with no browser outlines, and View All hook

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors } from '../../../theme/colors';

export const JournalArchive = ({
  entries = [],
  onSelectEntry,
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
                  {item.title || 'Untitled reflection'}
                </Text>
                {item.feelingLabel && (
                  <Text style={styles.entryFeeling} numberOfLines={1}>
                    · {item.feelingLabel}
                  </Text>
                )}
              </View>

              {/* Arrow */}
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.08)',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    gap: 14,
  },
  header: {
    gap: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 11.5,
    color: '#8B6DA8',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.06)',
  },
  searchIcon: {
    fontSize: 13,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#2E1E3B',
    paddingVertical: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  },
  clearSearchText: {
    fontSize: 12,
    color: '#8B6DA8',
    paddingHorizontal: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#8B6DA8',
    letterSpacing: 0.8,
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.brand,
  },
  list: {
    gap: 10,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  dayBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '800',
  },
  entryMeta: {
    flex: 1,
    gap: 2,
  },
  entryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E1E3B',
  },
  entryFeeling: {
    fontSize: 11,
    color: '#8B6DA8',
  },
  arrowIcon: {
    fontSize: 18,
    color: '#B0A0C0',
    fontWeight: '600',
  },
  emptyWrap: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: '#A092B0',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
