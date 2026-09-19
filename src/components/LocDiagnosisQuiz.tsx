import React, { useState } from 'react';
import { Sparkles, Scissors, CheckCircle, Clock, ShieldCheck, ArrowRight, Zap, RefreshCw, MessageSquare } from 'lucide-react';
import { SERVICES, EMPLOYEES, STUDIO_INFO } from '../data/crochetData';
import { SectionBackToIndex } from './SectionBackToIndex';
import { BackToTopBar } from './BackToTopBar';

interface LocDiagnosisQuizProps {
  onBookService: (serviceId: string, locticianId?: string) => void;
}

export const LocDiagnosisQuiz: React.FC<LocDiagnosisQuizProps> = ({ onBookService }) => {
  const [crownCondition, setCrownCondition] = useState<string>('overdue-retwist');
  const [hairLength, setHairLength] = useState<string>('shoulder');
  const [mainGoal, setMainGoal] = useState<string>('razor-neat');

  // Compute diagnosis dynamically
  const getPrescription = () => {
    if (crownCondition === 'starting-fresh') {
      const srv = SERVICES.find((s) => s.id === 'srv-starter-locs') || SERVICES[1];
      const loctician = EMPLOYEES.find((e) => e.id === 'emp-p-genius') || EMPLOYEES[0];
      return {
        service: srv,
        loctician,
        diagnosisTitle: 'Instant Needle Interlocking Starter Locs',
        description: 'Skip months of unraveling baby locs. P and team will crochet micro-cylinders from your loose afro in one single sitting—instantly shower-safe and neat.',
        estimatedTime: hairLength === 'long' ? '4.5 hrs' : '3.5 hrs',
        urgencyNote: 'Zero beeswax guarantee. Never builds white lint.',
      };
    }

    if (crownCondition === 'wax-buildup') {
      const srv = SERVICES.find((s) => s.id === 'srv-acv-detox') || SERVICES[5];
      const loctician = EMPLOYEES.find((e) => e.id === 'emp-zahra') || EMPLOYEES[4];
      return {
        service: srv,
        loctician,
        diagnosisTitle: 'Organic ACV Deep Pore Detox & Needle Reset',
        description: 'Dissolve trapped beeswax, heavy hair butter, and city pollutants. Followed by pure crochet root locking so your locs are 40% lighter and clean to the core.',
        estimatedTime: '2.5 hrs',
        urgencyNote: 'Restores natural bounce and healthy scalp breathing.',
      };
    }

    if (crownCondition === 'broken-thinning') {
      const srv = SERVICES.find((s) => s.id === 'srv-loc-repair') || SERVICES[2];
      const loctician = EMPLOYEES.find((e) => e.id === 'emp-brian-ochieng') || EMPLOYEES[3];
      return {
        service: srv,
        loctician,
        diagnosisTitle: 'Micro-Loc Surgery & Root Reconstruction',
        description: 'Micro-needle welding to re-anchor hanging or thinning locs back into your scalp grid without cutting or artificial glue.',
        estimatedTime: '3.0 hrs',
        urgencyNote: 'Saves delicate crowns from premature shedding.',
      };
    }

    if (crownCondition === 'sisterlocks') {
      const srv = SERVICES.find((s) => s.id === 'srv-sisterlocks') || SERVICES[4];
      const loctician = EMPLOYEES.find((e) => e.id === 'emp-amina') || EMPLOYEES[2];
      return {
        service: srv,
        loctician,
        diagnosisTitle: 'Microlocs & Sisterlocks 4-Point Retightening',
        description: 'Precision interlock rotation calibrated for high-density micro grid patterns without scalp tension.',
        estimatedTime: '3.5 hrs',
        urgencyNote: 'Ultra-refined tension distribution.',
      };
    }

    // Default: Razor neat crochet retwist
    const srv = SERVICES.find((s) => s.id === 'srv-needle-retwist') || SERVICES[0];
    const loctician = EMPLOYEES.find((e) => e.id === 'emp-p-genius') || EMPLOYEES[0];
    return {
      service: srv,
      loctician,
      diagnosisTitle: 'Master Needle Crochet Retwist & Parting Sculpting',
      description: 'Signature Crochet City technique. Re-knits new growth securely into the loc cylinder using 0.5mm needles. Stays neat for up to 10 weeks.',
      estimatedTime: hairLength === 'long' ? '2.5 hrs' : '1.5 hrs',
      urgencyNote: 'Leaves your crown feather-light and 100% wax-free.',
    };
  };

  const prescription = getPrescription();

  return (
    <section className="py-8 sm:py-14 bg-transparent relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-gradient-to-r from-emerald-600/10 via-amber-500/10 to-red-600/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Back to Index Navigation Breadcrumb Bar */}
        <SectionBackToIndex sectionTitle="Loc Doctor Quiz & Pricing" categoryBadge="Interactive Diagnosis" />

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            Instant Hair Doctor & Quote Matcher
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-cinzel">
            What Does Your Crown Need?
          </h2>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
            Select your loc status below. Our interactive diagnostic engine calculates your exact loctician match, chair duration, and pricing in seconds.
          </p>
        </div>

        {/* Diagnostic interactive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls / Inputs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Crown Condition */}
            <div className="p-5 rounded-2xl bg-[#101712] border border-[#213426] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  Step 1: Current Crown State
                </span>
                <span className="text-[10px] text-stone-400">Select one</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'overdue-retwist', label: 'Fuzzy / Overdue Retwist', sub: 'Roots overgrown & frizzy' },
                  { id: 'starting-fresh', label: 'Starting Fresh from Afro', sub: 'Need instant starter locs' },
                  { id: 'broken-thinning', label: 'Thinning / Broken Locs', sub: 'Requires loc surgery' },
                  { id: 'wax-buildup', label: 'Wax & Heavy Product Buildup', sub: 'Needs ACV deep detox' },
                  { id: 'sisterlocks', label: 'Sisterlocks / Microlocs', sub: 'High-density grid retightening' },
                ].map((item) => (
                  <button
                    key={item.id}
                    id={`quiz-cond-${item.id}`}
                    onClick={() => setCrownCondition(item.id)}
                    className={`p-3 rounded-xl text-left transition-all border cursor-pointer ${
                      crownCondition === item.id
                        ? 'bg-emerald-950/70 border-emerald-400 text-white shadow-md shadow-emerald-950/50'
                        : 'bg-[#121c15] border-[#1d2d21] text-stone-300 hover:border-[#2b4431]'
                    }`}
                  >
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>{item.label}</span>
                      {crownCondition === item.id && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <span className="text-[11px] text-stone-400 mt-0.5 block">{item.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Loc Length */}
            <div className="p-5 rounded-2xl bg-[#101712] border border-[#213426] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  Step 2: Hair Length
                </span>
                <span className="text-[10px] text-stone-400">Affects chair duration</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'short', label: 'Short / Neck Length' },
                  { id: 'shoulder', label: 'Shoulder Length' },
                  { id: 'long', label: 'Mid-Back or Waist' },
                ].map((len) => (
                  <button
                    key={len.id}
                    id={`quiz-len-${len.id}`}
                    onClick={() => setHairLength(len.id)}
                    className={`p-3 rounded-xl text-center text-xs font-bold transition-all border cursor-pointer ${
                      hairLength === len.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                        : 'bg-[#121c15] border-[#1d2d21] text-stone-300 hover:border-[#2b4431]'
                    }`}
                  >
                    {len.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Instant Diagnosis Prescription Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl p-6 bg-gradient-to-b from-[#111d14] to-[#0c130e] border border-amber-500/40 shadow-2xl space-y-5 relative overflow-hidden">
              {/* Rasta ribbon */}
              <div className="absolute top-0 right-0 w-32 h-1.5 rasta-gradient-bar" />

              <div className="flex items-center justify-between border-b border-[#213526] pb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Your Custom Recommendation
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold border border-amber-500/40">
                  Verified Match
                </span>
              </div>

              {/* Title & Service Details */}
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-white font-cinzel">
                  {prescription.diagnosisTitle}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  {prescription.description}
                </p>
              </div>

              {/* Pricing & Time specs */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#09100b] border border-[#1b2b1d]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">
                    Investment
                  </span>
                  <div className="text-lg font-black text-amber-400 font-syne">
                    KSh {prescription.service.priceKsh.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-stone-400">
                    ≈ ${prescription.service.priceUsd} USD
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">
                    Est. Chair Time
                  </span>
                  <div className="text-lg font-black text-emerald-400 font-syne flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{prescription.estimatedTime}</span>
                  </div>
                  <span className="text-[10px] text-stone-400">
                    Pain-free micro-needle
                  </span>
                </div>
              </div>

              {/* Matched Loctician Box */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#132017] border border-[#233827]">
                <img
                  src={prescription.loctician.avatar}
                  alt={prescription.loctician.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-400"
                />
                <div>
                  <p className="text-[10px] uppercase font-bold text-amber-400">
                    Recommended Artisan
                  </p>
                  <h4 className="text-xs font-black text-white font-syne">
                    {prescription.loctician.name}
                  </h4>
                  <p className="text-[11px] text-stone-400">
                    {prescription.loctician.role}
                  </p>
                </div>
              </div>

              {/* Action: 1-Click Book Prescription - Compact & Neat */}
              <div className="space-y-2 pt-1">
                <button
                  id="book-quiz-prescription-btn"
                  onClick={() => onBookService(prescription.service.id, prescription.loctician.id)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-yellow-400 text-stone-950 text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95 rasta-btn-glow"
                >
                  <Scissors className="w-3.5 h-3.5 text-stone-950" />
                  <span>Book This Prescription</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <a
                  id="quiz-whatsapp-share-btn"
                  href={`https://wa.me/${STUDIO_INFO.whatsapp}?text=${encodeURIComponent(
                    `Jambo P! I just used the Crochet City diagnostic quiz. My diagnosis is: ${prescription.diagnosisTitle} (est. KSh ${prescription.service.priceKsh}). Can I send photos of my hair to confirm?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer rasta-btn-glow"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send Diagnosis to WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Return to Index Footer Bar */}
        <BackToTopBar currentSectionName="Loc Doctor Quiz & Hair Engine" />
      </div>
    </section>
  );
};
