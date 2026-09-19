import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, X, Phone, Clock, Sparkles, CheckCircle2, ChevronRight, HelpCircle, Camera, ArrowUp } from 'lucide-react';
import { STUDIO_INFO } from '../data/crochetData';

interface ChatWithPFloatingProps {
  onOpenBooking?: () => void;
  onOpenMpesa?: () => void;
}

const PRESET_INQUIRIES = [
  {
    id: 'quote-photos',
    label: '📸 Send hair photos for instant price quote',
    message: "Jambo P The dread genius! I would like an estimate for my hair. Can I send photos of my locs for a consultation and price quote?",
  },
  {
    id: 'book-slot',
    label: '📅 Check earliest chair slot with P',
    message: "Hello P! I'd like to book an appointment with you at Crochet City Westlands. What are your earliest available slots this week?",
  },
  {
    id: 'loc-surgery',
    label: '🩹 Loc repair & wax detox inquiry',
    message: "Hi P! I have some thinning/unraveling locs and old product buildup. Can you help me diagnose if I need loc surgery or an ACV detox?",
  },
  {
    id: 'starter-locs',
    label: '🌱 Starting new locs consultation',
    message: "Jambo P! I want to start my dreadlocks journey with 100% crochet needles. How much is starter locs and how long does my hair need to be?",
  },
  {
    id: 'mpesa-query',
    label: '💵 M-Pesa payment confirmation',
    message: "Hello Crochet City! I would like to confirm my M-Pesa booking deposit for Till number 894210.",
  },
];

export const ChatWithPFloating: React.FC<ChatWithPFloatingProps> = ({ onOpenBooking, onOpenMpesa }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showPromptBadge, setShowPromptBadge] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(PRESET_INQUIRIES[0].message);
  const [customText, setCustomText] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeMessage = customText.trim() ? customText : selectedMessage;
  const whatsappUrl = `https://wa.me/${STUDIO_INFO.whatsapp}?text=${encodeURIComponent(activeMessage)}`;

  const handleOpenWhatsApp = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // If user does not need the chatbot, it disappears from their screen with a minimal restore option
  if (isDismissed) {
    return (
      <div className="fixed bottom-3 right-3 z-30">
        <button
          id="restore-chatbot-btn"
          onClick={() => setIsDismissed(false)}
          className="px-2.5 py-1 rounded-full bg-[#0c140e]/90 hover:bg-[#142318] border border-[#1f3625] text-stone-400 hover:text-emerald-300 text-[10px] font-medium backdrop-blur-sm transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
          title="Restore chat widget"
        >
          <MessageSquare className="w-3 h-3 text-emerald-400" />
          <span>Need help? Chat</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-50 flex flex-col items-end max-w-[calc(100vw-1.5rem)]">
      {/* Speech Bubble Teaser when chat is closed */}
      {!isOpen && showPromptBadge && (
        <div className="mb-3 relative max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-[#0f1912] text-white border border-[#234329] shadow-2xl rounded-2xl p-3 pr-8 relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPromptBadge(false);
              }}
              className="absolute top-2 right-2 text-stone-400 hover:text-white text-xs p-1"
              aria-label="Close message teaser"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider">
                P The dread genius
              </span>
            </div>
            <p className="text-xs text-stone-200 leading-snug cursor-pointer" onClick={() => setIsOpen(true)}>
              &quot;Habari! Need a quick loc estimate or want to send photos for diagnosis? Chat directly with me on WhatsApp!&quot;
            </p>
            {/* Small triangle arrow pointing to the button */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-[#0f1912] border-b border-r border-[#234329] transform rotate-45" />
          </div>
        </div>
      )}

      {/* Expanded WhatsApp Direct Chat Box */}
      {isOpen && (
        <div className="mb-3 w-[92vw] sm:w-96 rounded-3xl bg-[#0d1510] border border-[#243d2b] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0d2a17] via-[#143d22] to-[#1d2716] p-4 border-b border-[#25422d] relative">
            {/* Rasta trim bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                    alt="P The dread genius"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400"
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0d2a17] rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-extrabold text-white font-syne">
                      {STUDIO_INFO.owner}
                    </h3>
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500 text-stone-950">
                      Genius
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-300 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online • Typical reply &lt; 5 mins
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  id="hide-chat-permanently-btn"
                  onClick={() => {
                    setIsOpen(false);
                    setIsDismissed(true);
                  }}
                  className="text-[11px] text-stone-400 hover:text-red-300 px-2 py-1 rounded bg-black/40 hover:bg-black/80 transition-colors cursor-pointer"
                  title="Hide chat widget completely"
                >
                  Hide Bot
                </button>
                <button
                  id="close-chat-floating-btn"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Close Chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-3.5 max-h-[70vh] overflow-y-auto">
            {/* Welcome note */}
            <div className="p-3 rounded-xl bg-[#132017] border border-[#203626] text-xs text-stone-300 space-y-1">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Direct Studio Concierge:
              </p>
              <p className="text-[11px] leading-relaxed text-stone-300">
                Send a quick text or photo of your locs directly to P&apos;s WhatsApp line (<span className="text-emerald-400 font-mono font-bold">+254 712 345 678</span>) for an instant diagnosis, pricing, or emergency appointment.
              </p>
            </div>

            {/* Quick Presets */}
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-2">
                Tap a question or send custom inquiry:
              </p>
              <div className="space-y-1.5">
                {PRESET_INQUIRIES.map((preset) => (
                  <button
                    key={preset.id}
                    id={`preset-chat-${preset.id}`}
                    onClick={() => {
                      setSelectedMessage(preset.message);
                      setCustomText(preset.message);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all border flex items-center justify-between cursor-pointer ${
                      activeMessage === preset.message
                        ? 'bg-emerald-950/80 border-emerald-500/80 text-white font-semibold'
                        : 'bg-[#101812] border-[#1c2e21] text-stone-300 hover:border-[#2f4f37] hover:text-white'
                    }`}
                  >
                    <span className="truncate pr-2">{preset.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Message input */}
            <div>
              <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                Your WhatsApp Message:
              </label>
              <textarea
                id="whatsapp-message-input"
                rows={3}
                value={activeMessage}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type your question for P..."
                className="w-full bg-[#111c14] border border-[#253f2c] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Direct Send to WhatsApp CTA */}
            <button
              id="send-whatsapp-direct-btn"
              onClick={() => handleOpenWhatsApp()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20bd5a] hover:to-[#0f7a6e] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 cursor-pointer transition-all transform hover:-translate-y-0.5"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Launch WhatsApp Chat with P</span>
              <Send className="w-3.5 h-3.5" />
            </button>

            {/* Alternative Direct Call */}
            <div className="pt-2 border-t border-[#1c2e21] flex items-center justify-between text-xs">
              <a
                href={`tel:${STUDIO_INFO.phone.replace(/ /g, '')}`}
                className="text-stone-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Studio directly</span>
              </a>
              <span className="text-[11px] text-amber-400 font-mono font-semibold">
                Westlands, Sound Plaza
              </span>
            </div>

            {/* Quick Hide Button */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsDismissed(true);
                }}
                className="text-[10px] text-stone-500 hover:text-stone-300 underline cursor-pointer"
              >
                Don&apos;t need this chat? Hide widget
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unified Floating Scroll-to-Top Button - appears cleanly when scrolled */}
      {showScrollTop && (
        <button
          id="unified-scroll-to-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="mb-2.5 px-3 py-2 rounded-full bg-[#0d1711]/95 hover:bg-[#152a1e] text-amber-400 hover:text-amber-300 border border-emerald-500/40 hover:border-amber-400 shadow-xl shadow-black/80 flex items-center gap-1.5 transition-all cursor-pointer group active:scale-95 backdrop-blur-md self-end animate-in fade-in slide-in-from-bottom-2 duration-200"
          title="Scroll back to top"
          aria-label="Scroll back to top"
        >
          <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform text-amber-400" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-200 group-hover:text-white">
            Top
          </span>
        </button>
      )}

      {/* Main Floating Button Row with Dismiss Control */}
      <div className="flex items-center gap-1.5">
        {/* Dismiss 'X' button to make chat bot disappear if user does not need it */}
        <button
          id="dismiss-chatbot-trigger-btn"
          onClick={(e) => {
            e.stopPropagation();
            setIsDismissed(true);
          }}
          className="w-7 h-7 rounded-full bg-[#0d1711]/90 hover:bg-red-950/80 text-stone-400 hover:text-red-300 border border-[#1f3724] hover:border-red-500/50 flex items-center justify-center text-xs shadow-md backdrop-blur-sm transition-all cursor-pointer group"
          title="Hide chat bot (I don't need it)"
          aria-label="Hide chat bot"
        >
          <X className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
        </button>

        {/* Main Floating WhatsApp Chat Trigger */}
        <button
          id="chat-with-p-floating-trigger"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Chat with P The dread genius on WhatsApp"
          className="group relative flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#25D366] via-[#1ebd5d] to-[#128C7E] text-white shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border-2 border-emerald-400/40"
        >
          {/* Pulsing ring animation */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 group-hover:opacity-60 animate-ping -z-10" />

          {/* P Avatar with online green status */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
              alt="P The dread genius"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-white/90"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#22c55e] border-2 border-white rounded-full" />
          </div>

          {/* Text */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider drop-shadow">
                Chat with P
              </span>
              <span className="text-[9px] bg-amber-400 text-stone-950 font-black px-1.5 py-0.2 rounded-full uppercase">
                Online
              </span>
            </div>
            <span className="text-[10px] text-emerald-100 font-medium hidden sm:inline">
              Direct WhatsApp Inquiries
            </span>
          </div>

          {/* WhatsApp Icon */}
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 flex items-center justify-center">
            <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
          </div>
        </button>
      </div>
    </div>
  );
};
