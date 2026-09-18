import React from 'react';
import { SONG_METADATA } from '../data/songData';
import { reggaeEngine } from '../audio/reggaeEngine';
import { Music, Hand, Volume2, Info } from 'lucide-react';

export const ChordsAndJam: React.FC = () => {
  const handleAudition = (chordName: string) => {
    reggaeEngine.playChordAudition(chordName);
  };

  return (
    <div id="chords-jam-panel" className="bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4 mb-5">
        <div>
          <h3 className="text-xl font-serif font-bold text-stone-100 flex items-center gap-2">
            <span>Roots Chords & Musicians' Guide</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-normal">
              Tap Pads to Jam
            </span>
          </h3>
          <p className="text-xs text-stone-400">
            Harmonic structure of "Never Lose My Identity": 4-bar minor progression with classic one-drop chop.
          </p>
        </div>

        <div className="text-xs font-mono text-amber-400 bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800">
          STANDARD TUNING • ONE-DROP REGGAE
        </div>
      </div>

      {/* Interactive Chord Trigger Pads */}
      <div className="mb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold mb-3 flex items-center gap-1.5">
          <Hand className="w-3.5 h-3.5" />
          INTERACTIVE CHORD PADS (CLICK TO AUDITION SKANK & BASS)
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {SONG_METADATA.chordsProgression.map((chord) => (
            <button
              key={chord.name}
              id={`chord-pad-${chord.name}`}
              onClick={() => handleAudition(chord.name)}
              className="p-4 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-500/70 hover:bg-stone-800/80 transition-all text-center group flex flex-col justify-between shadow-md"
            >
              <div className="flex items-center justify-between text-stone-500 group-hover:text-amber-400 text-xs font-mono mb-1">
                <span>{chord.roman}</span>
                <Volume2 className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
              </div>
              <span className="text-2xl font-serif font-bold text-stone-100 group-hover:text-amber-300">
                {chord.name}
              </span>
              <div className="mt-2 text-[10px] font-mono text-stone-400">
                {chord.notes.join(' - ')}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* How to Play the Reggae Skank Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rhythm Guitar Guide */}
        <div className="bg-stone-950 border border-stone-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold mb-2">
            <Music className="w-4 h-4" />
            <span>GUITAR SKANK TECHNIQUE</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed font-sans mb-3">
            Use a barre chord shape on the top 4 strings (D, G, B, high E). Strike sharply downwards on the offbeats (beats 2 and 4), then release fretting hand pressure immediately to choke the sustain into a percussive "chop".
          </p>
          <div className="bg-stone-900 p-2.5 rounded-lg text-[11px] font-mono text-stone-400">
            <span className="text-amber-400 font-bold">Rhythm: </span>
            1 &nbsp; [<span className="text-emerald-400 font-bold">CHOP</span>] &nbsp; 2 &nbsp; [<span className="text-emerald-400 font-bold">CHOP</span>] &nbsp; 3 &nbsp; [<span className="text-emerald-400 font-bold">CHOP</span>] &nbsp; 4 &nbsp; [<span className="text-emerald-400 font-bold">CHOP</span>]
          </div>
        </div>

        {/* Heavy Sub-Bass & One-Drop Guide */}
        <div className="bg-stone-950 border border-stone-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold mb-2">
            <Music className="w-4 h-4" />
            <span>SUB-BASS & DRUM PHILOSOPHY</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed font-sans mb-3">
            In the One-Drop, beat 1 is open or carried purely by the hi-hat and rolling bass. Beat 3 receives the unified drop of both the kick drum and the rimshot snare. This creates the floating, meditative heartbeat rhythm.
          </p>
          <div className="bg-stone-900 p-2.5 rounded-lg text-[11px] font-mono text-stone-400">
            <span className="text-amber-400 font-bold">One-Drop: </span>
            Beat 1 (Open space) → Beat 2 (Skank) → Beat 3 (<span className="text-rose-400 font-bold">KICK + RIM</span>) → Beat 4 (Skank)
          </div>
        </div>
      </div>
    </div>
  );
};
