import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CreditCard, 
  Sparkles, 
  MessageSquare, 
  Phone, 
  ArrowUp, 
  Disc,
  Layers,
  ChevronRight,
  X
} from 'lucide-react';
import { STUDIO_INFO } from '../data/crochetData';
import { reggaeEngine } from '../audio/reggaeEngine';

interface LeftFloatingBarProps {
  onOpenBooking: () => void;
  onOpenMpesa: () => void;
  onOpenDiagnosis: () => void;
  onOpenWhatsAppPopup: () => void;
}

export const LeftFloatingBar: React.FC<LeftFloatingBarProps> = ({
  onOpenBooking,
  onOpenMpesa,
  onOpenDiagnosis,
  onOpenWhatsAppPopup,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = Math.round((window.scrollY / totalHeight) * 100);
        setScrollProgress(currentProgress);
        setIsScrolled(window.scrollY > 180);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const buttons = [
    {
      id: 'left-btn-book',
      label: 'Book Chair',
      sub: 'Lock in date with P',
      icon: <Calendar className="w-4 h-4 text-stone-950" />,
      color: 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-stone-950 border-amber-300 shadow-amber-500/30',
      action: onOpenBooking,
      glow: true,
    },
    {
      id: 'left-btn-mpesa',
      label: 'Lipa M-Pesa',
      sub: `Till ${STUDIO_INFO.mpesaTill}`,
      icon: <CreditCard className="w-4 h-4 text-white" />,
      color: 'bg-[#008751] hover:bg-[#009c5d] text-white border-emerald-400/50 shadow-emerald-600/30',
      action: onOpenMpesa,
      glow: false,
    },
    {
      id: 'left-btn-quiz',
      label: 'Loc Doctor',
      sub: 'Diagnosis & Price Quote',
      icon: <Sparkles className="w-4 h-4 text-amber-300" />,
      color: 'bg-[#152319] hover:bg-[#1f3627] text-amber-300 border-amber-500/40 shadow-emerald-950/40',
      action: onOpenDiagnosis,
      glow: false,
    },
    {
      id: 'left-btn-whatsapp',
      label: 'WhatsApp P',
      sub: 'Instant quote & photos',
      icon: <MessageSquare className="w-4 h-4 text-white" />,
      color: 'bg-[#25D366] hover:bg-[#20ba59] text-white border-emerald-300/40 shadow-emerald-500/30',
      action: onOpenWhatsAppPopup,
      glow: true,
    },
    {
      id: 'left-btn-call',
      label: 'Call Studio',
      sub: STUDIO_INFO.phone,
      icon: <Phone className="w-4 h-4 text-stone-200" />,
      color: 'bg-[#121c15] hover:bg-[#1b2b20] text-stone-200 border-[#263e2c]',
      action: () => {
        window.location.href = `tel:${STUDIO_INFO.phone.replace(/ /g, '')}`;
      },
      glow: false,
    },
  ];

  return (
    <>
      {/* Desktop & Tablet: Left Floating Action Vertical Dock */}
      <aside 
        aria-label="Quick actions"
        className="fixed left-3 sm:left-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-2.5 p-2 rounded-2xl bg-[#09110b]/90 backdrop-blur-xl border border-[#223927]/90 shadow-2xl shadow-black/90"
      >
        {/* Rasta vertical accent ribbon */}
        <div className="w-1 h-8 rounded-full bg-gradient-to-b from-emerald-500 via-amber-400 to-red-500 mb-1" />

        {buttons.map((btn) => (
          <div key={btn.id} className="relative group">
            <button
              id={btn.id}
              onClick={btn.action}
              aria-label={btn.label}
              className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-lg cursor-pointer transition-all duration-300 transform group-hover:scale-110 group-active:scale-95 ${btn.color} ${
                btn.glow ? 'ring-2 ring-amber-400/30' : ''
              }`}
            >
              {btn.icon}
            </button>

            {/* Hover Tooltip Label Sliding Out to the Right */}
            <div className="absolute left-14 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 z-50 whitespace-nowrap">
              <div className="py-1.5 px-3 rounded-xl bg-[#0c160f]/95 backdrop-blur-md border border-[#2b4b32] text-white shadow-xl shadow-black/80 flex flex-col">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 font-syne">
                  {btn.label}
                </span>
                <span className="text-[10px] text-stone-300">{btn.sub}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Dedicated Back to Top Button with scroll percentage */}
        {isScrolled && (
          <div className="relative group pt-1 border-t border-[#1c3021]">
            <button
              id="left-btn-scroll-top"
              onClick={scrollToTop}
              aria-label="Back to Top Menu"
              className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#182a1d] to-[#0c160f] hover:from-[#213a28] hover:to-[#122016] border border-amber-500/50 text-amber-400 flex flex-col items-center justify-center shadow-lg transition-all duration-300 transform group-hover:scale-110 cursor-pointer animate-in fade-in slide-in-from-bottom-2"
            >
              <ArrowUp className="w-4 h-4 text-amber-400 animate-bounce" />
              <span className="text-[9px] font-mono font-bold text-stone-300">
                {scrollProgress}%
              </span>
            </button>

            {/* Tooltip */}
            <div className="absolute left-14 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 z-50 whitespace-nowrap">
              <div className="py-1.5 px-3 rounded-xl bg-[#0c160f]/95 border border-amber-500/40 text-white shadow-xl flex flex-col">
                <span className="text-xs font-black uppercase text-amber-400 font-syne">
                  Back to Top Menu
                </span>
                <span className="text-[10px] text-stone-400">Jump right to header</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile: Left Quick Buttons Toggle & Pill */}
      <div className="fixed left-3 bottom-20 z-40 md:hidden">
        {mobileExpanded ? (
          <div className="p-3 rounded-2xl bg-[#09120c]/95 backdrop-blur-xl border border-[#27462e] shadow-2xl space-y-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-1 border-b border-[#1c3221]">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                Quick Actions
              </span>
              <button
                onClick={() => setMobileExpanded(false)}
                className="text-stone-400 p-1"
                aria-label="Close quick actions"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="flex flex-col gap-2">
              {buttons.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    b.action();
                    setMobileExpanded(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border shadow-md ${b.color}`}
                >
                  {b.icon}
                  <span>{b.label}</span>
                </button>
              ))}

              {isScrolled && (
                <button
                  onClick={() => {
                    scrollToTop();
                    setMobileExpanded(false);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between bg-[#15241a] text-amber-300 border border-amber-500/40"
                >
                  <span className="flex items-center gap-1.5">
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>Back to Top Menu</span>
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">{scrollProgress}%</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setMobileExpanded(true)}
            aria-label="Open Left Action Buttons"
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#0e1911]/95 text-amber-400 border border-[#2a4d33] shadow-2xl backdrop-blur-md cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-black uppercase tracking-wider text-white">Menu & Actions</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </button>
        )}
      </div>
    </>
  );
};
