import React from 'react';
import { Sparkles } from 'lucide-react';

interface SectionBackToIndexProps {
  sectionTitle: string;
  categoryBadge?: string;
}

export const SectionBackToIndex: React.FC<SectionBackToIndexProps> = ({
  sectionTitle,
  categoryBadge,
}) => {
  // Renders a clean, non-intrusive section indicator without conflicting buttons
  if (!categoryBadge && !sectionTitle) return null;

  return (
    <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#1c2e22]/40 text-xs">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span className="text-[11px] font-mono text-stone-400">
          Studio / <span className="text-stone-300 font-semibold">{sectionTitle}</span>
        </span>
      </div>

      {categoryBadge && (
        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
          {categoryBadge}
        </span>
      )}
    </div>
  );
};
