import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowLeft, Home } from 'lucide-react';

export const FloatingBackToIndex: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBackToIndex = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-3 sm:bottom-6 sm:left-6 z-40 animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-[calc(100vw-1.5rem)]">
      <button
        onClick={handleBackToIndex}
        className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0c140f]/95 hover:bg-[#142318] border border-emerald-500/40 hover:border-amber-400 text-stone-200 hover:text-amber-300 shadow-xl backdrop-blur-md transition-all cursor-pointer active:scale-95 text-xs font-semibold"
        title="Return to the index home screen"
      >
        <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center group-hover:-translate-x-0.5 transition-transform">
          <ArrowLeft className="w-3 h-3" />
        </div>
        <span className="tracking-wide">Back to Index</span>
      </button>
    </div>
  );
};
