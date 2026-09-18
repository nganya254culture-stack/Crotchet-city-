import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Disc, Sparkles, Sliders, Radio, Music, Flame, BellRing, Zap } from 'lucide-react';
import { reggaeEngine, TrackStems } from '../audio/reggaeEngine';

export const StudioVibePlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [bpm, setBpm] = useState(74);
  const [dubDropActive, setDubDropActive] = useState(false);
  const [vinylCrackle, setVinylCrackle] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentBar, setCurrentBar] = useState(0);
  const [sirenActive, setSirenActive] = useState(false);
  const [stems, setStems] = useState<TrackStems>({ ...reggaeEngine.stems });

  // Equalizer visualizer bars simulation
  const [eqLevels, setEqLevels] = useState<number[]>([40, 65, 80, 50, 90, 75, 60, 45]);

  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      const updateEq = () => {
        setEqLevels([
          Math.floor(30 + Math.random() * 60),
          Math.floor(40 + Math.random() * 55),
          Math.floor(50 + Math.random() * 50),
          Math.floor(35 + Math.random() * 65),
          Math.floor(60 + Math.random() * 40),
          Math.floor(45 + Math.random() * 50),
          Math.floor(40 + Math.random() * 55),
          Math.floor(25 + Math.random() * 65),
        ]);
        animId = requestAnimationFrame(updateEq);
      };
      const interval = setInterval(updateEq, 120);
      return () => {
        clearInterval(interval);
        cancelAnimationFrame(animId);
      };
    } else {
      setEqLevels([15, 20, 25, 20, 30, 25, 20, 15]);
    }
  }, [isPlaying]);

  const togglePlayback = () => {
    if (isPlaying) {
      reggaeEngine.pause();
      setIsPlaying(false);
    } else {
      reggaeEngine.start((step, bar) => {
        setCurrentStep(step);
        setCurrentBar(bar);
      });
      setIsPlaying(true);
    }
  };

  const handleBpmChange = (newBpm: number) => {
    setBpm(newBpm);
    reggaeEngine.setBpm(newBpm);
  };

  const handleToggleDubDrop = () => {
    const newState = reggaeEngine.toggleDubDrop();
    setDubDropActive(newState);
  };

  const handleToggleVinyl = () => {
    const newState = reggaeEngine.toggleVinylCrackle();
    setVinylCrackle(newState);
  };

  const handleSirenMouseDown = () => {
    setSirenActive(true);
    reggaeEngine.triggerDubSiren(760, 5);
  };

  const handleSirenMouseUp = () => {
    setSirenActive(false);
    reggaeEngine.stopDubSiren();
  };

  const handleStemToggle = (stem: keyof TrackStems) => {
    const updated = !stems[stem];
    reggaeEngine.setStemMute(stem, updated);
    setStems({ ...stems, [stem]: updated });
  };

  return (
    <div className="fixed bottom-24 right-5 z-40">
      {/* Expanded Studio Audio Console */}
      {isExpanded && (
        <div className="mb-3 w-80 sm:w-96 rounded-3xl bg-[#0e1611] border border-[#25422e] shadow-2xl p-4 text-white animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#1f3625]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                <Radio className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white font-syne">
                  Studio Dub & Roots Radio
                </h4>
                <p className="text-[10px] text-emerald-400 font-semibold">
                  Live Westlands Reggae Vinyl Lounge
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-stone-400 hover:text-white text-xs p-1"
            >
              ✕
            </button>
          </div>

          {/* Turntable / Vinyl Visualizer */}
          <div className="py-4 flex items-center justify-center gap-6">
            <div className="relative flex items-center justify-center">
              {/* Spinning Vinyl */}
              <div
                className={`w-28 h-28 rounded-full bg-[#121212] border-4 border-[#222] flex items-center justify-center shadow-xl relative overflow-hidden ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '3.5s' }}
              >
                {/* Vinyl Grooves */}
                <div className="absolute inset-2 rounded-full border border-stone-800" />
                <div className="absolute inset-4 rounded-full border border-stone-800" />
                <div className="absolute inset-6 rounded-full border border-stone-800" />
                
                {/* Center Label (Rasta colors) */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 via-amber-500 to-red-600 p-0.5 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#0d1510] flex items-center justify-center">
                    <span className="text-[7px] font-black text-amber-400">DUB</span>
                  </div>
                </div>
              </div>

              {/* Tonearm needle representation */}
              <div
                className={`absolute top-0 right-1 w-2 h-16 bg-stone-400 origin-top rounded transition-transform duration-500 ${
                  isPlaying ? 'rotate-12' : '-rotate-12'
                }`}
              />
            </div>

            {/* Equalizer frequency bars */}
            <div className="flex items-end gap-1.5 h-16 p-2 rounded-xl bg-[#09100b] border border-[#1a2f20]">
              {eqLevels.map((lvl, idx) => (
                <div
                  key={idx}
                  className="w-2 rounded-t transition-all duration-100"
                  style={{
                    height: `${lvl}%`,
                    backgroundColor: idx % 3 === 0 ? '#10b981' : idx % 3 === 1 ? '#f59e0b' : '#ef4444',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Play / Pause & Controls */}
          <div className="grid grid-cols-3 gap-2 pb-3">
            <button
              onClick={togglePlayback}
              className={`col-span-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all ${
                isPlaying
                  ? 'bg-amber-500 text-stone-950 hover:bg-amber-400'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            {/* DUB SIREN AIR HORN BUTTON */}
            <button
              onMouseDown={handleSirenMouseDown}
              onMouseUp={handleSirenMouseUp}
              onTouchStart={handleSirenMouseDown}
              onTouchEnd={handleSirenMouseUp}
              className={`col-span-1 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all border ${
                sirenActive
                  ? 'bg-red-600 text-white scale-95 border-red-400 shadow-lg shadow-red-600/50'
                  : 'bg-[#1a251c] text-red-400 hover:bg-red-950/40 border-red-900/40'
              }`}
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>Siren 🚨</span>
            </button>

            {/* DUB DROP */}
            <button
              onClick={handleToggleDubDrop}
              className={`col-span-1 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all border ${
                dubDropActive
                  ? 'bg-purple-700 text-white border-purple-400 shadow-lg shadow-purple-700/40'
                  : 'bg-[#1a251c] text-purple-300 hover:bg-purple-950/40 border-purple-900/40'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Dub Drop</span>
            </button>
          </div>

          {/* Stems Mute / Unmute */}
          <div className="pt-2 border-t border-[#1d3323]">
            <p className="text-[10px] uppercase font-bold text-stone-400 mb-1.5">
              Instrument Stems:
            </p>
            <div className="grid grid-cols-4 gap-1.5 text-[10px]">
              {(['drums', 'bass', 'skank', 'melody'] as (keyof TrackStems)[]).map((stem) => (
                <button
                  key={stem}
                  onClick={() => handleStemToggle(stem)}
                  className={`py-1 rounded-md text-center font-bold capitalize cursor-pointer border ${
                    stems[stem]
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                      : 'bg-[#101912] text-stone-500 border-[#192b1e] line-through'
                  }`}
                >
                  {stem}
                </button>
              ))}
            </div>
          </div>

          {/* Tempo & Vinyl Crackle */}
          <div className="pt-3 border-t border-[#1d3323] flex items-center justify-between text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-stone-400">Tempo:</span>
              <span className="font-mono font-bold text-amber-400">{bpm} BPM</span>
              <input
                type="range"
                min="64"
                max="88"
                value={bpm}
                onChange={(e) => handleBpmChange(Number(e.target.value))}
                className="w-16 accent-amber-500 cursor-pointer"
              />
            </div>

            <button
              onClick={handleToggleVinyl}
              className={`text-[10px] font-bold px-2 py-1 rounded border cursor-pointer ${
                vinylCrackle
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-stone-900 text-stone-500 border-stone-800'
              }`}
            >
              Vinyl Crackle: {vinylCrackle ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      )}

      {/* Floating Pill Trigger */}
      <div className="flex items-center gap-2">
        <button
          id="studio-vibe-audio-toggle"
          onClick={togglePlayback}
          className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-full shadow-xl border cursor-pointer transition-all duration-300 ${
            isPlaying
              ? 'bg-gradient-to-r from-emerald-800 via-amber-700 to-red-800 border-amber-400 text-white shadow-amber-500/30 ring-2 ring-amber-400/40'
              : 'bg-[#121c15]/95 hover:bg-[#19281e] border-[#25402c] text-stone-200'
          }`}
          title="Play Studio Roots Reggae Vibes"
        >
          {/* Animated Vinyl Icon */}
          <div className="relative flex items-center justify-center">
            <Disc className={`w-4 h-4 text-amber-400 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '2s' }} />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
              <span>{isPlaying ? 'Studio Dub Playing' : 'Play Roots Dub'}</span>
              {isPlaying && <span className="text-amber-300 text-[10px]">♫</span>}
            </span>
            <span className="text-[9px] text-stone-300">
              {isPlaying ? 'Live Vinyl Lounge' : 'Authentic Studio Vibes'}
            </span>
          </div>

          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center ml-0.5">
            {isPlaying ? <Pause className="w-2.5 h-2.5 fill-white" /> : <Play className="w-2.5 h-2.5 fill-white" />}
          </div>
        </button>

        {/* Mixer toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-9 h-9 rounded-full bg-[#121c15]/95 hover:bg-[#19281e] border border-[#25402c] text-amber-400 flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
          title="Open Roots Reggae Deck Controls"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
