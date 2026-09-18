import React from 'react';
import { ArrowUp, ArrowLeft, Home } from 'lucide-react';

interface BackToTopBarProps {
  currentSectionName?: string;
}

export const BackToTopBar: React.FC<BackToTopBarProps> = ({ currentSectionName }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mt-12 pt-6 border-t border-[#1a2f20]/60 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-400">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">
          {currentSectionName ? `Viewing: ${currentSectionName}` : 'Crochet City Dreadlocks Studio'}
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Back to Index Page Button */}
        <button
          onClick={scrollToTop}
          className="group px-3.5 py-2 rounded-xl bg-[#111c14] hover:bg-[#182a1e] border border-[#213a27] hover:border-amber-400/60 text-stone-300 hover:text-amber-300 transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
          title="Return to the index home screen"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-xs font-semibold tracking-wide">
            Back to Index
          </span>
        </button>

        {/* Back to Top */}
        <button
          onClick={scrollToTop}
          className="group px-3.5 py-2 rounded-xl bg-[#0f1b13]/80 hover:bg-[#182b1e] border border-[#213b28] hover:border-amber-400/60 text-stone-300 hover:text-amber-300 transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
          title="Scroll to Top"
        >
          <span className="text-xs font-bold uppercase tracking-wider">
            ↑ Top
          </span>
          <div className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center group-hover:-translate-y-0.5 transition-transform">
            <ArrowUp className="w-3 h-3" />
          </div>
        </button>
      </div>
    </div>
  );
};
