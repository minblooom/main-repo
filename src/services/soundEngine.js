// src/services/soundEngine.js
// Universal Ambient Soundscape & Chime Synthesizer
// Uses Web Audio API on Web (zero CORS/network latency) and expo-av on Native.

import { Platform } from 'react-native';
import { Audio } from 'expo-av';

class SoundEngine {
  constructor() {
    this.webAudioCtx = null;
    this.activeSourceNodes = [];
    this.currentSoundscape = null;
    this.soundscapeGainNode = null;
    this.isSoundscapePlaying = false;
    this.nativeSoundscape = null;

    if (Platform.OS !== 'web') {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      }).catch(() => {});
    }
  }

  getWebAudioContext() {
    if (typeof window === 'undefined') return null;
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtxClass) return null;
    if (!this.webAudioCtx || this.webAudioCtx.state === 'closed') {
      this.webAudioCtx = new AudioCtxClass();
    }
    if (this.webAudioCtx.state === 'suspended') {
      this.webAudioCtx.resume().catch(() => {});
    }
    return this.webAudioCtx;
  }

  async startSoundscape(type, volume = 0.5) {
    this.stopSoundscape();
    this.currentSoundscape = type;
    this.isSoundscapePlaying = true;

    if (Platform.OS === 'web') {
      const ctx = this.getWebAudioContext();
      if (!ctx) return;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      this.soundscapeGainNode = masterGain;

      if (type === 'rain') {
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
          b6 = white * 0.115926;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, ctx.currentTime);

        noise.connect(filter);
        filter.connect(masterGain);
        noise.start();
        this.activeSourceNodes.push(noise);
      } else if (type === 'wind') {
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 0.6;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(360, ctx.currentTime);
        filter.Q.setValueAtTime(1.2, ctx.currentTime);

        noise.connect(filter);
        filter.connect(masterGain);
        noise.start();
        this.activeSourceNodes.push(noise);
      } else if (type === 'ocean') {
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.12;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        const swellGain = ctx.createGain();
        swellGain.gain.setValueAtTime(0.1, ctx.currentTime);

        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.16, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(0.35, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(swellGain.gain);
        noise.connect(filter);
        filter.connect(swellGain);
        swellGain.connect(masterGain);

        noise.start();
        lfo.start();
        this.activeSourceNodes.push(noise, lfo);
      } else if (type === 'chime') {
        this.playTibetanChime(432, masterGain, ctx);
      }
      return;
    }

    try {
      const remoteUrls = {
        rain: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        wind: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        ocean: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        chime: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      };
      const { sound } = await Audio.Sound.createAsync(
        { uri: remoteUrls[type] },
        { shouldPlay: true, isLooping: true, volume }
      );
      this.nativeSoundscape = sound;
    } catch {}
  }

  playTibetanChime(freq = 432, customGainNode = null, customCtx = null) {
    if (Platform.OS !== 'web') return;
    const ctx = customCtx || this.getWebAudioContext();
    if (!ctx) return;

    const dest = customGainNode || ctx.destination;
    const chimeGain = ctx.createGain();
    chimeGain.connect(dest);

    const harmonics = [
      { f: freq, gain: 0.3, decay: 3.2 },
      { f: freq * 2, gain: 0.12, decay: 2.0 },
      { f: freq * 3, gain: 0.06, decay: 1.3 },
    ];

    harmonics.forEach(({ f, gain, decay }) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime);
      g.gain.setValueAtTime(gain, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + decay);
      osc.connect(g);
      g.connect(chimeGain);
      osc.start();
      osc.stop(ctx.currentTime + decay);
    });
  }

  stopSoundscape() {
    this.isSoundscapePlaying = false;
    this.currentSoundscape = null;

    if (Platform.OS === 'web') {
      this.activeSourceNodes.forEach((node) => {
        try {
          node.stop();
          node.disconnect();
        } catch {}
      });
      this.activeSourceNodes = [];
      if (this.soundscapeGainNode) {
        try {
          this.soundscapeGainNode.disconnect();
        } catch {}
        this.soundscapeGainNode = null;
      }
    } else if (this.nativeSoundscape) {
      this.nativeSoundscape.stopAsync().catch(() => {});
      this.nativeSoundscape.unloadAsync().catch(() => {});
      this.nativeSoundscape = null;
    }
  }
}

export const soundEngine = new SoundEngine();
