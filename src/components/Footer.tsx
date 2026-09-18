import React from 'react';
import { Scissors, CreditCard, Heart, Sparkles, MapPin, Phone, Instagram } from 'lucide-react';
import { STUDIO_INFO, EMPLOYEES } from '../data/crochetData';

interface FooterProps {
  onOpenMpesa: () => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenMpesa, onOpenBooking }) => {
  return (
    <footer className="bg-[#080c09] text-stone-300 border-t border-[#18241b] relative">
      {/* Top Rasta Ribbon */}
      <div className="h-1.5 w-full rasta-gradient-bar" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-amber-500 to-red-600 p-0.5 shadow-md">
                <div className="w-full h-full bg-[#0b0f0c] rounded-[10px] flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-amber-400 transform -rotate-45" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black text-white font-syne uppercase tracking-tight">
                  Crochet<span className="text-amber-400">City</span>
                </span>
                <p className="text-xs text-emerald-400 font-semibold">
                  By {STUDIO_INFO.owner}
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              The premier wax-free dreadlock studio in East Africa. Engineered with micro-crochet needles for neat, clean, lightweight crowns that command respect and endure for years.
            </p>

            <div className="flex items-center gap-3 text-xs text-stone-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Westlands Nairobi Flagship
              </span>
              <span>•</span>
              <span className="text-amber-400 font-semibold">Lipa na M-Pesa Till: {STUDIO_INFO.mpesaTill}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-white">
              Studio Navigation
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <a href="#services-section" className="hover:text-amber-400 transition-colors">
                  Services & Pricing
                </a>
              </li>
              <li>
                <a href="#transformations-section" className="hover:text-amber-400 transition-colors">
                  Neat Transformations
                </a>
              </li>
              <li>
                <a href="#team-section" className="hover:text-amber-400 transition-colors">
                  P The Dread Genius & Staff
                </a>
              </li>
              <li>
                <a href="#reviews-section" className="hover:text-amber-400 transition-colors">
                  Client Reviews (4.98★)
                </a>
              </li>
              <li>
                <a href="#care-section" className="hover:text-amber-400 transition-colors">
                  Loc Care Manifesto
                </a>
              </li>
              <li>
                <a href="#location-section" className="hover:text-amber-400 transition-colors">
                  Directions & Studio Hours
                </a>
              </li>
            </ul>
          </div>

          {/* Employees & Locticians */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-white">
              Artisan Staff
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              {EMPLOYEES.map((emp) => (
                <li key={emp.id} className="flex items-center justify-between">
                  <span className="text-stone-300 font-medium">{emp.name}</span>
                  <span className="text-[10px] text-amber-400/80">{emp.isOwner ? 'Founder' : emp.role.split(' ')[0]}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* M-Pesa & Payment */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-white">
              M-Pesa Express
            </h4>
            <div className="p-3 rounded-xl bg-[#0e1610] border border-[#1d2d20] space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CreditCard className="w-4 h-4" />
                <span>Buy Goods Till</span>
              </div>
              <p className="text-base font-black text-amber-400 font-mono">
                {STUDIO_INFO.mpesaTill}
              </p>
              <p className="text-[10px] text-stone-400">Crochet City Dreadlocks</p>
              <button
                id="footer-mpesa-btn"
                onClick={onOpenMpesa}
                className="w-full py-1.5 rounded bg-[#008751]/30 hover:bg-[#008751]/50 text-emerald-300 font-bold text-[11px] cursor-pointer"
              >
                Launch Payment Portal
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Rasta color accents */}
        <div className="mt-12 pt-6 border-t border-[#18241b] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            &copy; {new Date().getFullYear()} <strong className="text-stone-300">Crochet City Dreadlocks</strong>. Founded by{' '}
            <strong className="text-amber-400">{STUDIO_INFO.owner}</strong>. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Green: Vitality & Earth
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Gold: Spiritual Wealth
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Red: Ancient Royal Bloodline
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
