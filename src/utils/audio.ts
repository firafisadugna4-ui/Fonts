import { KeySoundProfile } from '../types';

class KeyboardAudioEngine {
  private ctx: AudioContext | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public playKey(profile: KeySoundProfile, volumePercent: number = 80, isSpaceOrEnter: boolean = false) {
    if (profile === 'mute' || volumePercent <= 0) return;

    try {
      this.initContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const vol = (volumePercent / 100) * 0.4;

      if (profile === 'thock') {
        // Warm mechanical thock: low frequency body + brief sharp tap
        const baseFreq = isSpaceOrEnter ? 110 : 155 + Math.random() * 25;
        
        // Low resonance body
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq * 1.8, t);
        osc.frequency.exponentialRampToValueAtTime(baseFreq, t + 0.04);
        
        oscGain.gain.setValueAtTime(vol * 0.9, t);
        oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

        osc.connect(oscGain);
        oscGain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.08);

        // Tactile clack noise burst
        const bufferSize = this.ctx.sampleRate * 0.02;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, t);
        filter.Q.setValueAtTime(2.5, t);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(vol * 0.45, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noise.start(t);
      } else if (profile === 'clicky') {
        // High-pitched tactile click (Blue switch)
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'sine';
        clickOsc.frequency.setValueAtTime(2400 + (Math.random() * 300 - 150), t);
        clickOsc.frequency.exponentialRampToValueAtTime(800, t + 0.015);

        clickGain.gain.setValueAtTime(vol * 0.8, t);
        clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

        clickOsc.connect(clickGain);
        clickGain.connect(this.ctx.destination);
        clickOsc.start(t);
        clickOsc.stop(t + 0.025);

        // Second bottom-out bounce
        const bottomOsc = this.ctx.createOscillator();
        const bottomGain = this.ctx.createGain();
        bottomOsc.type = 'triangle';
        bottomOsc.frequency.setValueAtTime(320, t + 0.012);
        bottomGain.gain.setValueAtTime(0, t);
        bottomGain.gain.setValueAtTime(vol * 0.5, t + 0.012);
        bottomGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

        bottomOsc.connect(bottomGain);
        bottomGain.connect(this.ctx.destination);
        bottomOsc.start(t + 0.01);
        bottomOsc.stop(t + 0.06);
      } else if (profile === 'linear') {
        // Soft dampened bottom out
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260 + (Math.random() * 40 - 20), t);
        osc.frequency.exponentialRampToValueAtTime(140, t + 0.035);

        gain.gain.setValueAtTime(vol * 0.6, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.045);
      } else if (profile === 'bubble') {
        // Pop sound
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const startFreq = 420 + Math.random() * 80;
        osc.frequency.setValueAtTime(startFreq, t);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 2.2, t + 0.05);

        gain.gain.setValueAtTime(vol * 0.8, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.07);
      } else if (profile === 'cyber') {
        // Futuristic synth click
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.exponentialRampToValueAtTime(300, t + 0.04);

        gain.gain.setValueAtTime(vol * 0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.05);
      }
    } catch {
      // Audio playback fails gracefully if audio context not permitted
    }
  }
}

export const audioEngine = new KeyboardAudioEngine();
