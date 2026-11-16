// src/screens/journal/components/AllEntriesModal.jsx
// Full popup modal displaying all journal entries chronologically with search, mood filter, and management actions

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { colors } from '../../../theme/colors';

export const AllEntriesModal = ({
  visible,
  entries = [],
  onClose,
  onSelectEntry,
  onDeleteEntry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState('all');

  const filteredList = useMemo(() => {
    return entries.filter((e) => {
      // Mood filter
      if (filterMood === 'lighter' && !e.feelingLabel?.toLowerCase().includes('lighter')) return false;
      if (filterMood === 'between' && !e.feelingLabel?.toLowerCase().includes('between')) return false;
      if (filterMood === 'heavy' && !e.feelingLabel?.toLowerCase().includes('heavy')) return false;

      // Text search
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        e.title?.toLowerCase().includes(q) ||
        e.body?.toLowerCase().includes(q) ||
        e.feelingLabel?.toLowerCase().includes(q)
      );
    });
  }, [entries, searchQuery, filterMood]);

  const confirmDelete = (item) => {
    Alert.alert(
      'Delete Moment',
      `Are you sure you want to let go of "${item.title || 'this reflection'}"? This cannot be undone.`,
      [
        { text: 'Keep entry', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDeleteEntry?.(item.id),
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitles}>
              <Text style={styles.badgeTag}>ALL JOURNAL MOMENTS</Text>
              <Text style={styles.mainTitle}>Your reflections so far</Text>
              <Text style={styles.subtitle}>
                {entries.length} moment{entries.length === 1 ? '' : 's'} recorded at your own pace
              </Text>
            </View>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar inside Modal (clean, no boxy outlines) */}
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search across all your moments..."
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

          {/* Mood Filter Chips */}
          <View style={styles.filterRow}>
            {[
              { id: 'all', label: 'All moments' },
              { id: 'lighter', label: 'Lighter' },
              { id: 'between', label: 'In between' },
              { id: 'heavy', label: 'Heavy' },
            ].map((f) => {
              const isActive = filterMood === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setFilterMood(f.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Entries Scroll List */}
          <ScrollView
            style={styles.scrollList}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredList.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No moments found</Text>
                <Text style={styles.emptySubtitle}>
                  {searchQuery || filterMood !== 'all'
                    ? 'Try adjusting your search or filter.'
                    : 'Your journal is ready whenever you are.'}
                </Text>
              </View>
            ) : (
              filteredList.map((item) => (
                <View key={item.id} style={styles.entryCard}>
                  <View style={styles.entryHeader}>
                    {/* Date Badge */}
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

                    {/* Metadata */}
                    <View style={styles.entryMeta}>
                      <Text style={styles.entryDate}>{item.dateString || 'SAVED MOMENT'}</Text>
                      <Text style={styles.entryTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                    </View>

                    {/* Feeling Tag */}
                    {item.feelingLabel && (
                      <View style={styles.feelingPill}>
                        <Text style={styles.feelingPillText}>{item.feelingLabel}</Text>
                      </View>
                    )}
                  </View>

                  {/* Body Snippet */}
                  <Text style={styles.entrySnippet} numberOfLines={2}>
                    {item.body}
                  </Text>

                  {/* Card Actions */}
                  <View style={styles.entryActions}>
                    <TouchableOpacity
                      style={styles.openBtn}
                      onPress={() => {
                        onSelectEntry?.(item);
                        onClose();
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.openBtnText}>Open & Edit →</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => confirmDelete(item)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.deleteBtnText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          {/* Modal Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerNote}>
              Private and encrypted on your device. Only you can read these.
            </Text>
            <TouchableOpacity
              style={styles.doneBtn}
              onPress={onClose}
              activeOpacity={0.88}
            >
              <Text style={styles.doneBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(46, 30, 59, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 680,
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.1)',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 8,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitles: {
    gap: 3,
    flex: 1,
  },
  badgeTag: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#8B6DA8',
    letterSpacing: 0.8,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: '#8B6DA8',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    color: '#8B6DA8',
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.06)',
  },
  searchIcon: {
    fontSize: 13,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#2E1E3B',
    paddingVertical: 0,
    borderWidth: 0,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  },
  clearSearchText: {
    fontSize: 12,
    color: '#8B6DA8',
    paddingHorizontal: 4,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.08)',
  },
  filterChipActive: {
    backgroundColor: '#EAE3F7',
    borderColor: colors.brand,
  },
  filterChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#6E5D87',
  },
  filterChipTextActive: {
    fontWeight: '800',
    color: colors.brand,
  },
  scrollList: {
    maxHeight: 380,
  },
  scrollContent: {
    gap: 12,
    paddingVertical: 4,
  },
  entryCard: {
    backgroundColor: '#FAF5EE',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.06)',
    gap: 10,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dayBadge: {
    width: 34,
    height: 34,
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
  entryDate: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#8B6DA8',
    letterSpacing: 0.6,
  },
  entryTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#2E1E3B',
  },
  feelingPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.06)',
  },
  feelingPillText: {
    fontSize: 10.5,
    color: '#6E5D87',
    fontWeight: '700',
  },
  entrySnippet: {
    fontSize: 12.5,
    color: '#666',
    lineHeight: 18,
  },
  entryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.04)',
  },
  openBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.08)',
  },
  openBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.brand,
  },
  deleteBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#C0392B',
  },
  emptyContainer: {
    paddingVertical: 36,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6E5D87',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#8B6DA8',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(73, 37, 66, 0.06)',
  },
  footerNote: {
    fontSize: 11,
    color: '#8B6DA8',
    fontStyle: 'italic',
  },
  doneBtn: {
    backgroundColor: colors.brand,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
});
