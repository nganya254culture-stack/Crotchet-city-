import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LocDiagnosisQuiz } from './components/LocDiagnosisQuiz';
import { TransformationShowcase } from './components/TransformationShowcase';
import { ServicesMenu } from './components/ServicesMenu';
import { TeamSection } from './components/TeamSection';
import { ReviewsSection } from './components/ReviewsSection';
import { CareGuide } from './components/CareGuide';
import { LocationAndContact } from './components/LocationAndContact';
import { Footer } from './components/Footer';
import { MpesaPaymentModal } from './components/MpesaPaymentModal';
import { BookingModal } from './components/BookingModal';
import { ChatWithPFloating } from './components/ChatWithPFloating';
import { LiveActivityTicker } from './components/LiveActivityTicker';
import { DreadlocksBackdrop } from './components/DreadlocksBackdrop';
import { WhatsAppModal } from './components/WhatsAppModal';
import { FloatingBackToIndex } from './components/FloatingBackToIndex';
import { ServiceItem, Employee } from './types';
import { STUDIO_INFO } from './data/crochetData';
import { Scissors, Sparkles, ShieldCheck, CreditCard, Calendar, Star, CheckCircle } from 'lucide-react';

export default function App() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [selectedLocticianId, setSelectedLocticianId] = useState<string | undefined>(undefined);

  const [mpesaModalOpen, setMpesaModalOpen] = useState(false);
  const [mpesaAmount, setMpesaAmount] = useState<number>(500);
  const [mpesaPurpose, setMpesaPurpose] = useState<string>('Crochet City Appointment Deposit');

  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);

  const handleOpenBooking = (serviceId?: string, locticianId?: string) => {
    if (serviceId) setSelectedServiceId(serviceId);
    if (locticianId) setSelectedLocticianId(locticianId);
    setBookingModalOpen(true);
  };

  const handleOpenMpesa = (amount?: number, purpose?: string) => {
    if (amount) setMpesaAmount(amount);
    if (purpose) setMpesaPurpose(purpose);
    setMpesaModalOpen(true);
  };

  const handleSelectService = (service: ServiceItem) => {
    setSelectedServiceId(service.id);
    setBookingModalOpen(true);
  };

  const handleSelectLoctician = (employee: Employee) => {
    setSelectedLocticianId(employee.id);
    setBookingModalOpen(true);
  };

  const handleOpenDiagnosis = () => {
    const el = document.getElementById('diagnosis-tool');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden bg-[#070b08] text-[#f4f2eb] flex flex-col font-sans selection:bg-[#f59e0b] selection:text-black">
      {/* TRANSPARENT BACKGROUND: Woman with back turned, thick dreadlocks cascading down all over the site */}
      <DreadlocksBackdrop />

      {/* Primary Sticky Header with 2-Dots Menu and Scroll Progress */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenMpesa={() => handleOpenMpesa()}
        onOpenReviews={() => {
          const el = document.getElementById('reviews-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenWhatsAppPopup={() => setWhatsAppModalOpen(true)}
      />

      {/* Main Content Area - Semi-transparent to let the woman's cascading dreadlocks show through */}
      <main className="relative z-10 flex-1 bg-[#090e0b]/40">
        {/* Hero Section */}
        <Hero
          onOpenBooking={() => handleOpenBooking()}
          onOpenMpesa={() => handleOpenMpesa(500, 'Crochet City Booking Deposit')}
          onExploreServices={() => {
            const el = document.getElementById('services-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenDiagnosis={handleOpenDiagnosis}
        />

        {/* Feature Trust Bar with Rasta Accents */}
        <div className="border-y border-[#1a271e]/70 bg-[#0e1511]/80 backdrop-blur-sm py-4 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-6 text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
              <span className="font-bold text-white">Pure Micro-Crochet Needles</span>
              <span className="text-stone-500">(0.5mm – 0.75mm)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50"></span>
              <span className="font-bold text-white">0% Beeswax / 0% Burning Gels</span>
              <span className="text-stone-500">(Never Leaves Residue)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50"></span>
              <span className="font-bold text-white">M-Pesa Verified Merchant</span>
              <span className="text-stone-500">(Till {STUDIO_INFO.mpesaTill})</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-bold text-white">4.98★ Average Rating</span>
              <span className="text-stone-500">(Over 340+ Verified Reviews)</span>
            </div>
          </div>
        </div>

        {/* Interactive Loc Doctor & Price Matcher Tool */}
        <LocDiagnosisQuiz
          onBookService={(srvId, locticianId) => {
            handleOpenBooking(srvId, locticianId);
          }}
        />

        {/* Transformations Showcase: Before & After Proof of Neatness */}
        <TransformationShowcase
          onBookService={(serviceName) => {
            handleOpenBooking();
          }}
        />

        {/* Comprehensive Services Menu with KSh / USD Pricing */}
        <ServicesMenu onSelectService={handleSelectService} />

        {/* Team Section: P The dread genius & his artisan employees */}
        <TeamSection onSelectLoctician={handleSelectLoctician} />

        {/* Customer Reviews Section */}
        <ReviewsSection />

        {/* The Neat Locs Care Manifesto */}
        <CareGuide />

        {/* Location, Amenities & Contact */}
        <LocationAndContact
          onOpenMpesa={() => handleOpenMpesa()}
          onOpenBooking={() => handleOpenBooking()}
        />
      </main>

      {/* Footer with Rasta color trim */}
      <Footer
        onOpenMpesa={() => handleOpenMpesa()}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Global Floating Back To Index Button (appears smoothly on scroll) */}
      <FloatingBackToIndex />

      {/* Real-time Studio Booking Activity Notification Toast (Bottom-Left) */}
      <LiveActivityTicker />

      {/* Floating 'Chat with P' WhatsApp Direct Button in Bottom-Right Corner */}
      <ChatWithPFloating
        onOpenBooking={() => handleOpenBooking()}
        onOpenMpesa={() => handleOpenMpesa()}
      />

      {/* Dedicated WhatsApp Pop-Up Modal for Inquiries & Hair Photos */}
      <WhatsAppModal
        isOpen={whatsAppModalOpen}
        onClose={() => setWhatsAppModalOpen(false)}
      />

      {/* Interactive M-Pesa Payment Portal Modal */}
      <MpesaPaymentModal
        isOpen={mpesaModalOpen}
        onClose={() => setMpesaModalOpen(false)}
        defaultAmount={mpesaAmount}
        defaultPurpose={mpesaPurpose}
        onPaymentSuccess={(code, amount) => {
          console.log(`Payment confirmed: ${code} for KSh ${amount}`);
        }}
      />

      {/* Chair Reservation & Booking Drawer Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialServiceId={selectedServiceId}
        initialLocticianId={selectedLocticianId}
        onOpenMpesaPay={(amount, purpose) => {
          handleOpenMpesa(amount, purpose);
        }}
      />
    </div>
  );
}

