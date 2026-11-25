// src/screens/journal/components/ReleaseToWorldModal.jsx
// Serene animated overlay when the user releases an ephemeral vent to the world.
// Nothing is saved or tracked — the orb lifts into the sky, ripples outward, and dissolves.

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  Animated,
  Easing,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export const ReleaseToWorldModal = ({ visible, onClose, previewText = '' }) => {
  const floatY = useRef(new Animated.Value(0)).current;
  const driftX = useRef(new Animated.Value(0)).current;
  const orbOpacity = useRef(new Animated.Value(1)).current;
  const orbScale = useRef(new Animated.Value(0.85)).current;
  const ripple1Scale = useRef(new Animated.Value(0.6)).current;
  const ripple1Opacity = useRef(new Animated.Value(0.6)).current;
  const ripple2Scale = useRef(new Animated.Value(0.6)).current;
  const ripple2Opacity = useRef(new Animated.Value(0.45)).current;
  const messageOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    // Reset all animation values
    floatY.setValue(0);
    driftX.setValue(0);
    orbOpacity.setValue(1);
    orbScale.setValue(0.85);
    ripple1Scale.setValue(0.6);
    ripple1Opacity.setValue(0.6);
    ripple2Scale.setValue(0.6);
    ripple2Opacity.setValue(0.45);
    messageOpacity.setValue(0);

    const anim = Animated.sequence([
      // Gentle gather pulse
      Animated.timing(orbScale, {
        toValue: 1.08,
        duration: 450,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      // Lift into the sky + wind ripples + dissolve
      Animated.parallel([
        Animated.timing(floatY, {
          toValue: -230,
          duration: 1900,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(driftX, {
          toValue: 36,
          duration: 1900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(orbScale, {
          toValue: 0.4,
          duration: 1900,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(orbOpacity, {
          toValue: 0,
          duration: 1850,
          delay: 150,
          useNativeDriver: true,
        }),
        Animated.timing(ripple1Scale, {
          toValue: 2.6,
          duration: 1400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(ripple1Opacity, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(ripple2Scale, {
          toValue: 3.2,
          duration: 1700,
          delay: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(ripple2Opacity, {
          toValue: 0,
          duration: 1700,
          delay: 220,
          useNativeDriver: true,
        }),
      ]),
      // Calm closing message fades in
      Animated.timing(messageOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    anim.start();
    return () => anim.stop();
  }, [visible]);

  const snippet =
    previewText && previewText.trim().length > 0
      ? previewText.trim().slice(0, 60) + (previewText.trim().length > 60 ? '…' : '')
      : 'Your vent & voice';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.stage}>
          {/* Wind ripples */}
          <Animated.View
            style={[
              styles.ripple,
              {
                opacity: ripple1Opacity,
                transform: [{ scale: ripple1Scale }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.ripple,
              {
                opacity: ripple2Opacity,
                transform: [{ scale: ripple2Scale }],
              },
            ]}
          />

          {/* Floating release orb */}
          <Animated.View
            style={[
              styles.orb,
              {
                opacity: orbOpacity,
                transform: [
                  { translateY: floatY },
                  { translateX: driftX },
                  { scale: orbScale },
                ],
              },
            ]}
          >
            <Text style={styles.orbEmoji}>🌬️</Text>
            <Text style={styles.orbSnippet} numberOfLines={2}>
              {snippet}
            </Text>
          </Animated.View>

          {/* Post-release calm message */}
          <Animated.View style={[styles.messageCard, { opacity: messageOpacity }]}>
            <Text style={styles.messageEmoji}>🍃</Text>
            <Text style={styles.messageTitle}>Released to the world</Text>
            <Text style={styles.messageBody}>
              Nothing was saved, stored, or tracked. You can let your shoulders drop — you do not have to carry that anymore.
            </Text>
            <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.85}>
              <Text style={styles.doneBtnText}>Breathe & return</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(18, 22, 34, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  stage: {
    width: '100%',
    maxWidth: 380,
    minHeight: 340,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    borderColor: 'rgba(167, 243, 208, 0.55)',
  },
  orb: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(16, 185, 129, 0.22)',
    borderWidth: 1.5,
    borderColor: 'rgba(167, 243, 208, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  orbEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  orbSnippet: {
    fontSize: 11.5,
    color: '#ECFDF5',
    textAlign: 'center',
    fontWeight: '600',
  },
  messageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    padding: 26,
    alignItems: 'center',
    width: '100%',
  },
  messageEmoji: {
    fontSize: 34,
    marginBottom: 10,
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  messageBody: {
    fontSize: 13.5,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.82)',
    textAlign: 'center',
    marginBottom: 20,
  },
  doneBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 16,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
