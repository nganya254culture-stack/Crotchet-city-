import React, { useState } from 'react';
import { Sparkles, Clock, CheckCircle2, Scissors, ArrowRight, DollarSign } from 'lucide-react';
import { SERVICES } from '../data/crochetData';
import { ServiceCategory, ServiceItem } from '../types';
import { BackToTopBar } from './BackToTopBar';
import { SectionBackToIndex } from './SectionBackToIndex';

interface ServicesMenuProps {
  onSelectService: (service: ServiceItem) => void;
}

export const ServicesMenu: React.FC<ServicesMenuProps> = ({ onSelectService }) => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  const [currency, setCurrency] = useState<'KSH' | 'USD'>('KSH');

  const filteredServices = activeCategory === 'all'
    ? SERVICES
    : SERVICES.filter((s) => s.category === activeCategory);

  const categories: { id: ServiceCategory; label: string }[] = [
    { id: 'all', label: 'All Services' },
    { id: 'crochet', label: 'Needle Crochet & Retwist' },
    { id: 'starter', label: 'Instant Starter Locs' },
    { id: 'detox', label: 'ACV Detox & Cleanse' },
    { id: 'repair', label: 'Loc Reconstruction' },
    { id: 'extensions', label: 'Loc Extensions' },
    { id: 'styling', label: 'Artistic Styling' },
    { id: 'barber', label: 'Barber Fade & Lineup' },
  ];

  return (
    <section id="services-section" className="py-16 sm:py-24 bg-[#0d130f]/80 backdrop-blur-[2px] relative border-b border-[#182a1d]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Index Navigation Breadcrumb Bar */}
        <SectionBackToIndex sectionTitle="Services & Pricing Menu" categoryBadge="Transparent Rates" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Scissors className="w-3.5 h-3.5 text-amber-400" />
              Transparent Pricing & Pure Craft
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-cinzel">
              Authentic Dreadlock Menu
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
              Every appointment includes a relaxing organic herbal wash, peppermint scalp massage, and pure needle locking. No hidden fees, no damaging chemicals.
            </p>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center self-start md:self-auto p-1 rounded-xl bg-[#141d16] border border-[#233527]">
            <button
              id="currency-toggle-ksh"
              onClick={() => setCurrency('KSH')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currency === 'KSH'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              KSh (Kenya)
            </button>
            <button
              id="currency-toggle-usd"
              onClick={() => setCurrency('USD')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currency === 'USD'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`service-cat-${cat.id}`}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-[#121913] text-stone-300 hover:bg-[#18231a] border border-[#1f2c22]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const formattedPrice =
              currency === 'KSH'
                ? `KSh ${service.priceKsh.toLocaleString()}`
                : `$${service.priceUsd}`;

            return (
              <div
                key={service.id}
                className={`rounded-2xl bg-[#0f1712] border p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group relative overflow-hidden ${
                  service.isPopular
                    ? 'border-amber-500/50 hover:border-amber-400 shadow-lg shadow-amber-950/20'
                    : 'border-[#1e2c21] hover:border-emerald-500/40'
                }`}
              >
                {/* Popular / Tag Ribbon */}
                {service.tag && (
                  <div className="absolute top-4 right-4">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        service.isPopular
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {service.tag}
                    </span>
                  </div>
                )}

                <div>
                  {/* Service Title */}
                  <h3 className="text-lg sm:text-xl font-extrabold text-white font-syne group-hover:text-amber-300 transition-colors pr-16">
                    {service.name}
                  </h3>

                  {/* Duration & Category */}
                  <div className="flex items-center gap-3 mt-2 text-xs text-stone-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {service.duration}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{service.category} craft</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-stone-300 mt-3.5 leading-relaxed font-light">
                    {service.description}
                  </p>

                  {/* Benefits Checklist */}
                  <div className="mt-4 pt-3 border-t border-[#1b261d] space-y-1.5">
                    {service.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-xs text-stone-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Pricing & Booking Trigger */}
                <div className="mt-6 pt-4 border-t border-[#1f2d22] flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                      All-Inclusive Rate
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-amber-400 font-syne">
                      {formattedPrice}
                    </span>
                  </div>

                  <button
                    id={`book-service-${service.id}`}
                    onClick={() => onSelectService(service)}
                    className="px-3.5 py-2 rounded-lg bg-[#19271d] hover:bg-amber-500 hover:text-stone-950 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-[#2b4131] active:scale-95 shadow-sm"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Wax-Free Guarantee Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#122216] via-[#1a1b12] to-[#221313] border border-[#27382b] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-white">
                The Crochet City &quot;No White Residue&quot; Promise
              </h4>
              <p className="text-xs text-stone-300 max-w-xl leading-relaxed mt-0.5">
                If you ever find sticky wax, glue, or synthetic adhesives in our salon, your service is 100% free. We believe in pure natural hair mechanical locking.
              </p>
            </div>
          </div>
          <div className="shrink-0 text-center sm:text-right">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold">
              Pure Rastafari Hair Integrity
            </span>
          </div>
        </div>

        {/* Effortless return to top menu */}
        <BackToTopBar currentSectionName="Services & Pricing Menu" />
      </div>
    </section>
  );
};
