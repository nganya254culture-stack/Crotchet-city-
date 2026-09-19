import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, CreditCard, Sparkles, Coffee, Wifi, Music, Check } from 'lucide-react';
import { STUDIO_INFO } from '../data/crochetData';
import { SectionBackToIndex } from './SectionBackToIndex';
import { BackToTopBar } from './BackToTopBar';

interface LocationAndContactProps {
  onOpenMpesa: () => void;
  onOpenBooking: () => void;
}

export const LocationAndContact: React.FC<LocationAndContactProps> = ({ onOpenMpesa, onOpenBooking }) => {
  return (
    <section className="py-8 sm:py-14 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Index Navigation Breadcrumb Bar */}
        <SectionBackToIndex sectionTitle="Location & Studio Hours" categoryBadge="Find & Visit Us" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Studio details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Westlands Nairobi Flagship
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-cinzel">
              Visit The Crochet City Sanctuary
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
              Located in the heart of Westlands, Nairobi. Step into a relaxing, modern salon infused with positive roots reggae vibrations, chilled herbal teas, and private ergonomic washing basins.
            </p>

            {/* Address & Hours Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#111913] border border-[#213225] space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Physical Address</span>
                </div>
                <p className="text-sm font-extrabold text-white">
                  Sound Plaza, 3rd Floor
                </p>
                <p className="text-xs text-stone-300">
                  Woodvale Grove, Westlands, Nairobi, Kenya
                </p>
                <span className="text-[11px] text-emerald-400 font-semibold block pt-1">
                  Secure basement parking available
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#111913] border border-[#213225] space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Working Hours</span>
                </div>
                <p className="text-sm font-extrabold text-white">
                  Monday – Saturday: 7:30 AM – 8:30 PM
                </p>
                <p className="text-xs text-stone-300">
                  Sunday: 9:00 AM – 6:00 PM
                </p>
                <span className="text-[11px] text-amber-400 font-semibold block pt-1">
                  Early bird needle slots available on request
                </span>
              </div>
            </div>

            {/* Studio Amenities */}
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-stone-400 mb-2">
                Complimentary Studio Amenities:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-stone-300">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#121a14] border border-[#1d2a20]">
                  <Coffee className="w-3.5 h-3.5 text-amber-400" />
                  <span>Spiced Herbal Chai</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#121a14] border border-[#1d2a20]">
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ultra-Fast Wi-Fi</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#121a14] border border-[#1d2a20]">
                  <Music className="w-3.5 h-3.5 text-red-400" />
                  <span>Roots Reggae Vinyl</span>
                </div>
              </div>
            </div>

            {/* Contact Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                id="contact-call-btn"
                href={`tel:${STUDIO_INFO.phone.replace(/ /g, '')}`}
                className="px-5 py-3 rounded-xl bg-[#152319] hover:bg-[#1d3023] border border-[#273d2d] text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer rasta-btn-glow"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call Studio: {STUDIO_INFO.phone}</span>
              </a>

              <a
                id="contact-whatsapp-btn"
                href={`https://wa.me/${STUDIO_INFO.whatsapp}?text=${encodeURIComponent("Jambo P The dread genius! I'd like to inquire about booking a crochet dreadlock appointment at Crochet City.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/60 text-emerald-300 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer rasta-btn-glow"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp The Genius</span>
              </a>
            </div>
          </div>

          {/* Right: Quick Booking & Payment Box */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl p-6 bg-[#0f1712] border border-[#223526] shadow-2xl space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-1.5 rasta-gradient-bar" />

              <div className="flex items-center justify-between border-b border-[#1c2a1f] pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-white font-syne">
                    Instant Chair Booking & M-Pesa
                  </h3>
                  <p className="text-xs text-stone-400">Lock your appointment in 60 seconds</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Real-time
                </span>
              </div>

              {/* Mpesa Fast Details */}
              <div className="p-4 rounded-2xl bg-[#0a110c] border border-[#1b2b1d] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#008751] text-white flex items-center justify-center text-xs font-black">
                      M
                    </div>
                    <span className="text-xs font-bold text-white">Lipa na M-Pesa (Till)</span>
                  </div>
                  <span className="text-lg font-black text-amber-400 font-mono tracking-wider">
                    {STUDIO_INFO.mpesaTill}
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Store name: <strong className="text-stone-200">Crochet City Dreadlocks</strong>
                </p>
                <button
                  id="contact-open-mpesa-btn"
                  onClick={onOpenMpesa}
                  className="w-full py-2.5 rounded-lg bg-[#008751]/30 hover:bg-[#008751]/50 border border-[#008751] text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer rasta-btn-glow"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Open Interactive M-Pesa Terminal</span>
                </button>
              </div>

              {/* Booking CTA - Smaller & Neat */}
              <button
                id="contact-book-chair-btn"
                onClick={onOpenBooking}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95 rasta-btn-glow"
              >
                <span>Book Appointment With P</span>
              </button>

              <div className="text-center text-[11px] text-stone-400">
                Walk-ins welcomed subject to chair availability. Bookings prioritized.
              </div>
            </div>
          </div>
        </div>

        {/* Back to Index Footer Bar */}
        <BackToTopBar currentSectionName="Location & Studio Hours" />
      </div>
    </section>
  );
};
