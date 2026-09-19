import React, { useState, useEffect } from 'react';
import { Sparkles, Eye, Sliders, Image as ImageIcon } from 'lucide-react';
import { getActiveBackground, DEFAULT_BACKGROUND_PHOTO, ALTERNATE_BACKGROUND_PHOTO } from '../data/mediaGallery';

interface DreadlocksBackdropProps {
  opacityLevel?: number; // 0 to 100
  onOpenMediaStudio?: () => void;
}

export const DreadlocksBackdrop: React.FC<DreadlocksBackdropProps> = ({ onOpenMediaStudio }) => {
  const [backdropMode, setBackdropMode] = useState<'high' | 'balanced' | 'subtle'>('subtle');
  const [showControls, setShowControls] = useState(false);
  const [activeMedia, setActiveMedia] = useState<{ url: string; type: 'image' | 'video' }>(() => getActiveBackground());

  useEffect(() => {
    setActiveMedia(getActiveBackground());

    const handleBgChange = (e: Event) => {
      try {
        const customEv = e as CustomEvent<{ url: string; type: 'image' | 'video' }>;
        if (customEv && customEv.detail && typeof customEv.detail.url === 'string') {
          setActiveMedia({
            url: customEv.detail.url,
            type: customEv.detail.type === 'video' ? 'video' : 'image',
          });
        }
      } catch {
        setActiveMedia(getActiveBackground());
      }
    };

    window.addEventListener('crochet-bg-changed', handleBgChange as EventListener);
    return () => window.removeEventListener('crochet-bg-changed', handleBgChange as EventListener);
  }, []);

  const opacityMap = {
    high: 'opacity-40',
    balanced: 'opacity-25',
    subtle: 'opacity-15',
  };

  const currentUrl = activeMedia?.url || DEFAULT_BACKGROUND_PHOTO;
  const isVideo = activeMedia?.type === 'video';

  return (
    <aside aria-label="Background visual aesthetic" className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Active Developer / Preset Background: Photo or Ambient Video */}
      {isVideo ? (
        <video
          src={currentUrl}
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out scale-105 ${opacityMap[backdropMode]}`}
          style={{ filter: 'contrast(1.15) brightness(0.95)' }}
        />
      ) : (
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ease-in-out scale-105 ${opacityMap[backdropMode]}`}
          style={{
            backgroundImage: `url('${currentUrl}')`,
            filter: 'contrast(1.15) brightness(0.95)',
          }}
        />
      )}

      {/* Secondary accent layer for depth & silky strand sheen */}
      <div 
        className="absolute inset-0 bg-cover bg-top bg-no-repeat mix-blend-overlay opacity-20"
        style={{
          backgroundImage: `url('${ALTERNATE_BACKGROUND_PHOTO}')`,
        }}
      />

      {/* Subtle vignette so typography and UI content always remain crystal clear and readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080d0a]/80 via-transparent to-[#080d0a]/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#090e0b]/40 to-[#070b09]/85" />

      {/* Rasta ambient colored highlights reflecting off loc strands */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-[140px]" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-red-600/15 rounded-full blur-[140px]" />

      {/* Interactive Sheer Transparency & Photo Studio Controller in bottom left */}
      <div className="pointer-events-auto absolute bottom-4 left-24 sm:left-28 z-40 hidden md:flex items-center gap-2">
        {showControls ? (
          <div className="p-2 px-3 rounded-2xl bg-[#0e1711]/95 backdrop-blur-md border border-[#233f2a] shadow-xl flex items-center gap-3 text-xs animate-in fade-in slide-in-from-left-2 duration-200">
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

            {onOpenMediaStudio && (
              <button
                onClick={onOpenMediaStudio}
                className="px-2.5 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 hover:text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                title="Upload or change background photo/video from gallery"
              >
                <ImageIcon className="w-3 h-3 text-amber-400" />
                <span>Change Photo</span>
              </button>
            )}

            <button
              onClick={() => setShowControls(false)}
              className="text-stone-400 hover:text-white text-xs p-0.5 ml-0.5 cursor-pointer"
              title="Hide controls"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowControls(true)}
              className="p-2 rounded-full bg-[#0c150f]/80 hover:bg-[#121f17] border border-[#213926] text-stone-400 hover:text-amber-400 transition-colors shadow-lg cursor-pointer flex items-center gap-1 text-[10px] font-bold"
              title="Adjust transparent background dreadlocks visibility"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xl:inline text-stone-300">Loc Backdrop</span>
            </button>

            {onOpenMediaStudio && (
              <button
                onClick={onOpenMediaStudio}
                className="p-2 rounded-full bg-[#0c150f]/80 hover:bg-[#121f17] border border-[#213926] text-stone-400 hover:text-amber-400 transition-colors shadow-lg cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                title="Developer Gallery & Media Studio: Add photos from device"
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden xl:inline text-stone-300">Photos</span>
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
