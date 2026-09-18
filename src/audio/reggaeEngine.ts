/**
 * Roots Reggae & Dub Web Audio Synthesis Engine
 * Provides authentic one-drop riddim, heavy sub-bass, offbeat skank,
 * Nyabinghi percussion, organ bubble, melodica lead, dub siren, and tape delay.
 */

export interface TrackStems {
  drums: boolean;
  bass: boolean;
  skank: boolean;
  organ: boolean;
  melody: boolean;
  nyabinghi: boolean;
  vocals: boolean;
}

export interface DubFxSettings {
  delayTime: number; // in seconds (e.g. 0.35s)
  delayFeedback: number; // 0 to 0.85
  delayMix: number; // 0 to 1
  dubDropActive: boolean; // cuts highs & keys, isolates heavy bass & echo drums
  subBoost: number; // 0 to 12 dB
  vinylCrackle: boolean;
}

class ReggaeAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  
  // Dub Delay Loop
  private delayNode: DelayNode | null = null;
  private delayFeedbackGain: GainNode | null = null;
  private delayFilter: BiquadFilterNode | null = null;
  private delayWetGain: GainNode | null = null;
  private dubSendGain: GainNode | null = null;
  
  // Sub Boost Filter
  private subBoostFilter: BiquadFilterNode | null = null;

  // Vinyl crackle noise node
  private vinylNode: AudioBufferSourceNode | null = null;
  private vinylGain: GainNode | null = null;

  // Dub Siren
  private sirenOsc: OscillatorNode | null = null;
  private sirenLfo: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;
  private sirenActive: boolean = false;

  // Sequencer timing
  private isPlaying: boolean = false;
  private bpm: number = 74;
  private currentStep: number = 0;
  private currentBar: number = 0;
  private timerId: number | null = null;
  private nextNoteTime: number = 0;
  private lookaheadMs: number = 25;
  private scheduleAheadSec: number = 0.1;

  // Stems & FX State
  public stems: TrackStems = {
    drums: true,
    bass: true,
    skank: true,
    organ: true,
    melody: true,
    nyabinghi: true,
    vocals: true,
  };

  public fx: DubFxSettings = {
    delayTime: 0.38,
    delayFeedback: 0.55,
    delayMix: 0.4,
    dubDropActive: false,
    subBoost: 4,
    vinylCrackle: true,
  };

  // Callback listeners
  private onStepCallback: ((step: number, bar: number, timeMs: number) => void) | null = null;
  private onEndedCallback: (() => void) | null = null;

  // Speech synthesis for vocals
  private speechSynth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.speechSynth = window.speechSynthesis;
    }
  }

  public initAudio() {
    if (this.ctx && this.ctx.state !== 'closed') {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    // Master bus
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.8;

    // Sub Boost EQ
    this.subBoostFilter = this.ctx.createBiquadFilter();
    this.subBoostFilter.type = 'lowshelf';
    this.subBoostFilter.frequency.setValueAtTime(90, this.ctx.currentTime);
    this.subBoostFilter.gain.setValueAtTime(this.fx.subBoost, this.ctx.currentTime);

    // Dub Delay Send & Return
    this.dubSendGain = this.ctx.createGain();
    this.dubSendGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

    this.delayNode = this.ctx.createDelay(2.0);
    this.delayNode.delayTime.setValueAtTime(this.fx.delayTime, this.ctx.currentTime);

    this.delayFeedbackGain = this.ctx.createGain();
    this.delayFeedbackGain.gain.setValueAtTime(this.fx.delayFeedback, this.ctx.currentTime);

    // High cut filter on delay feedback (analog tape dampening)
    this.delayFilter = this.ctx.createBiquadFilter();
    this.delayFilter.type = 'lowpass';
    this.delayFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);

    this.delayWetGain = this.ctx.createGain();
    this.delayWetGain.gain.setValueAtTime(this.fx.delayMix, this.ctx.currentTime);

    // Wire delay loop:
    // dubSendGain -> delayNode -> delayFilter -> delayFeedbackGain -> delayNode
    // delayNode -> delayWetGain -> masterGain
    this.dubSendGain.connect(this.delayNode);
    this.delayNode.connect(this.delayFilter);
    this.delayFilter.connect(this.delayFeedbackGain);
    this.delayFeedbackGain.connect(this.delayNode);
    this.delayFilter.connect(this.delayWetGain);

    // Route dry & delay to sub-boost then master then output
    this.masterGain.connect(this.subBoostFilter);
    this.delayWetGain.connect(this.subBoostFilter);
    this.subBoostFilter.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // Vinyl crackle generator
    this.setupVinylCrackle();
  }

  private setupVinylCrackle() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Periodic dust clicks & soft pinkish hiss
      const isPop = Math.random() < 0.0012;
      const crackle = isPop ? (Math.random() * 2 - 1) * 0.4 : (Math.random() * 2 - 1) * 0.015;
      data[i] = crackle;
    }

    this.vinylGain = this.ctx.createGain();
    this.vinylGain.gain.setValueAtTime(this.fx.vinylCrackle ? 0.08 : 0, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    filter.Q.value = 1.0;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(filter);
    filter.connect(this.vinylGain);
    this.vinylGain.connect(this.masterGain!);
    source.start();
    this.vinylNode = source;
  }

  // Setters for live tweaking
  public setBpm(newBpm: number) {
    this.bpm = Math.max(60, Math.min(95, newBpm));
    // Re-sync delay to dotted 8th note
    const beatSec = 60 / this.bpm;
    this.setDelayTime(beatSec * 0.75);
  }

  public getBpm(): number {
    return this.bpm;
  }

  public setDelayTime(seconds: number) {
    this.fx.delayTime = Math.max(0.1, Math.min(1.2, seconds));
    if (this.delayNode && this.ctx) {
      this.delayNode.delayTime.setTargetAtTime(this.fx.delayTime, this.ctx.currentTime, 0.05);
    }
  }

  public setDelayFeedback(feedback: number) {
    this.fx.delayFeedback = Math.max(0, Math.min(0.88, feedback));
    if (this.delayFeedbackGain && this.ctx) {
      this.delayFeedbackGain.gain.setTargetAtTime(this.fx.delayFeedback, this.ctx.currentTime, 0.05);
    }
  }

  public setDelayMix(mix: number) {
    this.fx.delayMix = Math.max(0, Math.min(1, mix));
    if (this.delayWetGain && this.ctx) {
      this.delayWetGain.gain.setTargetAtTime(this.fx.delayMix, this.ctx.currentTime, 0.05);
    }
  }

  public setSubBoost(dB: number) {
    this.fx.subBoost = Math.max(0, Math.min(15, dB));
    if (this.subBoostFilter && this.ctx) {
      this.subBoostFilter.gain.setTargetAtTime(this.fx.subBoost, this.ctx.currentTime, 0.05);
    }
  }

  public toggleDubDrop(active?: boolean) {
    this.fx.dubDropActive = active !== undefined ? active : !this.fx.dubDropActive;
    // When dub drop is active: skank & organ cut out, delay feedback temporarily swells
    if (this.fx.dubDropActive) {
      this.setDelayFeedback(Math.min(0.82, this.fx.delayFeedback + 0.18));
      this.setDelayMix(Math.min(0.9, this.fx.delayMix + 0.3));
    } else {
      this.setDelayFeedback(0.55);
      this.setDelayMix(0.4);
    }
    return this.fx.dubDropActive;
  }

  public toggleVinylCrackle(enabled?: boolean) {
    this.fx.vinylCrackle = enabled !== undefined ? enabled : !this.fx.vinylCrackle;
    if (this.vinylGain && this.ctx) {
      this.vinylGain.gain.setTargetAtTime(this.fx.vinylCrackle ? 0.08 : 0, this.ctx.currentTime, 0.05);
    }
    return this.fx.vinylCrackle;
  }

  public setStemMute(stem: keyof TrackStems, enabled: boolean) {
    this.stems[stem] = enabled;
  }

  // DUB SIREN GENERATOR (Classic Sound System Horn / Siren with LFO)
  public triggerDubSiren(pitchHz: number = 720, lfoSpeed: number = 4) {
    if (!this.ctx || this.sirenActive) return;
    this.sirenActive = true;

    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const sirenGain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(pitchHz, this.ctx.currentTime);

    // LFO sweeps the siren frequency up and down
    lfo.type = 'sawtooth';
    lfo.frequency.setValueAtTime(lfoSpeed, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(260, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    sirenGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    sirenGain.gain.exponentialRampToValueAtTime(0.22, this.ctx.currentTime + 0.05);

    // Send siren into both master out and dub delay for heavy tape repeats!
    osc.connect(sirenGain);
    sirenGain.connect(this.masterGain!);
    if (this.dubSendGain) {
      sirenGain.connect(this.dubSendGain);
    }

    lfo.start();
    osc.start();

    this.sirenOsc = osc;
    this.sirenLfo = lfo;
    this.sirenGain = sirenGain;
  }

  public stopDubSiren() {
    if (!this.ctx || !this.sirenActive || !this.sirenGain) return;
    this.sirenActive = false;
    const now = this.ctx.currentTime;
    this.sirenGain.gain.setValueAtTime(this.sirenGain.gain.value, now);
    this.sirenGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    setTimeout(() => {
      try {
        this.sirenOsc?.stop();
        this.sirenLfo?.stop();
        this.sirenOsc?.disconnect();
        this.sirenLfo?.disconnect();
        this.sirenGain?.disconnect();
      } catch {
        // ignore
      }
      this.sirenOsc = null;
      this.sirenLfo = null;
      this.sirenGain = null;
    }, 250);
  }

  // SOUND SYNTHESIS METHODS
  // 1. One-Drop Kick (Centered on beat 3)
  private playKick(time: number, sendToDub: boolean = false) {
    if (!this.ctx || !this.stems.drums) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(130, time);
    osc.frequency.exponentialRampToValueAtTime(42, time + 0.12);

    gain.gain.setValueAtTime(0.85, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

    osc.connect(gain);
    gain.connect(this.masterGain!);
    if (sendToDub && this.dubSendGain) {
      gain.connect(this.dubSendGain);
    }

    osc.start(time);
    osc.stop(time + 0.3);
  }

  // 2. Snare / Rimshot (Snappy reggae cross-stick on beat 3)
  private playRimshot(time: number, sendToDub: boolean = true) {
    if (!this.ctx || !this.stems.drums) return;

    // Noise burst
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(1200, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain!);

    // Tonal body rim ring
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, time);
    osc.frequency.exponentialRampToValueAtTime(180, time + 0.06);

    oscGain.gain.setValueAtTime(0.65, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain!);

    if (sendToDub && this.dubSendGain) {
      noiseGain.connect(this.dubSendGain);
      oscGain.connect(this.dubSendGain);
    }

    noise.start(time);
    noise.stop(time + 0.1);
    osc.start(time);
    osc.stop(time + 0.1);
  }

  // 3. Hi-Hat (Sixteenth note groove)
  private playHiHat(time: number, open: boolean = false) {
    if (!this.ctx || !this.stems.drums) return;

    const bufferSize = this.ctx.sampleRate * 0.06;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(6500, time);

    const gain = this.ctx.createGain();
    const duration = open ? 0.14 : 0.035;
    gain.gain.setValueAtTime(open ? 0.3 : 0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    noise.start(time);
    noise.stop(time + duration);
  }

  // 4. Nyabinghi Thunder & Funde Drums (Heartbeat pulse)
  private playNyabinghi(time: number, type: 'thunder' | 'funde' | 'repeater') {
    if (!this.ctx || !this.stems.nyabinghi) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (type === 'thunder') {
      // Resonant deep bass drum
      osc.type = 'sine';
      osc.frequency.setValueAtTime(65, time);
      osc.frequency.exponentialRampToValueAtTime(38, time + 0.35);
      gain.gain.setValueAtTime(0.55, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.45);
    } else if (type === 'funde') {
      // Heartbeat thud
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, time);
      osc.frequency.exponentialRampToValueAtTime(60, time + 0.18);
      gain.gain.setValueAtTime(0.4, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
    } else {
      // Repeater sharp snap
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(380, time);
      osc.frequency.exponentialRampToValueAtTime(140, time + 0.08);
      gain.gain.setValueAtTime(0.25, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
    }

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(time);
    osc.stop(time + 0.5);
  }

  // 5. Heavy Roots Reggae Sub-Bass (Deep, warm sine/triangle)
  private playBassNote(time: number, noteHz: number, duration: number) {
    if (!this.ctx || !this.stems.bass) return;

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(noteHz, time);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(noteHz * 0.5, time); // Sub-octave earth shaker!

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, time);
    filter.Q.setValueAtTime(2.2, time);

    // Warm envelope
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.75, time + 0.04);
    gain.gain.setValueAtTime(0.7, time + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(time);
    subOsc.start(time);
    osc.stop(time + duration + 0.05);
    subOsc.stop(time + duration + 0.05);
  }

  // 6. Skank (Rhythm Guitar Chop + Organ Chop on offbeats 2 and 4)
  private playSkank(time: number, chordFrequencies: number[]) {
    if (!this.ctx || !this.stems.skank || this.fx.dubDropActive) return;

    chordFrequencies.forEach((freq) => {
      // Guitar chop (bright filtered pulse)
      const gOsc = this.ctx!.createOscillator();
      const gGain = this.ctx!.createGain();
      const gFilter = this.ctx!.createBiquadFilter();

      gOsc.type = 'sawtooth';
      gOsc.frequency.setValueAtTime(freq, time);

      gFilter.type = 'bandpass';
      gFilter.frequency.setValueAtTime(1600, time);
      gFilter.Q.setValueAtTime(2.0, time);

      gGain.gain.setValueAtTime(0.18, time);
      gGain.gain.exponentialRampToValueAtTime(0.001, time + 0.075);

      gOsc.connect(gFilter);
      gFilter.connect(gGain);
      gGain.connect(this.masterGain!);

      gOsc.start(time);
      gOsc.stop(time + 0.08);
    });
  }

  // 7. Organ Bubble (Hammond B3 percussive shuffle)
  private playOrganBubble(time: number, freq: number) {
    if (!this.ctx || !this.stems.organ || this.fx.dubDropActive) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(time);
    osc.stop(time + 0.1);
  }

  // 8. Lead Melodica / Brass Hook (Roots horn vibe)
  private playMelodica(time: number, freq: number, duration: number) {
    if (!this.ctx || !this.stems.melody || this.fx.dubDropActive) return;

    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    // Warm vibrato
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(5.2, time);
    lfoGain.gain.setValueAtTime(4.5, time);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, time);
    filter.Q.setValueAtTime(3.0, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.24, time + 0.05);
    gain.gain.setValueAtTime(0.22, time + duration * 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    // Send melodica into dub delay for that Augustus Pablo atmospheric echo!
    if (this.dubSendGain) {
      gain.connect(this.dubSendGain);
    }

    lfo.start(time);
    osc.start(time);
    lfo.stop(time + duration + 0.05);
    osc.stop(time + duration + 0.05);
  }

  // AUDIO HARMONIC FREQUENCIES (A Minor Roots Progression)
  // Progression: Am -> F -> C -> G (Classic Roots 4-bar progression)
  private getChordForBar(bar: number): { name: string; bassHz: number; chordHz: number[]; organHz: number } {
    const barIndex = bar % 4;
    switch (barIndex) {
      case 0: // A Minor (Am)
        return {
          name: 'Am',
          bassHz: 110, // A2
          chordHz: [220, 261.63, 329.63, 440], // A3, C4, E4, A4
          organHz: 329.63 // E4
        };
      case 1: // F Major (F)
        return {
          name: 'F',
          bassHz: 87.31, // F2
          chordHz: [174.61, 220, 261.63, 349.23], // F3, A3, C4, F4
          organHz: 261.63 // C4
        };
      case 2: // C Major (C)
        return {
          name: 'C',
          bassHz: 130.81, // C3
          chordHz: [261.63, 329.63, 392, 523.25], // C4, E4, G4, C5
          organHz: 392 // G4
        };
      case 3: // G Major (G)
      default:
        return {
          name: 'G',
          bassHz: 98, // G2
          chordHz: [196, 246.94, 293.66, 392], // G3, B3, D4, G4
          organHz: 293.66 // D4
        };
    }
  }

  // Melodica / horn melodic notes for the 4-bar roots hook
  private getMelodicaNote(step: number, bar: number): number | null {
    const barMod = bar % 4;
    // Step 0-15
    if (barMod === 0) {
      if (step === 4) return 440; // A4
      if (step === 8) return 523.25; // C5
      if (step === 12) return 659.25; // E5
    } else if (barMod === 1) {
      if (step === 4) return 698.46; // F5
      if (step === 8) return 659.25; // E5
      if (step === 12) return 523.25; // C5
    } else if (barMod === 2) {
      if (step === 4) return 523.25; // C5
      if (step === 8) return 587.33; // D5
      if (step === 12) return 659.25; // E5
    } else if (barMod === 3) {
      if (step === 4) return 587.33; // D5
      if (step === 8) return 493.88; // B4
      if (step === 12) return 440; // A4
    }
    return null;
  }

  // STEP SEQUENCER SCHEDULER
  private scheduleStep(step: number, bar: number, time: number) {
    const chord = this.getChordForBar(bar);
    const stepInBar = step % 16;
    const beatSec = 60 / this.bpm;
    const stepDuration = beatSec / 4;

    // 1. DRUMS
    // Hi-hats: Every 16th step, with slight velocity variation
    const isUpbeat = stepInBar === 6 || stepInBar === 14;
    this.playHiHat(time, isUpbeat);

    // ONE-DROP: Beat 3 (which is step 8 in a 16-step bar)
    if (stepInBar === 8) {
      // Authentic one-drop: Kick + Snare Rimshot drop together on Beat 3!
      this.playKick(time, false);
      this.playRimshot(time, true);
    }

    // Occasional ghost rimshot on step 11 or 15 for dub swing
    if (stepInBar === 15 && bar % 2 === 1) {
      this.playRimshot(time, true);
    }

    // 2. NYABINGHI PERCUSSION
    // Thunder bass pulse on step 0 and 8
    if (stepInBar === 0 || stepInBar === 8) {
      this.playNyabinghi(time, 'thunder');
    }
    // Funde heartbeat on step 4 and 12
    if (stepInBar === 4 || stepInBar === 12) {
      this.playNyabinghi(time, 'funde');
    }
    // Repeater accent on step 10
    if (stepInBar === 10) {
      this.playNyabinghi(time, 'repeater');
    }

    // 3. SKANK (Off-beat guitar & piano chop)
    // In reggae 4/4, skank hits on the upbeat of each beat: step 2, 6, 10, 14 (or offbeats)
    if (stepInBar === 4 || stepInBar === 12) {
      this.playSkank(time, chord.chordHz);
    }

    // 4. ORGAN BUBBLE
    // Bubbles on steps 2, 6, 10, 14
    if (stepInBar === 2 || stepInBar === 6 || stepInBar === 10 || stepInBar === 14) {
      this.playOrganBubble(time, chord.organHz);
    }

    // 5. SUB BASSLINE
    // Classic rolling one-drop bassline
    if (stepInBar === 0) {
      this.playBassNote(time, chord.bassHz, stepDuration * 3);
    } else if (stepInBar === 4) {
      this.playBassNote(time, chord.bassHz * 1.25, stepDuration * 2.5);
    } else if (stepInBar === 8) {
      this.playBassNote(time, chord.bassHz * 1.5, stepDuration * 2);
    } else if (stepInBar === 12) {
      this.playBassNote(time, chord.bassHz, stepDuration * 2.5);
    }

    // 6. MELODICA / LEAD
    const melodicaNote = this.getMelodicaNote(stepInBar, bar);
    if (melodicaNote !== null) {
      this.playMelodica(time, melodicaNote, stepDuration * 3);
    }
  }

  private nextStep() {
    const secondsPerStep = (60 / this.bpm) / 4;
    this.nextNoteTime += secondsPerStep;
    this.currentStep++;
    if (this.currentStep >= 16) {
      this.currentStep = 0;
      this.currentBar++;
    }
  }

  private scheduler() {
    if (!this.ctx || !this.isPlaying) return;

    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadSec) {
      this.scheduleStep(this.currentStep, this.currentBar, this.nextNoteTime);
      
      // Notify UI
      if (this.onStepCallback) {
        const totalSteps = this.currentBar * 16 + this.currentStep;
        const timeMs = (totalSteps * (60 / this.bpm) * 1000) / 4;
        this.onStepCallback(this.currentStep, this.currentBar, timeMs);
      }

      this.nextStep();
    }

    this.timerId = window.setTimeout(() => this.scheduler(), this.lookaheadMs);
  }

  // PUBLIC PLAYBACK API
  public start(onStep?: (step: number, bar: number, timeMs: number) => void) {
    this.initAudio();
    if (this.isPlaying) return;

    this.onStepCallback = onStep || null;
    this.isPlaying = true;
    this.currentStep = 0;
    this.currentBar = 0;
    this.nextNoteTime = this.ctx!.currentTime + 0.05;

    this.scheduler();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.currentStep = 0;
    this.currentBar = 0;
    this.stopSpeech();
    this.stopDubSiren();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.stopSpeech();
  }

  public resume() {
    if (this.isPlaying || !this.ctx) return;
    this.isPlaying = true;
    this.nextNoteTime = this.ctx.currentTime + 0.05;
    this.scheduler();
  }

  public seekToBar(bar: number) {
    this.currentBar = Math.max(0, bar);
    this.currentStep = 0;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentBar(): number {
    return this.currentBar;
  }

  public getCurrentStep(): number {
    return this.currentStep;
  }

  // Visualizer Analyser Node getter
  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  // CHORD AUDITION (For interactive chord sheet tap)
  public playChordAudition(chordName: string) {
    this.initAudio();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const chordsMap: Record<string, { bass: number; notes: number[] }> = {
      Am: { bass: 110, notes: [220, 261.63, 329.63, 440] },
      F: { bass: 87.31, notes: [174.61, 220, 261.63, 349.23] },
      C: { bass: 130.81, notes: [261.63, 329.63, 392, 523.25] },
      G: { bass: 98, notes: [196, 246.94, 293.66, 392] },
      Dm: { bass: 73.42, notes: [146.83, 174.61, 220, 293.66] },
      Em: { bass: 82.41, notes: [164.81, 196, 246.94, 329.63] },
    };

    const chord = chordsMap[chordName] || chordsMap.Am;
    this.playBassNote(now, chord.bass, 1.2);
    this.playSkank(now + 0.05, chord.notes);
    this.playRimshot(now + 0.05, true);
  }

  // SPEECH CHANT VOCAL NARRATION
  public speakLyric(text: string) {
    if (!this.speechSynth || !this.stems.vocals) return;
    this.stopSpeech();

    // Clean text of bracket notes
    const cleanText = text.replace(/\[.*?\]/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.92; // Deliberate, conscious reggae cadence
    utterance.pitch = 0.95; // Warm deeper resonance

    // Try finding a suitable natural voice
    const voices = this.speechSynth.getVoices();
    const englishVoice = voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en-US') || v.lang.includes('en'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    this.currentUtterance = utterance;
    this.speechSynth.speak(utterance);
  }

  public stopSpeech() {
    if (this.speechSynth) {
      try {
        this.speechSynth.cancel();
      } catch {
        // ignore
      }
      this.currentUtterance = null;
    }
  }
}

export const reggaeEngine = new ReggaeAudioEngine();
