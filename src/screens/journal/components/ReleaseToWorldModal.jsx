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
  } from 'react-native';
import { styles } from './styles/ReleaseToWorldModal.styles';

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
