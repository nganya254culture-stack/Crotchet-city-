import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Send, 
  Camera, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  UploadCloud,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { STUDIO_INFO } from '../data/crochetData';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: string;
}

const PRESET_TOPICS = [
  {
    id: 'quote',
    title: '📸 Price Quote from Hair Photos',
    text: "Jambo P The dread genius! I would like a quote for my hair. Can I send photos of my dreads/afro to get an instant estimate?",
  },
  {
    id: 'earliest',
    title: '📅 Earliest Chair Slot with P',
    text: "Hello P! What are your earliest open chair slots this week at Westlands Sound Plaza?",
  },
  {
    id: 'repair',
    title: '🩹 Loc Surgery / Broken Roots Repair',
    text: "Hi P! I have some thinning, weak roots and unraveling locs. I need a needle crochet repair consultation.",
  },
  {
    id: 'detox',
    title: '🌿 Organic ACV Deep Wax Detox',
    text: "Jambo Crochet City! I have heavy buildup from old beeswax. Can I book the ACV deep pore cleanse and needle reset?",
  },
  {
    id: 'starter',
    title: '🌱 Starting New Locs from Afro',
    text: "Hello P! I want to start my loc journey with 100% crochet needles. What length do you recommend and what is the cost?",
  },
];

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ isOpen, onClose, defaultTopic }) => {
  const [selectedTopic, setSelectedTopic] = useState(defaultTopic || PRESET_TOPICS[0].text);
  const [customNote, setCustomNote] = useState('');
  const [hairPhotoAttached, setHairPhotoAttached] = useState<string | null>(null);

  if (!isOpen) return null;

  const finalMessage = customNote.trim() 
    ? `${customNote.trim()}${hairPhotoAttached ? ' [Note: I am attaching hair photos for consultation]' : ''}`
    : `${selectedTopic}${hairPhotoAttached ? ' [Note: I am attaching hair photos for consultation]' : ''}`;

  const whatsappUrl = `https://wa.me/${STUDIO_INFO.whatsapp}?text=${encodeURIComponent(finalMessage)}`;

  const handleLaunchWhatsApp = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleSimulatedPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setHairPhotoAttached(file.name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-3xl bg-[#0d1611] border border-[#25462f] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Rasta ribbon header strip */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500" />

        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-b from-[#13261a] to-[#0e1a12] border-b border-[#1f3724] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                alt="P The dread genius"
                className="w-13 h-13 rounded-full object-cover ring-2 ring-amber-400"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#0d1611] rounded-full animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white font-syne">
                  {STUDIO_INFO.owner}
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-stone-950">
                  Direct Line
                </span>
              </div>
              <p className="text-xs text-emerald-300 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                WhatsApp Live • Usually replies within 5 mins
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[11px] font-medium text-stone-400 hover:text-emerald-300 px-2 py-1 rounded bg-[#162218] border border-[#233526] hover:border-emerald-500/40 transition-all cursor-pointer"
              title="Close and return to index"
            >
              Back to Index
            </button>
            <button
              id="close-whatsapp-modal-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-black/40 hover:bg-black/80 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[72vh] overflow-y-auto">
          {/* Studio Guarantee Banner */}
          <div className="p-3 rounded-2xl bg-[#142318] border border-[#23402b] flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-stone-300 space-y-0.5">
              <p className="font-bold text-white">Instant WhatsApp Consultation:</p>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Connect directly with P at <span className="text-emerald-400 font-mono font-bold">+254 712 345 678</span>. Send photos of your hair to get accurate pricing or emergency chair bookings.
              </p>
            </div>
          </div>

          {/* Preset Topics */}
          <div>
            <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
              Select what you need:
            </label>
            <div className="space-y-2">
              {PRESET_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => {
                    setSelectedTopic(topic.text);
                    setCustomNote(topic.text);
                  }}
                  className={`w-full text-left p-3 rounded-xl text-xs transition-all border flex items-center justify-between cursor-pointer ${
                    selectedTopic === topic.text && !customNote
                      ? 'bg-emerald-950/80 border-emerald-400 text-white font-semibold'
                      : 'bg-[#101a13] border-[#1d3322] text-stone-300 hover:border-[#2d4e36] hover:text-white'
                  }`}
                >
                  <span>{topic.title}</span>
                  <ChevronRight className="w-4 h-4 text-stone-500 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Photo upload attachment preview */}
          <div className="p-3.5 rounded-2xl bg-[#101912] border border-[#1e3423] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4" />
                Have photos of your hair?
              </span>
              <span className="text-[10px] text-stone-400">For precise diagnosis</span>
            </div>

            <label className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#16251b] hover:bg-[#1d3124] border border-dashed border-[#2c4e35] cursor-pointer text-xs text-stone-300 transition-colors">
              <UploadCloud className="w-4 h-4 text-emerald-400" />
              <span>{hairPhotoAttached ? `Attached: ${hairPhotoAttached}` : 'Select hair photos from your device'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleSimulatedPhotoUpload}
                className="hidden"
              />
            </label>
            {hairPhotoAttached && (
              <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Photo ready to send directly in WhatsApp chat with P
              </p>
            )}
          </div>

          {/* Custom Message Field */}
          <div>
            <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">
              Your Message to P:
            </label>
            <textarea
              rows={3}
              value={customNote || selectedTopic}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Ask anything about loc repairs, starter locs, or rates..."
              className="w-full bg-[#0c140e] border border-[#23402a] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          {/* Primary Action Button: Launch WhatsApp - Smaller & Neat */}
          <button
            id="launch-whatsapp-popup-btn"
            onClick={handleLaunchWhatsApp}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#25D366] via-[#22c55e] to-[#128C7E] hover:from-[#20bd5a] hover:to-[#0f7a6e] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-900/40 cursor-pointer transition-all active:scale-95"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Open WhatsApp & Chat with P</span>
            <Send className="w-3.5 h-3.5" />
          </button>

          {/* Studio Phone Call Alternative */}
          <div className="pt-2 border-t border-[#1c3222] flex items-center justify-between text-xs text-stone-400">
            <a
              href={`tel:${STUDIO_INFO.phone.replace(/ /g, '')}`}
              className="flex items-center gap-1.5 text-stone-300 hover:text-emerald-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Or call directly: <strong className="text-white">{STUDIO_INFO.phone}</strong></span>
            </a>
            <span className="text-[11px] text-amber-400 font-bold">Sound Plaza Westlands</span>
          </div>
        </div>
      </div>
    </div>
  );
};
