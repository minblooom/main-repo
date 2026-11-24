// src/screens/arcade/games/GroundingSensoryGame.jsx
// Savanna Grounding 5-4-3-2-1 Sensory Arena
// Evidence-based somatic grounding for panic de-escalation and trauma triggers.

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { soundService } from '../audio/soundService';

const SENSORY_STEPS = [
  {
    step: 5,
    sense: 'SEE',
    instruction: 'Tap 5 grounding sights around you',
    icon: '👀',
    color: '#34D399',
    items: [
      { id: 'sky', label: 'The wide sky or window' },
      { id: 'hands', label: 'The lines on your own hands' },
      { id: 'object', label: 'A familiar object nearby' },
      { id: 'shadow', label: 'Light dancing on the floor' },
      { id: 'color', label: 'A soothing color you like' },
    ],
  },
  {
    step: 4,
    sense: 'FEEL',
    instruction: 'Notice 4 physical textures you can touch',
    icon: '✋',
    color: '#60A5FA',
    items: [
      { id: 'feet', label: 'Feet firmly touching the earth' },
      { id: 'fabric', label: 'The soft fabric of your clothes' },
      { id: 'surface', label: 'The cool surface of your phone/desk' },
      { id: 'air', label: 'The temperature of air on your skin' },
    ],
  },
  {
    step: 3,
    sense: 'HEAR',
    instruction: 'Listen carefully for 3 ambient sounds',
    icon: '👂',
    color: '#FBBF24',
    items: [
      { id: 'distant', label: 'A distant sound outside' },
      { id: 'room', label: 'A quiet hum in your room' },
      { id: 'breath', label: 'The sound of your own quiet breath' },
    ],
  },
  {
    step: 2,
    sense: 'SMELL',
    instruction: 'Notice or recall 2 comforting scents',
    icon: '🌿',
    color: '#F472B6',
    items: [
      { id: 'air_scent', label: 'Fresh morning air or petrichor' },
      { id: 'spice', label: 'Warm spiced chai or cleansing soap' },
    ],
  },
  {
    step: 1,
    sense: 'ANCHOR',
    instruction: 'Take 1 deep breath and ground into self-compassion',
    icon: '🌸',
    color: '#A78BFA',
    items: [
      { id: 'safe', label: 'I am here. My feet are on the ground. I am safe in this breath.' },
    ],
  },
];

export const GroundingSensoryGame = ({ onFinish, onSaveState }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedItems, setCompletedItems] = useState({});

  const currentStep = SENSORY_STEPS[currentStepIndex];

  const handleToggleItem = (itemId) => {
    soundService.playPop();
    const updated = { ...completedItems, [itemId]: true };
    setCompletedItems(updated);

    // Check if all items in current step are completed
    const allStepItemsDone = currentStep.items.every((it) => updated[it.id]);
    if (allStepItemsDone) {
      soundService.playVictory();
      if (currentStepIndex + 1 < SENSORY_STEPS.length) {
        setTimeout(() => {
          setCurrentStepIndex((prev) => prev + 1);
        }, 600);
      } else {
        setTimeout(() => {
          onFinish?.({
            summary: 'You brought your mind fully back to the present moment through all 5 senses. You are grounded and safe.',
            seeds: 15,
          });
        }, 800);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Step Indicator Header */}
      <View style={styles.stepHeader}>
        <Text style={styles.badgeText}>SOMATIC 5-4-3-2-1 GROUNDING</Text>
        <Text style={styles.stepTitle}>
          {currentStep.icon} Step {5 - currentStepIndex}: {currentStep.sense}
        </Text>
        <Text style={styles.stepSubtitle}>{currentStep.instruction}</Text>
      </View>

      {/* Progress Dots */}
      <View style={styles.dotsRow}>
        {SENSORY_STEPS.map((s, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              idx === currentStepIndex && [styles.activeDot, { backgroundColor: s.color }],
              idx < currentStepIndex && styles.completedDot,
            ]}
          />
        ))}
      </View>

      {/* Checkpoint Cards */}
      <View style={styles.cardsContainer}>
        {currentStep.items.map((item) => {
          const isDone = Boolean(completedItems[item.id]);
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.itemCard,
                isDone && [styles.itemCardDone, { borderColor: currentStep.color }],
              ]}
              onPress={() => handleToggleItem(item.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, isDone && { backgroundColor: currentStep.color, borderColor: currentStep.color }]}>
                {isDone ? <Text style={styles.checkMark}>✓</Text> : null}
              </View>
              <Text style={[styles.itemText, isDone && styles.itemTextDone]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footerTip}>
        <Text style={styles.tipText}>
          🌿 Take your time. There is no rush, no timer, and no score. Just your breath and the real world holding you.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#34D399',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  stepSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    maxWidth: 320,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  activeDot: {
    width: 24,
  },
  completedDot: {
    backgroundColor: '#34D399',
  },
  cardsContainer: {
    width: '100%',
    maxWidth: 420,
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  itemCardDone: {
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkMark: {
    color: '#0F241B',
    fontSize: 16,
    fontWeight: '900',
  },
  itemText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
  },
  itemTextDone: {
    color: '#A7F3D0',
    textDecorationLine: 'line-through',
  },
  footerTip: {
    marginTop: 24,
    maxWidth: 360,
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  tipText: {
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    lineHeight: 18,
  },
});
