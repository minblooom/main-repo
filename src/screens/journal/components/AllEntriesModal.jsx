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
  Alert,
  
} from 'react-native';
import { styles } from '../styles/AllEntriesModal.styles';

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

