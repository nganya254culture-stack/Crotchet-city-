import React, { useState, useEffect } from 'react';
import { Award, Star, CheckCircle, Scissors, Calendar, Sparkles, Instagram, Clock, ShieldCheck, Heart, Camera } from 'lucide-react';
import { EMPLOYEES, STUDIO_INFO } from '../data/crochetData';
import { Employee } from '../types';
import { BackToTopBar } from './BackToTopBar';
import { SectionBackToIndex } from './SectionBackToIndex';
import { getEffectivePhoto, loadAllPhotoOverridesAsync } from '../data/mediaGallery';
import { ReplacePhotoModal } from './ReplacePhotoModal';

interface TeamSectionProps {
  onSelectLoctician: (employee: Employee) => void;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ onSelectLoctician }) => {
  const owner = EMPLOYEES.find((emp) => emp.isOwner) || EMPLOYEES[0];
  const staff = EMPLOYEES.filter((emp) => !emp.isOwner);
  const [, setRefresh] = useState(0);

  // Photo replacement modal state
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
    loadAllPhotoOverridesAsync().then(() => {
      setRefresh(v => v + 1);
    });

    const handlePhotoReplaced = () => setRefresh(v => v + 1);
    window.addEventListener('crochet-photo-replaced', handlePhotoReplaced);
    return () => window.removeEventListener('crochet-photo-replaced', handlePhotoReplaced);
  }, []);

  const handleOpenReplace = (photoKey: string, currentUrl: string, originalUrl?: string, title?: string) => {
    setReplaceModal({
      isOpen: true,
      photoKey,
      currentPhotoUrl: currentUrl,
      originalDefaultUrl: originalUrl || currentUrl,
      photoTitle: title || 'Staff Member Photo',
    });
  };

  const effectiveOwnerAvatar = getEffectivePhoto(owner.avatar, `team-owner-${owner.id}`);

  return (
    <section className="py-8 sm:py-14 bg-transparent relative">
      {/* Background Rasta accent aura */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-emerald-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Back to Index Navigation Breadcrumb Bar */}
        <SectionBackToIndex sectionTitle="P The Dread Genius & Staff" categoryBadge="Artisan Team" />

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            The Artisans Behind The Crowns
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-cinzel">
            Led by P The Dread Genius & Elite Locticians
          </h2>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
            Every stylist at Crochet City is personally trained by <span className="text-amber-400 font-semibold">{STUDIO_INFO.owner}</span> in wax-free micro-needle precision, scalp ergonomics, and authentic Rasta dreadlock care.
          </p>
        </div>

        {/* OWNER SPOTLIGHT HERO CARD */}
        <div className="mb-16 relative">
          <div className="rounded-3xl p-1 bg-gradient-to-r from-emerald-600 via-amber-500 to-red-600 shadow-2xl">
            <div className="bg-[#0f1611] rounded-[22px] p-6 sm:p-10 relative overflow-hidden">
              {/* Background badge watermark */}
              <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none select-none">
                <Scissors className="w-80 h-80 text-amber-400" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Owner Portrait */}
                <div className="lg:col-span-4 text-center sm:text-left">
                  <div className="relative inline-block mx-auto lg:mx-0 group">
                    <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden ring-4 ring-amber-400/40 shadow-2xl relative">
                      <img
                        src={effectiveOwnerAvatar}
                        alt={owner.name}
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      
                      {/* Replace photo quick button overlay */}
                      <button
                        type="button"
                        onClick={() => handleOpenReplace(`team-owner-${owner.id}`, effectiveOwnerAvatar, owner.avatar, `${owner.name} (Founder Portrait)`)}
                        className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-black/80 hover:bg-amber-500 hover:text-stone-950 text-amber-300 border border-amber-500/50 text-[11px] font-bold transition-all flex items-center gap-1 shadow-md cursor-pointer backdrop-blur-sm"
                        title="Replace Founder Photo"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Change Photo</span>
                      </button>

                      <div className="absolute bottom-3 left-3 right-3 text-center">
                        <span className="px-3 py-1 rounded-full bg-amber-500 text-stone-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                          FOUNDER & LEAD ARTISAN
                        </span>
                      </div>
                    </div>

                    {/* Verified badge */}
                    <div className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 flex items-center justify-center shadow-lg border-2 border-[#0f1611]">
                      <Award className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Right: Owner Biography, Philosophy & Credentials */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-syne">
                          {owner.name}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold">
                          Owner
                        </span>
                      </div>
                      <p className="text-amber-400 font-semibold text-sm mt-0.5">
                        {owner.title} • {owner.experienceYears} Years of Dreadlock Artistry
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#142017] border border-[#243527]">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-extrabold text-white">{owner.rating}</span>
                      <span className="text-xs text-stone-400">({owner.completedHeads}+ crowns)</span>
                    </div>
                  </div>

                  <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
                    {owner.bio}
                  </p>

                  {/* Owner Quote Banner */}
                  <div className="p-4 rounded-xl bg-[#141f17] border-l-4 border-amber-400 relative">
                    <p className="text-xs sm:text-sm text-stone-200 italic">
                      &quot;{owner.quote}&quot;
                    </p>
                    <p className="text-[11px] text-amber-300 font-bold mt-1 uppercase tracking-wider">
                      — P The dread genius
                    </p>
                  </div>

                  {/* Specialties Pills */}
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-stone-400 block mb-2">
                      Master Techniques:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {owner.specialties.map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-3 py-1 rounded-lg bg-[#18261c] border border-[#283d2e] text-emerald-300 text-xs font-medium flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-3 h-3 text-amber-400" />
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="pt-2 flex flex-wrap items-center gap-2.5">
                    <button
                      id={`book-with-owner-btn`}
                      onClick={() => onSelectLoctician(owner)}
                      className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95 rasta-btn-glow"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Chair With P</span>
                    </button>

                    <div className="flex items-center gap-1.5 text-xs text-stone-400 px-3 py-2 rounded-lg bg-[#141d17]">
                      <Instagram className="w-3.5 h-3.5 text-pink-400" />
                      <span>{owner.instagram}</span>
                    </div>

                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold ml-auto">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Accepting Needle Appointments
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STAFF & EMPLOYEES GRID */}
        <div>
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#1c291f]">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white font-cinzel">
                The Artisan Employees
              </h3>
              <p className="text-xs sm:text-sm text-stone-400">
                P The dread genius’s handpicked, certified loctician team
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold hidden sm:inline-block">
              5 Full-Time Specialists
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((emp) => {
              const effectiveEmpAvatar = getEffectivePhoto(emp.avatar, `team-emp-${emp.id}`);
              return (
                <div
                  key={emp.id}
                  className="rounded-2xl bg-[#0e1410] border border-[#1f2d22] hover:border-amber-500/40 p-5 space-y-4 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/20 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top card banner */}
                    <div className="flex items-start gap-4">
                      <div className="relative group/avatar">
                        <img
                          src={effectiveEmpAvatar}
                          alt={emp.name}
                          className="w-16 h-16 rounded-xl object-cover ring-2 ring-[#223526] group-hover:ring-amber-400/60 transition-all"
                        />
                        {/* Replace photo overlay button */}
                        <button
                          type="button"
                          onClick={() => handleOpenReplace(`team-emp-${emp.id}`, effectiveEmpAvatar, emp.avatar, `${emp.name} (Loctician Avatar)`)}
                          className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-black/90 hover:bg-amber-500 text-amber-300 hover:text-stone-950 border border-amber-500/50 flex items-center justify-center shadow transition-all cursor-pointer"
                          title="Replace this loctician's photo"
                        >
                          <Camera className="w-3 h-3" />
                        </button>

                        {emp.availableToday && (
                          <span 
                            title="Available in salon today"
                            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0e1410] flex items-center justify-center"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-extrabold text-white truncate font-syne group-hover:text-amber-300 transition-colors">
                            {emp.name}
                          </h4>
                        </div>
                      <p className="text-xs text-amber-400 font-semibold">{emp.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-400">
                        <span className="flex items-center text-amber-400">
                          <Star className="w-3 h-3 fill-current mr-0.5" />
                          {emp.rating}
                        </span>
                        <span>•</span>
                        <span>{emp.experienceYears} yrs exp</span>
                        <span>•</span>
                        <span className="text-stone-300">{emp.completedHeads}+ heads</span>
                      </div>
                    </div>
                  </div>

                  {/* Moniker & Short Bio */}
                  <p className="text-xs text-stone-300 mt-3 leading-relaxed line-clamp-3">
                    {emp.bio}
                  </p>

                  {/* Quote */}
                  <div className="mt-3 p-2.5 rounded-lg bg-[#131b15] border-l-2 border-emerald-500 text-[11px] text-stone-300 italic">
                    &quot;{emp.quote}&quot;
                  </div>

                  {/* Specialties */}
                  <div className="mt-3">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1.5">
                      Specialties:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {emp.specialties.map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] px-2 py-0.5 rounded bg-[#162118] text-stone-300 border border-[#233527]"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-[#1c291f] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                    <Instagram className="w-3.5 h-3.5 text-pink-400" />
                    <span className="truncate max-w-[100px]">{emp.instagram}</span>
                  </div>

                  <button
                    id={`book-with-${emp.id}`}
                    onClick={() => onSelectLoctician(emp)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#19271c] hover:bg-amber-500 hover:text-stone-950 text-amber-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-[#263c2c] rasta-btn-glow"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book With {emp.name.split(' ')[0]}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Staff & Founder Photo Replace Modal */}
      <ReplacePhotoModal
        isOpen={replaceModal.isOpen}
        onClose={() => setReplaceModal(prev => ({ ...prev, isOpen: false }))}
        photoKey={replaceModal.photoKey}
        currentPhotoUrl={replaceModal.currentPhotoUrl}
        originalDefaultUrl={replaceModal.originalDefaultUrl}
        photoTitle={replaceModal.photoTitle}
        onPhotoReplaced={() => setRefresh(v => v + 1)}
      />

      {/* Effortless return to top menu */}
      <BackToTopBar currentSectionName="P The Dread Genius & Staff" />
      </div>
    </section>
  );
};
