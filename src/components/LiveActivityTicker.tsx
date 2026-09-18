import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, CheckCircle2, Star, CreditCard, ShieldCheck, X } from 'lucide-react';
import { STUDIO_INFO } from '../data/crochetData';

interface ActivityItem {
  id: string;
  name: string;
  location: string;
  action: string;
  service: string;
  timeAgo: string;
  avatar: string;
  verified: boolean;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    name: 'Kelvin O.',
    location: 'Westlands, Nairobi',
    action: 'reserved chair with',
    service: 'P The dread genius (Crochet Retwist)',
    timeAgo: '3 mins ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    verified: true,
  },
  {
    id: 'act-2',
    name: 'Sarah Mwangi',
    location: 'Kilimani, Nairobi',
    action: 'paid M-Pesa deposit for',
    service: 'Sisterlocks Retightening',
    timeAgo: '7 mins ago',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    verified: true,
  },
  {
    id: 'act-3',
    name: 'Martin K.',
    location: 'Lavington, Nairobi',
    action: 'completed 100% wax-free',
    service: 'Loc Surgery & Core Reconstruction',
    timeAgo: '14 mins ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    verified: true,
  },
  {
    id: 'act-4',
    name: 'Brenda Achieng',
    location: 'Karen, Nairobi',
    action: 'rated Crochet City 5.0★:',
    service: '"Zero pain, cleanest grid parting ever!"',
    timeAgo: '21 mins ago',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80',
    verified: true,
  },
];

export const LiveActivityTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ACTIVITIES.length);
        setVisible(true);
      }, 400);
    }, 9000);

    return () => clearInterval(interval);
  }, [dismissed]);

  if (dismissed) return null;

  const current = ACTIVITIES[currentIndex];

  return (
    <div className="fixed bottom-5 left-5 z-40 max-w-xs sm:max-w-sm hidden md:block">
      <div
        className={`transition-all duration-300 transform ${
          visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95'
        }`}
      >
        <div className="p-3.5 rounded-2xl bg-[#0c140e]/95 backdrop-blur-md border border-[#243d2b] shadow-2xl shadow-black/80 flex items-start gap-3 relative overflow-hidden group">
          {/* Subtle top indicator bar */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500" />

          {/* Dismiss button */}
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 text-stone-500 hover:text-white p-1 text-xs"
            aria-label="Dismiss notifications"
          >
            <X className="w-3 h-3" />
          </button>

          {/* Client Avatar */}
          <div className="relative shrink-0">
            <img
              src={current.avatar}
              alt={current.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/50"
            />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center text-[9px] font-bold">
              ✓
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 pr-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white font-syne">{current.name}</span>
              <span className="text-[10px] text-stone-400">({current.location})</span>
            </div>
            <p className="text-[11px] text-stone-300 leading-snug mt-0.5">
              {current.action} <strong className="text-amber-400">{current.service}</strong>
            </p>
            <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-400">
              <span className="text-emerald-400 font-semibold">{current.timeAgo}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-stone-400">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                Verified Client
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
