import React, { useState, useEffect } from 'react';
import { Calendar, ShieldCheck, Award, Sparkles, CheckCircle, ArrowRight, Star, Heart, Clock, Scissors, CreditCard, Camera } from 'lucide-react';
import { STUDIO_INFO } from '../data/crochetData';
import { getEffectivePhoto, loadAllPhotoOverridesAsync } from '../data/mediaGallery';
import { ReplacePhotoModal } from './ReplacePhotoModal';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenMpesa: () => void;
  onExploreServices: () => void;
  onOpenDiagnosis?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onOpenMpesa, onExploreServices, onOpenDiagnosis }) => {
  const [, setRefresh] = useState(0);
  const [replaceModal, setReplaceModal] = useState<{
    isOpen: boolean;
    photoKey: string;
    currentPhotoUrl: string;
    originalDefaultUrl?: string;
    photoTitle?: string;
  }>({
    isOpen: false,
    photoKey: '',
    currentPhotoUrl: '',
  });

  useEffect(() => {
    loadAllPhotoOverridesAsync().then(() => setRefresh(v => v + 1));
    const handlePhotoReplaced = () => setRefresh(v => v + 1);
    window.addEventListener('crochet-photo-replaced', handlePhotoReplaced);
    return () => window.removeEventListener('crochet-photo-replaced', handlePhotoReplaced);
  }, []);

  const defaultFounderAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80';
  const defaultHeroShowcase = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=700&q=80';

  const effectiveFounderAvatar = getEffectivePhoto(defaultFounderAvatar, 'hero-founder-avatar');
  const effectiveHeroShowcase = getEffectivePhoto(defaultHeroShowcase, 'hero-showcase-photo');

  const handleOpenReplace = (photoKey: string, currentUrl: string, originalUrl?: string, title?: string) => {
    setReplaceModal({
      isOpen: true,
      photoKey,
      currentPhotoUrl: currentUrl,
      originalDefaultUrl: originalUrl || currentUrl,
      photoTitle: title || 'Hero Photo',
    });
  };
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background Decorative Atmosphere with Rasta-inspired subtle lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-25">
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-[#15803d] blur-[120px]" />
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-[#b45309] blur-[130px]" />
        <div className="absolute top-40 left-1/3 w-80 h-80 rounded-full bg-[#991b1b] blur-[140px]" />
      </div>

      {/* Geometric background grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #f59e0b 1px, transparent 0)`,
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-7">
            {/* Top Pill - Owner Credential & Craft */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#141e17] border border-[#233527] shadow-inner">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs uppercase tracking-wider font-bold text-stone-300">
                Crafted by <span className="text-amber-400 font-extrabold">{STUDIO_INFO.owner}</span>
              </span>
              <span className="text-stone-600">|</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Nairobi’s Neatest Locs
              </span>
            </div>

            {/* Main Headline - Website Name & Royal Tagline */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/70 border border-amber-500/50 backdrop-blur-md shadow-lg">
                <Scissors className="w-3.5 h-3.5 text-amber-400 -rotate-45" />
                <span className="text-[11px] sm:text-xs font-black tracking-widest text-amber-300 uppercase font-syne">
                  Flagship Dreadlock Studio • Nairobi, Kenya
                </span>
              </div>
              
              <h1 
                id="main-site-header"
                className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] font-cinzel drop-shadow-2xl"
              >
                <span className="block text-amber-400 drop-shadow-[0_4px_28px_rgba(245,158,11,0.45)]">
                  CROCHET CITY
                </span>
                <span className="block text-xl sm:text-3xl lg:text-4xl font-extrabold text-stone-100 mt-2 font-cinzel tracking-normal">
                  Where Dreadlocks Become <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-red-400">
                    Neat, Clean & Royal.
                  </span>
                </span>
              </h1>
            </div>

            {/* Sub-paragraph emphasizing user intent: clean, neat, authentic, professional */}
            <p className="text-base sm:text-lg text-stone-300 max-w-2xl leading-relaxed font-light">
              Say goodbye to sticky wax, heavy lint traps, and painful pulling. At{' '}
              <strong className="text-white font-semibold">Crochet City</strong>,{' '}
              <span className="text-amber-300 font-semibold">{STUDIO_INFO.owner}</span> and our elite loctician crew use
              precision micro-needle interlocking to forge tight, feather-light dreadlocks that stay immaculate through workouts, showers, and months of growth.
            </p>

            {/* Value Checkpoints */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#111913] border border-[#1d2c20]">
                <div className="w-6 h-6 rounded-full bg-emerald-950 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium text-stone-200">100% Wax-Free Needle Craft</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#111913] border border-[#1d2c20]">
                <div className="w-6 h-6 rounded-full bg-amber-950 flex items-center justify-center text-amber-400 shrink-0">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium text-stone-200">Zero-Mess Grid Parting</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#111913] border border-[#1d2c20]">
                <div className="w-6 h-6 rounded-full bg-red-950 flex items-center justify-center text-red-400 shrink-0">
                  <CreditCard className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium text-stone-200">Instant M-Pesa STK Push</span>
              </div>
            </div>

            {/* CTAs - Clean, balanced, smaller sizing */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
              <button
                id="hero-book-appointment-btn"
                onClick={onOpenBooking}
                className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 flex items-center gap-2 cursor-pointer active:scale-95 rasta-btn-glow"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Chair with P</span>
              </button>

              <button
                id="hero-mpesa-pay-btn"
                onClick={onOpenMpesa}
                className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-[#008751]/20 hover:bg-[#008751]/30 border border-[#008751]/60 text-emerald-300 hover:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-emerald-950/40 active:scale-95 rasta-btn-glow"
              >
                <div className="w-4 h-4 rounded-full bg-[#008751] flex items-center justify-center text-[10px] font-black text-white">
                  M
                </div>
                <span>Pay M-Pesa (Till {STUDIO_INFO.mpesaTill})</span>
              </button>

              {onOpenDiagnosis && (
                <button
                  id="hero-quiz-trigger-btn"
                  onClick={onOpenDiagnosis}
                  className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-[#19271e] hover:bg-[#223629] border border-[#2b4434] text-amber-300 hover:text-amber-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 rasta-btn-glow"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Loc Doctor Quiz</span>
                </button>
              )}

              <button
                id="hero-view-services-btn"
                onClick={onExploreServices}
                className="px-3 py-2.5 text-stone-300 hover:text-amber-400 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer rasta-btn-glow rounded-lg hover:bg-stone-900/50"
              >
                <span>Full Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Customer Rating Proof */}
            <div className="pt-2 flex items-center gap-4 border-t border-[#1a261d]">
              <div className="flex -space-x-2">
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-[#0b0f0c] object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Client 1"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-[#0b0f0c] object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Client 2"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-[#0b0f0c] object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                  alt="Client 3"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-[#0b0f0c] object-cover"
                  src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80"
                  alt="Client 4"
                />
              </div>
              <div className="text-xs">
                <div className="flex items-center text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <span className="font-extrabold text-white ml-1.5">4.98 / 5.0</span>
                </div>
                <p className="text-stone-400 text-[11px]">
                  Over <strong className="text-stone-200">9,400+ satisfied clients</strong> across Nairobi & East Africa
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase Card with Owner Spotlight */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Glow Card with Rasta border accent */}
              <div className="rounded-3xl p-1 bg-gradient-to-b from-[#1b2b1f] via-[#2a2414] to-[#261515] border border-[#2d3e30] shadow-2xl overflow-hidden">
                <div className="bg-[#0f1611] rounded-[22px] overflow-hidden p-6 relative">
                  {/* Decorative Rasta ribbon in corner */}
                  <div className="absolute top-0 right-0 w-32 h-1.5 rasta-gradient-bar" />

                  {/* Owner Header Badge */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#1c291f]">
                    <div className="flex items-center gap-3">
                      <div className="relative group/founder">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-md overflow-hidden">
                          <img
                            src={effectiveFounderAvatar}
                            alt="P The dread genius"
                            className="w-full h-full object-cover rounded-[10px]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenReplace('hero-founder-avatar', effectiveFounderAvatar, defaultFounderAvatar, `${STUDIO_INFO.owner} (Hero Avatar)`)}
                          className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-black/90 hover:bg-amber-500 text-amber-300 hover:text-stone-950 border border-amber-500/50 flex items-center justify-center shadow transition-all cursor-pointer"
                          title="Replace founder avatar photo"
                        >
                          <Camera className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h2 className="text-sm font-extrabold text-white font-syne uppercase">
                            {STUDIO_INFO.owner}
                          </h2>
                          <Award className="w-4 h-4 text-amber-400" />
                        </div>
                        <p className="text-[11px] text-emerald-400 font-semibold">
                          Founder & Master Loctician
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        14 Yrs Pro
                      </span>
                    </div>
                  </div>

                  {/* Visual Portrait / Work Showcase */}
                  <div className="mt-4 relative rounded-xl overflow-hidden group">
                    <img
                      src={effectiveHeroShowcase}
                      alt="Neat Dreadlocks at Crochet City"
                      className="w-full h-60 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Quick Replace Photo button */}
                    <button
                      type="button"
                      onClick={() => handleOpenReplace('hero-showcase-photo', effectiveHeroShowcase, defaultHeroShowcase, 'Hero Showcase Photo')}
                      className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 hover:bg-amber-500 hover:text-stone-950 text-amber-300 border border-amber-500/50 text-[11px] font-bold transition-all flex items-center gap-1 shadow-lg cursor-pointer backdrop-blur-sm z-10"
                      title="Replace this hero photo"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Replace Photo</span>
                    </button>

                    {/* Floating neatness guarantee pill */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-[#0b100d]/90 backdrop-blur-md p-3 rounded-lg border border-[#213024]">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">Standard of Excellence</p>
                        <p className="text-xs font-bold text-white">Razor-Neat Parting & Pure Cylinder Locs</p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        0% Wax
                      </span>
                    </div>
                  </div>

                  {/* Owner quote */}
                  <div className="mt-4 p-3.5 rounded-xl bg-[#141e17] border border-[#213225]">
                    <p className="text-xs text-stone-300 italic leading-relaxed">
                      &quot;A neat dreadlock is not created with sticky beeswax or heavy gel that rots the core. It is engineered stitch-by-stitch with the needle. When your roots are sculpted clean, you walk with royal pride.&quot;
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-stone-400">
                      <span className="text-amber-400 font-medium">— P The dread genius</span>
                      <span className="text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle className="w-3 h-3" /> Certified Technique
                      </span>
                    </div>
                  </div>

                  {/* Interactive Quick Stats */}
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center pt-2">
                    <div className="p-2 rounded-lg bg-[#111913] border border-[#1b261d]">
                      <div className="text-base font-extrabold text-emerald-400">8,500+</div>
                      <div className="text-[10px] text-stone-400 uppercase font-medium">Clean Crowns</div>
                    </div>
                    <div className="p-2 rounded-lg bg-[#111913] border border-[#1b261d]">
                      <div className="text-base font-extrabold text-amber-400">0% Wax</div>
                      <div className="text-[10px] text-stone-400 uppercase font-medium">Lint-Free</div>
                    </div>
                    <div className="p-2 rounded-lg bg-[#111913] border border-[#1b261d]">
                      <div className="text-base font-extrabold text-red-400">6 Staff</div>
                      <div className="text-[10px] text-stone-400 uppercase font-medium">Artisan Team</div>
                    </div>
                  </div>

                  {/* Instant booking prompt */}
                  <button
                    id="hero-quick-seat-btn"
                    onClick={onOpenBooking}
                    className="w-full mt-4 py-3 rounded-lg bg-[#19261d] hover:bg-[#203126] border border-[#2b4131] text-amber-300 hover:text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors rasta-btn-glow"
                  >
                    <Scissors className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reserve Chair With P or His Artisans</span>
                  </button>
                </div>
              </div>

              {/* Floating M-Pesa prompt badge */}
              <div 
                id="floating-mpesa-badge"
                onClick={onOpenMpesa}
                className="absolute -bottom-5 -left-4 sm:-left-6 p-3 rounded-xl bg-[#0e1611] border border-[#008751]/60 shadow-xl cursor-pointer hover:scale-105 transition-transform flex items-center gap-3 z-10 rasta-btn-glow"
              >
                <div className="w-9 h-9 rounded-lg bg-[#008751] flex items-center justify-center text-white font-black text-sm shadow-md">
                  M
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-white">Safaricom M-Pesa</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                      Active
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-400">
                    Till: <strong className="text-amber-400">{STUDIO_INFO.mpesaTill}</strong> • Instant STK Push
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Photo Replacement Modal */}
      <ReplacePhotoModal
        isOpen={replaceModal.isOpen}
        onClose={() => setReplaceModal(prev => ({ ...prev, isOpen: false }))}
        photoKey={replaceModal.photoKey}
        currentPhotoUrl={replaceModal.currentPhotoUrl}
        originalDefaultUrl={replaceModal.originalDefaultUrl}
        photoTitle={replaceModal.photoTitle}
        onPhotoReplaced={() => setRefresh(v => v + 1)}
      />
    </section>
  );
};
