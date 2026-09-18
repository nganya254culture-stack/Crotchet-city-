import React, { useState } from 'react';
import { reggaeEngine, TrackStems, DubFxSettings } from '../audio/reggaeEngine';
import { Radio, Disc, Sliders, Flame, Sparkles, Volume2, VolumeX, ShieldAlert } from 'lucide-react';

interface DubConsoleProps {
  dubDropActive: boolean;
  onToggleDubDrop: () => void;
  vinylCrackle: boolean;
  onToggleVinyl: () => void;
}

export const DubConsole: React.FC<DubConsoleProps> = ({
  dubDropActive,
  onToggleDubDrop,
  vinylCrackle,
  onToggleVinyl,
}) => {
  const [stems, setStems] = useState<TrackStems>(() => ({ ...reggaeEngine.stems }));
  const [delayTime, setDelayTime] = useState<number>(reggaeEngine.fx.delayTime);
  const [delayFeedback, setDelayFeedback] = useState<number>(reggaeEngine.fx.delayFeedback);
  const [delayMix, setDelayMix] = useState<number>(reggaeEngine.fx.delayMix);
  const [subBoost, setSubBoost] = useState<number>(reggaeEngine.fx.subBoost);
  const [sirenPitch, setSirenPitch] = useState<number>(720);
  const [isSirenActive, setIsSirenActive] = useState<boolean>(false);

  const handleToggleStem = (stemKey: keyof TrackStems) => {
    const updated = !stems[stemKey];
    setStems(prev => ({ ...prev, [stemKey]: updated }));
    reggaeEngine.setStemMute(stemKey, updated);
  };

  const handleDelayTimeChange = (val: number) => {
    setDelayTime(val);
    reggaeEngine.setDelayTime(val);
  };

  const handleDelayFeedbackChange = (val: number) => {
    setDelayFeedback(val);
    reggaeEngine.setDelayFeedback(val);
  };

  const handleDelayMixChange = (val: number) => {
    setDelayMix(val);
    reggaeEngine.setDelayMix(val);
  };

  const handleSubBoostChange = (val: number) => {
    setSubBoost(val);
    reggaeEngine.setSubBoost(val);
  };

  const handleSirenMouseDown = () => {
    setIsSirenActive(true);
    reggaeEngine.triggerDubSiren(sirenPitch, 5);
  };

  const handleSirenMouseUp = () => {
    setIsSirenActive(false);
    reggaeEngine.stopDubSiren();
  };

  return (
    <div id="dub-mixing-console" className="bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xl">
      {/* Console Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <Sliders className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-lg font-serif font-bold text-stone-100 flex items-center gap-2">
              Tubby-Style Dub Mixing Desk
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-normal">
                4-Track Stems & Space Echo
              </span>
            </h3>
            <p className="text-xs text-stone-400">
              Manipulate delay repeats, sub-bass harmonics, and fire sound clash sirens in real time.
            </p>
          </div>
        </div>

        {/* Quick Action FX Buttons */}
        <div className="flex items-center gap-2">
          {/* Vinyl Crackle Button */}
          <button
            id="btn-vinyl-crackle"
            onClick={onToggleVinyl}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              vinylCrackle
                ? 'bg-amber-950/60 text-amber-300 border-amber-500/50'
                : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-stone-200'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            <span>VINYL CRACKLE {vinylCrackle ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center-Left: Stem Faders / Mutes */}
        <div className="lg:col-span-6 bg-stone-950 border border-stone-800/90 rounded-xl p-4">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold mb-3 block">
            TRACK STEMS (CLICK TO MUTE / ACTIVATE)
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {/* Drum Stem */}
            <button
              id="stem-drums"
              onClick={() => handleToggleStem('drums')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                stems.drums
                  ? 'bg-stone-900 border-emerald-500/50 text-stone-100 shadow-sm'
                  : 'bg-stone-900/40 border-stone-800 text-stone-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold">DRUMS</span>
                {stems.drums ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              </div>
              <span className="text-[10px] text-stone-400 mt-2 font-mono">One-Drop & Rim</span>
            </button>

            {/* Bass Stem */}
            <button
              id="stem-bass"
              onClick={() => handleToggleStem('bass')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                stems.bass
                  ? 'bg-stone-900 border-amber-500/50 text-stone-100 shadow-sm'
                  : 'bg-stone-900/40 border-stone-800 text-stone-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold">SUB BASS</span>
                {stems.bass ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              </div>
              <span className="text-[10px] text-stone-400 mt-2 font-mono">Heavy 40Hz Root</span>
            </button>

            {/* Skank Guitar Stem */}
            <button
              id="stem-skank"
              onClick={() => handleToggleStem('skank')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                stems.skank && !dubDropActive
                  ? 'bg-stone-900 border-emerald-500/50 text-stone-100 shadow-sm'
                  : 'bg-stone-900/40 border-stone-800 text-stone-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold">SKANK</span>
                {stems.skank && !dubDropActive ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              </div>
              <span className="text-[10px] text-stone-400 mt-2 font-mono">Offbeat Chop</span>
            </button>

            {/* Organ Bubble */}
            <button
              id="stem-organ"
              onClick={() => handleToggleStem('organ')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                stems.organ && !dubDropActive
                  ? 'bg-stone-900 border-amber-500/50 text-stone-100 shadow-sm'
                  : 'bg-stone-900/40 border-stone-800 text-stone-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold">ORGAN</span>
                {stems.organ && !dubDropActive ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              </div>
              <span className="text-[10px] text-stone-400 mt-2 font-mono">Hammond Bubble</span>
            </button>

            {/* Melodica Lead */}
            <button
              id="stem-melody"
              onClick={() => handleToggleStem('melody')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                stems.melody && !dubDropActive
                  ? 'bg-stone-900 border-emerald-500/50 text-stone-100 shadow-sm'
                  : 'bg-stone-900/40 border-stone-800 text-stone-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold">MELODICA</span>
                {stems.melody && !dubDropActive ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              </div>
              <span className="text-[10px] text-stone-400 mt-2 font-mono">Roots Horn Line</span>
            </button>

            {/* Nyabinghi Percussion */}
            <button
              id="stem-nyabinghi"
              onClick={() => handleToggleStem('nyabinghi')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                stems.nyabinghi
                  ? 'bg-stone-900 border-rose-500/50 text-stone-100 shadow-sm'
                  : 'bg-stone-900/40 border-stone-800 text-stone-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold">NYABINGHI</span>
                {stems.nyabinghi ? <Volume2 className="w-3.5 h-3.5 text-rose-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              </div>
              <span className="text-[10px] text-stone-400 mt-2 font-mono">Heartbeat & Funde</span>
            </button>
          </div>

          {/* Big Dub Drop Button */}
          <div className="mt-4 pt-4 border-t border-stone-800">
            <button
              id="btn-dub-drop-latch"
              onClick={onToggleDubDrop}
              className={`w-full py-3.5 px-4 rounded-xl text-xs font-mono uppercase tracking-widest font-black transition-all flex items-center justify-center gap-2.5 shadow-lg ${
                dubDropActive
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 ring-2 ring-rose-400 animate-pulse'
                  : 'bg-stone-900 hover:bg-stone-800 text-rose-300 border border-rose-900/80'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>{dubDropActive ? 'DUB DROP ENGAGED (CUTS KEYS & BOOSTS ECHO)' : 'DROP THE DUB (CUT KEYS & LET BASS ROAR)'}</span>
            </button>
          </div>
        </div>

        {/* Right / Center-Right: Space Echo Tape Delay & Siren */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Space Echo Tape Delay Unit */}
          <div className="bg-stone-950 border border-stone-800/90 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                SPACE ECHO TAPE DELAY
              </span>
              <span className="text-[10px] font-mono text-stone-400">Roland RE-201 Emulation</span>
            </div>

            <div className="space-y-3">
              {/* Delay Time */}
              <div>
                <div className="flex justify-between text-xs font-mono text-stone-300 mb-1">
                  <span>ECHO TIME</span>
                  <span className="text-amber-400 font-bold">{Math.round(delayTime * 1000)} ms</span>
                </div>
                <input
                  id="slider-delay-time"
                  type="range"
                  min={0.15}
                  max={0.8}
                  step={0.01}
                  value={delayTime}
                  onChange={(e) => handleDelayTimeChange(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Feedback / Repeats */}
              <div>
                <div className="flex justify-between text-xs font-mono text-stone-300 mb-1">
                  <span>REPEATS / FEEDBACK</span>
                  <span className="text-amber-400 font-bold">{Math.round(delayFeedback * 100)}%</span>
                </div>
                <input
                  id="slider-delay-feedback"
                  type="range"
                  min={0.1}
                  max={0.85}
                  step={0.01}
                  value={delayFeedback}
                  onChange={(e) => handleDelayFeedbackChange(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Mix Level */}
              <div>
                <div className="flex justify-between text-xs font-mono text-stone-300 mb-1">
                  <span>DUB WET MIX</span>
                  <span className="text-amber-400 font-bold">{Math.round(delayMix * 100)}%</span>
                </div>
                <input
                  id="slider-delay-mix"
                  type="range"
                  min={0}
                  max={0.9}
                  step={0.02}
                  value={delayMix}
                  onChange={(e) => handleDelayMixChange(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Sub Bass EQ Boost */}
              <div>
                <div className="flex justify-between text-xs font-mono text-stone-300 mb-1">
                  <span>SUB-BASS BOOST (45Hz)</span>
                  <span className="text-emerald-400 font-bold">+{subBoost} dB</span>
                </div>
                <input
                  id="slider-sub-boost"
                  type="range"
                  min={0}
                  max={12}
                  step={1}
                  value={subBoost}
                  onChange={(e) => handleSubBoostChange(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Authentic Sound Clash Dub Siren */}
          <div className="bg-stone-950 border border-stone-800/90 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-semibold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" />
                DUB SIREN (HOLD TO SOUND)
              </span>
              <span className="text-[10px] font-mono text-stone-400">Classic Sound System LFO</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="btn-dub-siren-trigger"
                onMouseDown={handleSirenMouseDown}
                onMouseUp={handleSirenMouseUp}
                onTouchStart={handleSirenMouseDown}
                onTouchEnd={handleSirenMouseUp}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono uppercase tracking-widest font-black transition-all border shadow-lg select-none ${
                  isSirenActive
                    ? 'bg-rose-500 text-stone-950 border-rose-400 ring-2 ring-rose-300 shadow-rose-500/40'
                    : 'bg-stone-900 hover:bg-stone-800 text-rose-400 border-rose-800 hover:border-rose-600'
                }`}
              >
                {isSirenActive ? 'SIREN ROARING THROUGH DELAY!' : 'TRIGGER SIREN'}
              </button>

              <div className="w-28 text-right">
                <span className="text-[10px] font-mono text-stone-400 block mb-0.5">PITCH HZ</span>
                <input
                  id="slider-siren-pitch"
                  type="range"
                  min={400}
                  max={1100}
                  value={sirenPitch}
                  onChange={(e) => setSirenPitch(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
