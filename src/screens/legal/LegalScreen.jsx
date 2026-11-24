// src/screens/legal/LegalScreen.jsx
// MindBloom Terms of Service, Privacy Policy & Mental Health Disclaimer Hub
// Designed specifically for teens (13–17) and young adults (18–29).
// Exports both standalone LegalScreen and reusable LegalModal popup.

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { TERMS_SUMMARY, TERMS_SECTIONS } from './termsOfServiceContent';
import { PRIVACY_SUMMARY, PRIVACY_SECTIONS } from './privacyPolicyContent';
import { DISCLAIMER_SUMMARY, DISCLAIMER_SECTIONS } from './disclaimerContent';
import { styles } from './styles/LegalScreen.styles';

export const LegalContent = ({
  initialTab = 'terms',
  onClose,
  isModal = false,
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState(initialTab); // 'terms' | 'privacy' | 'disclaimer'

  const getTabData = () => {
    if (activeTab === 'privacy') {
      return {
        tag: 'SAFETY & ON-DEVICE TRUST',
        title: 'Privacy Policy',
        summaries: PRIVACY_SUMMARY,
        sections: PRIVACY_SECTIONS,
        clauseHeader: 'FULL PRIVACY DISCLOSURES',
      };
    } else if (activeTab === 'disclaimer') {
      return {
        tag: 'CARE, LIMITATIONS & CRISIS',
        title: 'Mental Health Disclaimer',
        summaries: DISCLAIMER_SUMMARY,
        sections: DISCLAIMER_SECTIONS,
        clauseHeader: 'DISCLAIMER DETAILS & HOTLINES',
      };
    }
    return {
      tag: 'COMMUNITY & USAGE',
      title: 'Terms of Service',
      summaries: TERMS_SUMMARY,
      sections: TERMS_SECTIONS,
      clauseHeader: 'FULL TERMS & LEGAL CONDITIONS',
    };
  };

  const tabData = getTabData();

  return (
    <View style={isModal ? styles.modalContainer : styles.innerWrapper}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTag}>{tabData.tag}</Text>
          <Text style={[styles.headerTitle, { color: theme.textPrimary || '#341528' }]}>
            {tabData.title}
          </Text>
        </View>

        {onClose && (
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 3-Tab Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'terms' && styles.tabItemActive]}
          onPress={() => setActiveTab('terms')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'terms' && styles.tabTextActive]}>
            Terms
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'privacy' && styles.tabItemActive]}
          onPress={() => setActiveTab('privacy')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'privacy' && styles.tabTextActive]}>
            Privacy
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'disclaimer' && styles.tabItemActive]}
          onPress={() => setActiveTab('disclaimer')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'disclaimer' && styles.tabTextActive]}>
            Disclaimer
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Legal Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollArea}
      >
        {/* Plain-Language Teen & Youth Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>
            IN PLAIN WORDS · WHAT YOU NEED TO KNOW
          </Text>

          <View style={styles.summaryCardsRow}>
            {tabData.summaries.map((s, idx) => (
              <View key={idx} style={styles.summaryCard}>
                <Text style={styles.summaryIcon}>{s.icon}</Text>
                <View style={styles.summaryCardBody}>
                  <Text style={styles.summaryCardHeading}>{s.title}</Text>
                  <Text style={styles.summaryCardText}>{s.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Full Clauses */}
        <Text style={styles.clausesHeader}>{tabData.clauseHeader}</Text>

        {tabData.sections.map((sec) => (
          <View key={sec.id} style={styles.clauseCard}>
            <Text style={styles.clauseTitle}>{sec.title}</Text>
            <Text style={styles.clauseContent}>{sec.content}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Dismiss Bar */}
      {onClose && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.doneBtn, { backgroundColor: theme.accent || '#492542' }]}
            onPress={onClose}
            activeOpacity={0.88}
          >
            <Text style={styles.doneBtnText}>Understood & Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

/**
 * Reusable In-App Legal Modal Popup
 */
export const LegalModal = ({
  visible,
  initialTab = 'terms',
  onClose,
}) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <LegalContent
          initialTab={initialTab}
          onClose={onClose}
          isModal={true}
        />
      </View>
    </Modal>
  );
};

/**
 * Standalone Legal Screen (for deep-linking & direct navigation)
 */
export const LegalScreen = ({ navigation, route }) => {
  const initialTab = route?.params?.tab || 'terms';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF6EF" />
      <View style={styles.container}>
        <LegalContent
          initialTab={initialTab}
          onClose={() => navigation?.goBack?.()}
          isModal={false}
        />
      </View>
    </SafeAreaView>
  );
};
