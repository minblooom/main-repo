// src/screens/arcade/audio/soundService.js
// Centralized cross-platform sound synthesis & audio player for MindBloom Arcade.
// Uses Web Audio API for instantaneous, asset-free, zero-latency organic chimes,
// water pops, card flips, and garden sounds on Web, with fallback compatibility.

import { Platform } from 'react-native';

class SoundService {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;
    this.masterGain = null;
    this.initContext();
  }

  initContext() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
          this.masterGain = this.audioCtx.createGain();
          this.masterGain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
          this.masterGain.connect(this.audioCtx.destination);
        }
      } catch (e) {
        // AudioContext not supported or blocked
      }
    }
  }

  ensureContext() {
    if (!this.audioCtx) {
      this.initContext();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = !!enabled;
  }

  isSoundEnabled() {
    return this.soundEnabled;
  }

  // --- 1. BUBBLE POP SOUND --------------------------------------------------
  playPop(pitchMultiplier = 1.0) {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      const startFreq = (450 + Math.random() * 180) * pitchMultiplier;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(140 * pitchMultiplier, now + 0.07);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

      osc.connect(gain);
      gain.connect(this.masterGain || this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  // --- 2. CARD FLIP SOUND ---------------------------------------------------
  playCardFlip() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(this.masterGain || this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  // --- 3. MEMORY MATCH SUCCESS CHIME -----------------------------------------
  playMatch() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const notes = [523.25, 783.99]; // C5, G5
      notes.forEach((freq, idx) => {
        const now = this.audioCtx.currentTime + idx * 0.09;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain || this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.36);
      });
    } catch {}
  }

  // --- 4. GENTLE MISMATCH TONE ----------------------------------------------
  playMismatch() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const notes = [330.0, 293.66]; // E4 -> D4
      notes.forEach((freq, idx) => {
        const now = this.audioCtx.currentTime + idx * 0.08;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain || this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.22);
      });
    } catch {}
  }

  // --- 5. POCKET GARDEN PLANT SOUND -----------------------------------------
  playPlant() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.masterGain || this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  // --- 6. WATERING DROPLET SOUND --------------------------------------------
  playWater() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      [680, 840, 1020].forEach((freq, idx) => {
        const now = this.audioCtx.currentTime + idx * 0.06;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq + 140, now + 0.04);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain || this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.11);
      });
    } catch {}
  }

  // --- 7. BLOOM / GROWTH CHIME ----------------------------------------------
  playBloom() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const arpeggio = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      arpeggio.forEach((freq, idx) => {
        const now = this.audioCtx.currentTime + idx * 0.07;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.masterGain || this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.32);
      });
    } catch {}
  }

  // --- 8. LANTERN AWAKEN / TWILIGHT CHIME ------------------------------------
  playLanternGlow() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const gain1 = this.audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(392.0, now); // G4
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc1.connect(gain1);
      gain1.connect(this.masterGain || this.audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.85);

      const osc2 = this.audioCtx.createOscillator();
      const gain2 = this.audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1174.66, now); // D6
      gain2.gain.setValueAtTime(0.14, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc2.connect(gain2);
      gain2.connect(this.masterGain || this.audioCtx.destination);
      osc2.start(now);
      osc2.stop(now + 0.55);
    } catch {}
  }

  // --- 9. CELEBRATORY VICTORY FANFARE ---------------------------------------
  playVictory() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const notes = [
        { f: 523.25, delay: 0.0 },   // C5
        { f: 659.25, delay: 0.12 },  // E5
        { f: 783.99, delay: 0.24 },  // G5
        { f: 1046.5, delay: 0.40 },  // C6
      ];
      notes.forEach(({ f, delay }) => {
        const now = this.audioCtx.currentTime + delay;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);

        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(this.masterGain || this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.65);
      });
    } catch {}
  }

  // --- 10. JUMP SOUND (Runner) ----------------------------------------------
  playJump() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.masterGain || this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  // --- 11. SWAP TILE SOUND (Match-3) ----------------------------------------
  playSwap() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.05);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain || this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {}
  }

  // --- 12. LINE CLEAR / COMBO SOUND (Block Puzzle / Match-3) -----------------
  playLineClear(comboMultiplier = 1) {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const baseFreq = 587.33; // D5
      [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2].forEach((freq, i) => {
        const now = this.audioCtx.currentTime + i * 0.06;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq * comboMultiplier, now);

        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(this.masterGain || this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.24);
      });
    } catch {}
  }

  // --- 13. BLOCK PLACE SOUND (Block Puzzle) ---------------------------------
  playBlockPlace() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(130, now + 0.05);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain || this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {}
  }

  // --- 14. CLEAN UI BUTTON CLICK --------------------------------------------
  playClick() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.03);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.masterGain || this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }
  // 15. LEVEL UP CELEBRATION CHIME
  playLevelUp() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const notes = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6 triumphant ascending arpeggio
      notes.forEach((freq, idx) => {
        const start = this.audioCtx.currentTime + idx * 0.08;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.22, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain || this.audioCtx.destination);

        osc.start(start);
        osc.stop(start + 0.38);
      });
    } catch {}
  }

  // 16. WHOOSH / LAUNCH SOUND
  playWhoosh() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

      osc.connect(gain);
      gain.connect(this.masterGain || this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch {}
  }

  // 17. SPEED DASH / POWER PULSE
  playPowerDash() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.masterGain || this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.17);
    } catch {}
  }
}

export const soundService = new SoundService();
