import React, { useState } from 'react';
import { Sparkles, Eye, Sliders } from 'lucide-react';

interface DreadlocksBackdropProps {
  opacityLevel?: number; // 0 to 100
}

export const DreadlocksBackdrop: React.FC<DreadlocksBackdropProps> = () => {
  const [backdropMode, setBackdropMode] = useState<'high' | 'balanced' | 'subtle'>('balanced');
  const [showControls, setShowControls] = useState(false);

  // High-res photo of African woman with her back turned and beautiful thick dreadlocks cascading down
  const dreadlocksBgImage = "https://images.unsplash.com/photo-1584297091622-af8e5bd9c086?auto=format&fit=crop&w=2000&q=85";
  const alternateBg = "https://images.unsplash.com/photo-1574885834311-6b83f06079c6?auto=format&fit=crop&w=2000&q=85";

  const opacityMap = {
    high: 'opacity-75',
    balanced: 'opacity-55',
    subtle: 'opacity-35',
  };

  return (
    <aside aria-label="Background visual aesthetic" className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Woman with her back turned, long thick dreadlocks cascading down */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ease-in-out scale-105 ${opacityMap[backdropMode]}`}
        style={{
          backgroundImage: `url('${dreadlocksBgImage}')`,
          filter: 'contrast(1.15) brightness(0.95)',
        }}
      />

      {/* Secondary accent layer for depth & silky strand sheen */}
      <div 
        className="absolute inset-0 bg-cover bg-top bg-no-repeat mix-blend-overlay opacity-25"
        style={{
          backgroundImage: `url('${alternateBg}')`,
        }}
      />

      {/* Subtle vignette so typography and UI content always remain crystal clear and readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080d0a]/80 via-transparent to-[#080d0a]/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#090e0b]/40 to-[#070b09]/85" />

      {/* Rasta ambient colored highlights reflecting off loc strands */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[140px]" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-red-600/10 rounded-full blur-[140px]" />

      {/* Interactive Sheer Transparency Controller in bottom left */}
      <div className="pointer-events-auto absolute bottom-4 left-24 sm:left-28 z-40 hidden md:flex items-center">
        {showControls ? (
          <div className="p-2 px-3 rounded-2xl bg-[#0e1711]/90 backdrop-blur-md border border-[#233f2a] shadow-xl flex items-center gap-3 text-xs animate-in fade-in slide-in-from-left-2 duration-200">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Dreads Sheer:
            </span>
            <div className="flex items-center gap-1 bg-[#09100b] p-1 rounded-xl border border-[#1b2f21]">
              {(['high', 'balanced', 'subtle'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setBackdropMode(mode)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                    backdropMode === mode
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {mode === 'high' ? 'Bold Strands' : mode === 'balanced' ? 'Balanced' : 'Soft'}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowControls(false)}
              className="text-stone-400 hover:text-white text-xs p-0.5 ml-1"
              title="Hide controls"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowControls(true)}
            className="p-2 rounded-full bg-[#0c150f]/80 hover:bg-[#121f17] border border-[#213926] text-stone-400 hover:text-amber-400 transition-colors shadow-lg cursor-pointer flex items-center gap-1 text-[10px] font-bold"
            title="Adjust transparent background dreadlocks visibility"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline text-stone-300">Loc Backdrop</span>
          </button>
        )}
      </div>
    </aside>
  );
};
