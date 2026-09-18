import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Phone, 
  Calendar, 
  Menu, 
  X, 
  ShieldCheck, 
  CreditCard, 
  ChevronRight, 
  Scissors, 
  MoreVertical,
  ArrowUp,
  MessageSquare
} from 'lucide-react';
import { STUDIO_INFO } from '../data/crochetData';

interface NavbarProps {
  onOpenBooking: (serviceId?: string, locticianId?: string) => void;
  onOpenMpesa: (amount?: number, purpose?: string) => void;
  onOpenReviews: () => void;
  onOpenWhatsAppPopup?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenBooking, 
  onOpenMpesa, 
  onOpenReviews,
  onOpenWhatsAppPopup
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f0c]/90 backdrop-blur-md border-b border-[#1f2c23]">
      {/* Dynamic Scroll Progress Bar - High Visibility */}
      <div 
        className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500 transition-all duration-150 origin-left"
        style={{ width: `${Math.max(3, scrollProgress)}%` }}
        title={`Page scrolled: ${Math.round(scrollProgress)}%`}
      />

      {/* Top Announcement Bar */}
      <div className="bg-[#121a14]/90 py-1.5 px-4 text-xs border-b border-[#1b271f] hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[#d1d5db]">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#16a34a]/20 text-[#22c55e] border border-[#16a34a]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse mr-1.5"></span>
              STUDIO OPEN TODAY
            </span>
            <span className="text-stone-400">Westlands Sound Plaza • Led by {STUDIO_INFO.owner}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-amber-400/90 flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3 text-amber-400" />
              100% Wax-Free Organic Needle Crochet
            </span>
            <button 
              id="top-bar-mpesa-btn"
              onClick={() => onOpenMpesa(500, 'Crochet City Booking Deposit')}
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <CreditCard className="w-3 h-3" />
              M-Pesa Till: {STUDIO_INFO.mpesaTill}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between min-h-[4.75rem] sm:min-h-[5.5rem] py-2 gap-2">
          {/* Brand Logo Lockup: Emblem with 2-Dots Button Below, Large Title with Subtext Below */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Left Column: Emblem & 2-Dots Button directly beneath it */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div 
                id="brand-logo-btn"
                onClick={scrollToTop}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#166534] via-[#854d0e] to-[#991b1b] p-0.5 shadow-lg shadow-emerald-950/40 cursor-pointer group hover:scale-105 transition-transform"
                title="Go to Index (Top)"
              >
                <div className="w-full h-full bg-[#0b0f0c] rounded-[10px] flex items-center justify-center relative overflow-hidden group-hover:bg-[#121914] transition-colors">
                  <Scissors className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 transform -rotate-45 group-hover:scale-110 transition-transform" />
                  <div className="absolute -bottom-1 w-full h-1 bg-gradient-to-r from-green-500 via-amber-400 to-red-500" />
                </div>
              </div>

              {/* 2-DOTS MENU TRIGGER (NO TEXT, JUST 2 PROMINENT GOLD DOTS) DIRECTLY BELOW EMBLEM */}
              <button
                id="two-dots-menu-trigger"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Open studio menu"
                className={`w-8 sm:w-9 py-1 rounded-md border transition-all flex flex-col items-center justify-center gap-0.5 sm:gap-1 cursor-pointer shadow-sm group ${
                  menuOpen
                    ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-amber-500/40 ring-1 ring-amber-400/50'
                    : 'bg-[#15271b] hover:bg-[#1e3827] border-amber-500/40 hover:border-amber-400'
                }`}
                title="Open Studio Menu"
              >
                <span className={`w-1.5 h-1.5 rounded-full transition-all ${menuOpen ? 'bg-stone-950' : 'bg-amber-400 group-hover:scale-125'}`} />
                <span className={`w-1.5 h-1.5 rounded-full transition-all ${menuOpen ? 'bg-stone-950' : 'bg-amber-400 group-hover:scale-125'}`} />
              </button>
            </div>

            {/* Right Column: Prominent Site Name with descriptive words placed below */}
            <div className="flex flex-col justify-center min-w-0">
              <div 
                onClick={scrollToTop}
                className="cursor-pointer group inline-block"
                title="Return to Index"
              >
                <span className="text-xl sm:text-2xl lg:text-[32px] font-black tracking-tight text-white font-syne uppercase leading-none drop-shadow-sm group-hover:text-amber-300 transition-colors truncate block">
                  Crochet<span className="text-amber-400">City</span>
                </span>
              </div>
              {/* Descriptive words positioned below */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
                <span className="text-[9px] sm:text-[11px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-950/90 text-emerald-400 border border-emerald-700/50 shadow-sm whitespace-nowrap">
                  Dreadlocks Studio
                </span>
                <span className="text-[10px] sm:text-xs text-stone-300 font-medium truncate">
                  By <span className="text-amber-300 font-bold">{STUDIO_INFO.owner}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5">
            <button 
              id="nav-link-services"
              onClick={() => scrollToSection('services-section')}
              className="text-sm font-medium text-stone-300 hover:text-amber-400 transition-colors cursor-pointer"
            >
              Services & Pricing
            </button>
            <button 
              id="nav-link-diagnosis"
              onClick={() => scrollToSection('diagnosis-tool')}
              className="text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Loc Doctor Quiz</span>
            </button>
            <button 
              id="nav-link-team"
              onClick={() => scrollToSection('team-section')}
              className="text-sm font-medium text-stone-300 hover:text-amber-400 transition-colors cursor-pointer"
            >
              P The Dread Genius
            </button>
            <button 
              id="nav-link-transformations"
              onClick={() => scrollToSection('transformations-section')}
              className="text-sm font-medium text-stone-300 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
            >
              Neat Proof
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </button>
            <button 
              id="nav-link-reviews"
              onClick={() => scrollToSection('reviews-section')}
              className="text-sm font-medium text-stone-300 hover:text-amber-400 transition-colors cursor-pointer"
            >
              Reviews (4.98★)
            </button>
            <button 
              id="nav-link-location"
              onClick={() => scrollToSection('location-section')}
              className="text-sm font-medium text-stone-300 hover:text-amber-400 transition-colors cursor-pointer"
            >
              Studio & Contact
            </button>
          </nav>

          {/* Action CTAs: Perfectly sized to fit all screens */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* M-Pesa Quick Pay Trigger (shown on tablets & desktop to preserve mobile screen-fit) */}
            <button
              id="navbar-mpesa-trigger"
              onClick={() => onOpenMpesa()}
              className="hidden md:flex px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#008751]/20 hover:bg-[#008751]/30 border border-[#008751]/50 text-emerald-300 hover:text-white text-xs font-bold transition-all items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
              title="Pay with Safaricom M-Pesa"
            >
              <div className="w-3.5 h-3.5 rounded-full bg-[#008751] flex items-center justify-center text-[9px] text-white font-bold">
                M
              </div>
              <span>M-PESA</span>
            </button>

            {/* Book Appointment Button - COMPACT & NEAT */}
            <button
              id="navbar-book-now-btn"
              onClick={() => onOpenBooking()}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-yellow-400 text-stone-950 text-xs font-bold tracking-wide transition-all shadow-sm flex items-center gap-1 cursor-pointer transform active:scale-95 shrink-0"
              title="Book Appointment"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book</span>
            </button>

            {/* Dedicated Visible Menu Button - Easily spotted on mobile & desktop */}
            <button
              id="navbar-menu-toggle-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-bold text-xs shadow-sm active:scale-95 shrink-0 ${
                menuOpen
                  ? 'bg-amber-400 text-stone-950 border-amber-300 ring-2 ring-amber-400/40'
                  : 'bg-[#15271b] hover:bg-[#1e3827] text-amber-300 hover:text-white border-amber-500/60 hover:border-amber-400'
              }`}
              title="Open Studio Menu"
            >
              {menuOpen ? <X className="w-3.5 h-3.5 text-stone-950" /> : <Menu className="w-3.5 h-3.5 text-amber-400" />}
              <span>Menu</span>
            </button>
          </div>
        </div>

        {/* NON-FULLSCREEN COMPACT MENU POPUP - Fixed/Absolute with guaranteed screen-fit */}
        {menuOpen && (
          <>
            {/* Subtle backdrop overlay for outside clicks without hiding the page */}
            <div 
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px]" 
              onClick={() => setMenuOpen(false)} 
            />

            {/* Compact Floating Dropdown Card */}
            <div 
              id="studio-navigation-menu-popup"
              className="fixed sm:absolute top-16 sm:top-[4.8rem] right-2 sm:right-6 md:right-8 w-[calc(100vw-1rem)] sm:w-84 max-h-[82vh] overflow-y-auto rounded-2xl bg-[#0a120c]/98 backdrop-blur-2xl border border-amber-500/40 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3 text-white"
            >
              {/* Header with Close & Studio Info */}
              <div className="flex items-center justify-between pb-2.5 border-b border-[#1c3222]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <p className="text-xs font-black uppercase text-amber-400 tracking-wider">
                      Crochet City Menu
                    </p>
                    <p className="text-[10px] text-stone-400">{STUDIO_INFO.owner} • Westlands</p>
                  </div>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-7 h-7 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Return to Index */}
              <button
                onClick={scrollToTop}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#142318] hover:bg-[#1b3122] text-amber-300 font-semibold text-xs border border-amber-500/30 transition-colors cursor-pointer text-left"
              >
                <span className="flex items-center gap-1.5">
                  <span>🏠</span>
                  <span>Return to Index Page</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
              </button>

              {/* Quick navigation links */}
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => scrollToSection('services-section')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#152319] text-stone-200 hover:text-white transition-colors cursor-pointer text-left"
                >
                  <span className="font-semibold">✂️ Services & Pricing</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                </button>

                <button
                  onClick={() => scrollToSection('diagnosis-tool')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors cursor-pointer text-left border border-amber-500/30"
                >
                  <span className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Loc Doctor Quiz & Pricing
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                </button>

                <button
                  onClick={() => scrollToSection('team-section')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#152319] text-stone-200 hover:text-white transition-colors cursor-pointer text-left"
                >
                  <span className="font-semibold">👑 Meet P The Dread Genius & Staff</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                </button>

                <button
                  onClick={() => scrollToSection('transformations-section')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#152319] text-stone-200 hover:text-white transition-colors cursor-pointer text-left"
                >
                  <span className="font-semibold">📸 Before & After Neat Locs</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                </button>

                <button
                  onClick={() => scrollToSection('reviews-section')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#152319] text-stone-200 hover:text-white transition-colors cursor-pointer text-left"
                >
                  <span className="font-semibold">⭐ Customer Reviews (4.98★)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                </button>

                <button
                  onClick={() => scrollToSection('care-section')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#152319] text-stone-200 hover:text-white transition-colors cursor-pointer text-left"
                >
                  <span className="font-semibold">🌿 100% Wax-Free Care Rules</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                </button>

                <button
                  onClick={() => scrollToSection('location-section')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#152319] text-stone-200 hover:text-white transition-colors cursor-pointer text-left"
                >
                  <span className="font-semibold">📍 Studio Address & Westlands Map</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                </button>
              </div>

              {/* Action buttons inside popup */}
              <div className="pt-2 border-t border-[#1c3222] space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenMpesa();
                    }}
                    className="py-2 px-2.5 rounded-xl bg-[#008751]/20 hover:bg-[#008751]/30 border border-[#008751]/50 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Lipa M-Pesa</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenBooking();
                    }}
                    className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Chair</span>
                  </button>
                </div>

                {onOpenWhatsAppPopup && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenWhatsAppPopup();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Chat with P on WhatsApp</span>
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

