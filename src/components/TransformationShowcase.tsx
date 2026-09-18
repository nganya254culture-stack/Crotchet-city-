import React, { useState } from 'react';
import { Sparkles, Shield, CheckCircle2, Clock, User, ArrowRight, Eye, RefreshCw, Scissors } from 'lucide-react';
import { TRANSFORMATIONS } from '../data/crochetData';
import { BackToTopBar } from './BackToTopBar';
import { SectionBackToIndex } from './SectionBackToIndex';

interface TransformationShowcaseProps {
  onBookService: (serviceName?: string) => void;
}

export const TransformationShowcase: React.FC<TransformationShowcaseProps> = ({ onBookService }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage for before/after view
  const currentItem = TRANSFORMATIONS[activeIdx];

  return (
    <section id="transformations-section" className="py-16 sm:py-20 bg-[#090d0a]/75 backdrop-blur-[2px] relative border-t border-b border-[#1b271f]/80">
      {/* Subtle Rasta Accent background gradient */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-gradient-to-r from-emerald-950 via-transparent to-red-950" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Back to Index Navigation Breadcrumb Bar */}
        <SectionBackToIndex sectionTitle="Neat Locs Transformations" categoryBadge="Before & After" />

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            The Neat & Clean Standard
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-cinzel">
            Proof in Every Needle Stitch
          </h2>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
            We don’t hide messy flyaways with glue or sticky wax that wears off in three days. 
            See how <span className="text-amber-400 font-semibold">P The dread genius</span> and our locticians turn overgrown fuzz, lint build-up, and thinning roots into architectural dreadlock perfection.
          </p>
        </div>

        {/* Transformation Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {TRANSFORMATIONS.map((item, index) => (
            <button
              key={item.id}
              id={`trans-tab-${index}`}
              onClick={() => {
                setActiveIdx(index);
                setSliderPosition(50);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeIdx === index
                  ? 'bg-gradient-to-r from-[#14532d] to-[#15803d] text-white border border-emerald-500/50 shadow-md shadow-emerald-950/50'
                  : 'bg-[#121a14] text-stone-400 hover:text-stone-200 border border-[#1e2a20] hover:bg-[#18231b]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeIdx === index ? 'bg-amber-400' : 'bg-stone-600'}`} />
              <span className="truncate max-w-[200px] sm:max-w-none">{item.title}</span>
            </button>
          ))}
        </div>

        {/* Main Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0e1410] p-4 sm:p-8 rounded-3xl border border-[#213024] shadow-2xl">
          {/* Left Column: Interactive Before/After Visualizer */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3] sm:aspect-[16/10] select-none border border-[#26372a]">
              {/* After Image (Full background) */}
              <img
                src={currentItem.afterImg}
                alt="After neat dreadlocks"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              
              {/* After Label */}
              <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-lg bg-emerald-950/90 text-emerald-300 border border-emerald-700/60 text-xs font-extrabold uppercase tracking-wider backdrop-blur-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>After: Crochet City Neat</span>
              </div>

              {/* Before Image (Clipped by slider position) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={currentItem.beforeImg}
                  alt="Before messy dreadlocks"
                  className="absolute inset-0 w-full h-full object-cover object-center max-w-none"
                  style={{ width: '100%', height: '100%' }}
                />
                {/* Before Label */}
                <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-black/80 text-stone-300 border border-stone-700 text-xs font-extrabold uppercase tracking-wider backdrop-blur-sm">
                  <span>Before: Fuzz & Residue</span>
                </div>
              </div>

              {/* Slider Divider Line */}
              <div
                className="absolute top-0 bottom-0 z-30 w-1 bg-amber-400 cursor-ew-resize shadow-lg flex items-center justify-center"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-8 h-8 -ml-3.5 rounded-full bg-amber-400 text-stone-950 font-bold flex items-center justify-center shadow-md shadow-black/50 text-[10px]">
                  ⟷
                </div>
              </div>

              {/* Slider Range Input (Overlay) */}
              <input
                id="transformation-slider-range"
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
                aria-label="Before and after dreadlock comparison slider"
              />

              {/* Bottom hint banner */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-4 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] text-stone-300 border border-stone-800 flex items-center gap-1.5 pointer-events-none">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Drag left / right to reveal the neatness difference</span>
              </div>
            </div>

            {/* Quick Slider Position Buttons */}
            <div className="flex items-center justify-between mt-3 text-xs text-stone-400">
              <button 
                id="show-before-btn"
                onClick={() => setSliderPosition(100)} 
                className="hover:text-amber-300 cursor-pointer font-medium"
              >
                View 100% Before
              </button>
              <button 
                id="show-split-btn"
                onClick={() => setSliderPosition(50)} 
                className="hover:text-amber-300 cursor-pointer font-medium"
              >
                50/50 Split View
              </button>
              <button 
                id="show-after-btn"
                onClick={() => setSliderPosition(0)} 
                className="hover:text-amber-300 cursor-pointer font-medium"
              >
                View 100% After
              </button>
            </div>
          </div>

          {/* Right Column: Transformation Narrative & Credentials */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-amber-400">
                Case Study #{activeIdx + 1}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1 font-syne">
                {currentItem.title}
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Client: <span className="text-stone-200">{currentItem.clientName}</span>
              </p>
            </div>

            {/* Before vs After Breakdown */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#141c15] border border-red-950/40">
                <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  The Problem (Before)
                </div>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                  {currentItem.beforeDescription}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#122016] border border-emerald-900/50">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  The Crochet City Solution (After)
                </div>
                <p className="text-xs text-stone-200 mt-1 leading-relaxed font-medium">
                  {currentItem.afterDescription}
                </p>
              </div>
            </div>

            {/* Neatness Key Factors */}
            <div>
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-stone-400 mb-2">
                Neatness Guarantee Highlights:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentItem.neatnessKeyFactors.map((factor, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2 text-xs text-stone-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Service details & Artisan credit */}
            <div className="pt-3 border-t border-[#1e2c21] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-stone-400">Stylist:</span>
                <span className="text-white font-bold">{currentItem.loctician}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-stone-400">Time:</span>
                <span className="text-white font-bold">{currentItem.duration}</span>
              </div>
            </div>

            {/* Action CTA - Smaller & Neat */}
            <button
              id={`book-this-transformation-${activeIdx}`}
              onClick={() => onBookService(currentItem.service)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-700 hover:from-emerald-600 hover:to-green-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/50 cursor-pointer active:scale-95"
            >
              <Scissors className="w-3.5 h-3.5 text-amber-300" />
              <span>Book Transformation ({currentItem.service})</span>
            </button>
          </div>
        </div>

        {/* Back to top navigation */}
        <BackToTopBar currentSectionName="Neat Locs Transformations" />
      </div>
    </section>
  );
};
