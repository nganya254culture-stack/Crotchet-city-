import React from 'react';
import { ShieldAlert, Moon, Droplets, Sparkles, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { CARE_RULES, STUDIO_INFO } from '../data/crochetData';
import { SectionBackToIndex } from './SectionBackToIndex';
import { BackToTopBar } from './BackToTopBar';

export const CareGuide: React.FC = () => {
  return (
    <section className="py-8 sm:py-14 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Index Navigation Breadcrumb Bar */}
        <SectionBackToIndex sectionTitle="The Neat Locs Care Guide" categoryBadge="Philosophy & Maintenance" />

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Loctician Wisdom & Philosophy
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-cinzel">
            The Neat Locs Manifesto
          </h2>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
            How <span className="text-amber-400 font-semibold">{STUDIO_INFO.owner}</span> keeps clients&apos; dreadlocks looking razor-neat, lightweight, and clean for months without synthetic shortcuts.
          </p>
        </div>

        {/* 5 Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CARE_RULES.map((rule, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#0f1712] border border-[#1f2d22] p-6 space-y-4 hover:border-emerald-500/40 transition-colors flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-amber-400 font-cinzel">
                    {rule.number}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-white font-syne mt-3 group-hover:text-amber-300 transition-colors">
                  {rule.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed font-light">
                  {rule.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1c281f] text-[11px] text-stone-400 flex items-center justify-between">
                <span>Crochet City Rule</span>
                <span className="text-emerald-400 font-medium">Approved by P</span>
              </div>
            </div>
          ))}

          {/* 6th Card: The Dread Genius Guarantee */}
          <div className="rounded-2xl bg-gradient-to-br from-[#132b1d] via-[#1a2414] to-[#2b1616] border border-amber-500/40 p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black">
                P
              </div>
              <h3 className="text-lg font-extrabold text-white font-syne mt-3">
                &quot;The Crown Never Slumps&quot;
              </h3>
              <p className="text-xs text-stone-200 mt-2 leading-relaxed italic">
                &quot;When we crochet your hair, you leave with our name on your crown. If any loc unravels within 14 days of your appointment, walk back in—we re-crochet it free of charge with full hospitality.&quot;
              </p>
            </div>

            <div className="pt-3 border-t border-amber-500/20 text-xs font-bold text-amber-300">
              — P The dread genius
            </div>
          </div>
        </div>

        {/* Back to Index Footer Bar */}
        <BackToTopBar currentSectionName="The Neat Locs Care Guide" />
      </div>
    </section>
  );
};
