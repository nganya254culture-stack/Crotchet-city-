import React from 'react';
import { Play, Pause, Square, RotateCcw, Volume2, VolumeX, FastForward, Rewind, Music2, Gauge } from 'lucide-react';
import { SONG_SECTIONS, SongSection } from '../data/songData';

interface SongPlayerProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onRewind: () => void;
  currentTimeMs: number;
  totalDurationMs: number;
  currentSectionId: string;
  onSelectSection: (section: SongSection) => void;
  bpm: number;
  onBpmChange: (bpm: number) => void;
  vocalNarrationEnabled: boolean;
  onToggleVocalNarration: () => void;
}

export const SongPlayer: React.FC<SongPlayerProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onStop,
  onRewind,
  currentTimeMs,
  totalDurationMs,
  currentSectionId,
  onSelectSection,
  bpm,
  onBpmChange,
  vocalNarrationEnabled,
  onToggleVocalNarration,
}) => {
  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const progressPercent = Math.min(100, Math.max(0, (currentTimeMs / totalDurationMs) * 100));

  return (
    <div id="reggae-song-player" className="bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xl">
      {/* Song Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Roots Reggae Anthem
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              One-Drop 4/4 • Key Am
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-100 tracking-tight">
            Never Lose My Identity
          </h2>
          <p className="text-sm font-medium text-stone-400 mt-0.5">
            "Rasta is the only currency I have" • Steadfast Against Systemic Struggle
          </p>
        </div>

        {/* Vocal Chant / Speech Narration Toggle & Tempo */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Vocal Toggle */}
          <button
            id="btn-toggle-vocals"
            onClick={onToggleVocalNarration}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono font-semibold transition-all border ${
              vocalNarrationEnabled
                ? 'bg-emerald-900/60 text-emerald-200 border-emerald-500/50 shadow-sm'
                : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-stone-200'
            }`}
            title="Toggle synthesized roots vocal delivery"
          >
            {vocalNarrationEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
            <span>{vocalNarrationEnabled ? 'VOCALS ACTIVE' : 'VOCALS MUTED'}</span>
          </button>

          {/* Tempo Selector */}
          <div className="flex items-center gap-2 bg-stone-950 border border-stone-800 px-3 py-1.5 rounded-xl">
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-mono text-stone-400">TEMPO:</span>
            <input
              id="bpm-slider"
              type="range"
              min={66}
              max={84}
              value={bpm}
              onChange={(e) => onBpmChange(Number(e.target.value))}
              className="w-16 accent-amber-500 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-amber-300 w-12 text-right">
              {bpm} BPM
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar & Timeline */}
      <div className="mt-5">
        <div className="flex justify-between items-center text-xs font-mono text-stone-400 mb-1.5">
          <span>{formatTime(currentTimeMs)}</span>
          <span className="text-stone-500 font-sans text-[11px]">
            {Math.round(progressPercent)}% of Full Song
          </span>
          <span>{formatTime(totalDurationMs)}</span>
        </div>

        {/* Interactive Track Timeline */}
        <div className="w-full bg-stone-950 h-3 rounded-full overflow-hidden border border-stone-800 relative cursor-pointer">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 transition-all duration-100 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Song Section Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar mt-1">
          {SONG_SECTIONS.map((sec) => {
            const isCurrent = sec.id === currentSectionId;
            return (
              <button
                key={sec.id}
                id={`btn-section-${sec.id}`}
                onClick={() => onSelectSection(sec)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-mono transition-all border shrink-0 ${
                  isCurrent
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-stone-950/60 text-stone-400 border-stone-800 hover:bg-stone-800 hover:text-stone-200'
                }`}
              >
                {sec.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Transport Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-stone-800">
        <div className="flex items-center gap-2">
          {/* Rewind */}
          <button
            id="btn-rewind"
            onClick={onRewind}
            className="p-2.5 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white transition-colors border border-stone-700"
            title="Rewind to beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Main Play / Pause */}
          <button
            id="btn-main-play-pause"
            onClick={isPlaying ? onPause : onPlay}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all shadow-lg ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/20'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>PAUSE RIDDIM</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>PLAY ROOTS RIDDIM</span>
              </>
            )}
          </button>

          {/* Stop */}
          <button
            id="btn-stop"
            onClick={onStop}
            className="p-2.5 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-rose-400 transition-colors border border-stone-700"
            title="Stop playback"
          >
            <Square className="w-4 h-4" />
          </button>
        </div>

        {/* Key & Riddim Info Badge */}
        <div className="flex items-center gap-3 text-xs font-mono text-stone-400">
          <div className="flex items-center gap-1.5">
            <Music2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>PROGRESSION:</span>
            <span className="font-bold text-stone-200">Am - F - C - G</span>
          </div>
          <span className="text-stone-600">•</span>
          <div>
            <span>BEAT:</span>
            <span className="font-bold text-amber-300 ml-1">Kick on 3 (One-Drop)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
