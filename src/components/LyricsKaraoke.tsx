import React, { useState } from 'react';
import { SONG_LYRICS, LyricLine, SONG_METADATA } from '../data/songData';
import { BookOpen, Sparkles, Music, Share2, Copy, Check, Info } from 'lucide-react';

interface LyricsKaraokeProps {
  currentTimeMs: number;
  onSeekToLine: (line: LyricLine) => void;
  showChords: boolean;
  onToggleChords: () => void;
}

export const LyricsKaraoke: React.FC<LyricsKaraokeProps> = ({
  currentTimeMs,
  onSeekToLine,
  showChords,
  onToggleChords,
}) => {
  const [selectedLineInfo, setSelectedLineInfo] = useState<LyricLine | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'chorus' | 'verse' | 'bridge'>('all');

  // Find active line
  const activeLine = SONG_LYRICS.find(
    (l) => currentTimeMs >= l.timeMs && currentTimeMs < l.timeMs + l.durationMs
  ) || SONG_LYRICS[0];

  const handleCopyFullLyrics = () => {
    const text = SONG_LYRICS.map(l => `${showChords && l.chords ? `[${l.chords}]\n` : ''}${l.text}`).join('\n\n');
    const header = `${SONG_METADATA.title} - ${SONG_METADATA.subtitle}\nKey: ${SONG_METADATA.key} | Tempo: ${SONG_METADATA.bpm} BPM\n\n`;
    navigator.clipboard.writeText(header + text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredLyrics = SONG_LYRICS.filter((line) => {
    if (activeFilter === 'chorus') return line.section.includes('chorus');
    if (activeFilter === 'verse') return line.section.includes('verse');
    if (activeFilter === 'bridge') return line.section.includes('bridge') || line.section.includes('dub');
    return true;
  });

  return (
    <div id="lyrics-karaoke-studio" className="bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xl">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4 mb-5">
        <div>
          <h3 className="text-xl font-serif font-bold text-stone-100 flex items-center gap-2">
            <span>Lyrics & Sacred Reasoning</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-normal">
              Click any line to jump audio
            </span>
          </h3>
          <p className="text-xs text-stone-400">
            A song of steadfast faith against poverty, systemic discrimination, and the trials of the city.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          {/* Toggle Chords */}
          <button
            id="btn-toggle-chords"
            onClick={onToggleChords}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              showChords
                ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-stone-200'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>{showChords ? 'CHORDS ON' : 'CHORDS OFF'}</span>
          </button>

          {/* Copy Full Lyrics */}
          <button
            id="btn-copy-lyrics"
            onClick={handleCopyFullLyrics}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'COPIED' : 'COPY'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[11px] font-mono text-stone-500 mr-1">VIEW:</span>
        {(['all', 'chorus', 'verse', 'bridge'] as const).map((filter) => (
          <button
            key={filter}
            id={`filter-${filter}`}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1 rounded-md text-xs font-mono capitalize transition-all ${
              activeFilter === filter
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'bg-stone-950/60 text-stone-400 hover:bg-stone-800'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Lyrics List */}
      <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredLyrics.map((line) => {
          const isCurrent = activeLine?.id === line.id;
          const isChorus = line.section.includes('chorus');

          return (
            <div
              key={line.id}
              id={`lyric-line-${line.id}`}
              onClick={() => onSeekToLine(line)}
              className={`p-3 sm:p-4 rounded-xl border transition-all cursor-pointer group relative ${
                isCurrent
                  ? 'bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-transparent border-amber-400/80 shadow-md shadow-amber-500/10 translate-x-1'
                  : isChorus
                  ? 'bg-stone-950/80 border-stone-800 hover:border-stone-700 hover:bg-stone-800/50'
                  : 'bg-stone-950/40 border-stone-800/80 hover:border-stone-700 hover:bg-stone-800/40'
              }`}
            >
              {/* Chords display */}
              {showChords && line.chords && (
                <div className="text-xs font-mono font-bold text-amber-400 mb-1 flex items-center gap-2">
                  <span className="bg-stone-900 px-2 py-0.5 rounded border border-amber-500/30">
                    {line.chords}
                  </span>
                  {isChorus && (
                    <span className="text-[10px] text-emerald-400 font-sans tracking-wide">
                      [Chorus Hook]
                    </span>
                  )}
                </div>
              )}

              {/* Main Lyric Text */}
              <div className="flex items-baseline justify-between gap-4">
                <p
                  className={`text-base sm:text-lg font-serif transition-colors ${
                    isCurrent
                      ? 'text-amber-200 font-bold'
                      : isChorus
                      ? 'text-stone-100 font-semibold'
                      : 'text-stone-300 font-normal'
                  }`}
                >
                  {line.text}
                </p>

                {/* Cultural Reasoning Trigger */}
                <button
                  id={`info-${line.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLineInfo(selectedLineInfo?.id === line.id ? null : line);
                  }}
                  className="p-1 rounded text-stone-500 hover:text-amber-400 transition-colors shrink-0"
                  title="View Rastafari cultural reasoning & meaning"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>

              {/* Expanded Cultural Reasoning / Story Card */}
              {selectedLineInfo?.id === line.id && (
                <div className="mt-3 pt-3 border-t border-stone-800/80 text-xs bg-stone-900/90 rounded-lg p-3 text-stone-300 space-y-1.5 animate-fadeIn">
                  <div className="flex items-center gap-1.5 text-amber-300 font-mono font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>LIVITY & PHILOSOPHY:</span>
                  </div>
                  <p className="text-stone-300 leading-relaxed font-sans">
                    {line.culturalNote}
                  </p>
                  {line.patwaMeaning && (
                    <p className="text-stone-400 italic text-[11px]">
                      Roots meaning: "{line.patwaMeaning}"
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dedication Card */}
      <div className="mt-5 p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-start gap-3">
        <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
        <div className="text-xs text-stone-400 leading-relaxed">
          <strong className="text-amber-300 font-serif">Cultural Message: </strong>
          In Rastafari philosophy, material paper currency is temporal and fragile. The true currency of a conscious human being is their identity, faith, upright moral spine, and covenant with Creation. No gatekeeper can take that away.
        </div>
      </div>
    </div>
  );
};
