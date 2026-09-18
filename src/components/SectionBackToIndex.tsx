import React from 'react';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';

interface SectionBackToIndexProps {
  sectionTitle: string;
  categoryBadge?: string;
}

export const SectionBackToIndex: React.FC<SectionBackToIndexProps> = ({
  sectionTitle,
  categoryBadge,
}) => {
  const handleBackToIndex = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#1c2e22]/70 text-xs">
      <button
        onClick={handleBackToIndex}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#111c14] hover:bg-[#18291e] border border-[#213a27] hover:border-amber-400/50 text-stone-300 hover:text-amber-300 transition-all cursor-pointer shadow-sm group active:scale-95"
        title="Return to top of page (Index)"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
        <span className="font-semibold text-xs tracking-wide">← Back to Index</span>
      </button>

      <div className="flex items-center gap-2 text-stone-400">
        {categoryBadge && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            {categoryBadge}
          </span>
        )}
        <span className="text-[11px] font-mono text-stone-400">
          Index / <span className="text-stone-300 font-semibold">{sectionTitle}</span>
        </span>
      </div>
    </div>
  );
};
