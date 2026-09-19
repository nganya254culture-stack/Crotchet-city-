import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesMenu } from './components/ServicesMenu';
import { TransformationShowcase } from './components/TransformationShowcase';
import { ReviewsSection } from './components/ReviewsSection';
import { TeamSection } from './components/TeamSection';
import { CareGuide } from './components/CareGuide';
import { LocDiagnosisQuiz } from './components/LocDiagnosisQuiz';
import { LocationAndContact } from './components/LocationAndContact';
import { Footer } from './components/Footer';
import { MpesaPaymentModal } from './components/MpesaPaymentModal';
import { BookingModal } from './components/BookingModal';
import { ChatWithPFloating } from './components/ChatWithPFloating';
import { LiveActivityTicker } from './components/LiveActivityTicker';
import { DreadlocksBackdrop } from './components/DreadlocksBackdrop';
import { WhatsAppModal } from './components/WhatsAppModal';
import { PageContainer } from './components/PageContainer';
import { MediaGalleryManager } from './components/MediaGalleryManager';
import { SwipeNavigationController } from './components/SwipeNavigationController';
import { ServiceItem, Employee } from './types';
import { STUDIO_INFO } from './data/crochetData';
import { Scissors, Sparkles, ShieldCheck, CreditCard, Calendar, Star, CheckCircle, Image as ImageIcon } from 'lucide-react';

export default function App() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [selectedLocticianId, setSelectedLocticianId] = useState<string | undefined>(undefined);

  const [mpesaModalOpen, setMpesaModalOpen] = useState(false);
  const [mpesaAmount, setMpesaAmount] = useState<number>(500);
  const [mpesaPurpose, setMpesaPurpose] = useState<string>('Crochet City Appointment Deposit');

  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [mediaStudioOpen, setMediaStudioOpen] = useState(false);

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
      {/* ATMOSPHERIC GLOWING RASTA EDGES FRAMING - Cycles Green, Gold, Red along viewport edges */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden" aria-hidden="true">
        {/* Top Edge: Deep Premium Emerald Green Ambient Glow */}
        <div className="rasta-ambient-glow-top" />
        {/* Right Edge: Cycling Gold & Rasta Ambient Glow */}
        <div className="rasta-ambient-glow-right" />
        {/* Bottom Edge: Rich Luxury Scarlet Red Ambient Glow */}
        <div className="rasta-ambient-glow-bottom" />
        {/* Left Edge: Green to Gold Ambient Glow */}
        <div className="rasta-ambient-glow-left" />
      </div>

      {/* TRANSPARENT BACKGROUND: Woman with back turned, thick dreadlocks cascading down with developer switchable photos/videos */}
      <DreadlocksBackdrop onOpenMediaStudio={() => setMediaStudioOpen(true)} />

      {/* Primary Sticky Header with 2-Dots Menu and Scroll Progress */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenMpesa={() => handleOpenMpesa()}
        onOpenReviews={() => {
          const el = document.getElementById('reviews-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenWhatsAppPopup={() => setWhatsAppModalOpen(true)}
        onOpenMediaStudio={() => setMediaStudioOpen(true)}
      />

      {/* Main Content Area - Separated pages with transparent front letting the dreadlocks background show through */}
      {/* Main Studio Sections Container */}
      <main className="relative z-10 flex-1 bg-transparent py-4 sm:py-6">
        {/* Section: Hero & Studio Introduction */}
        <PageContainer
          id="hero-page"
          pageTitle="Studio Introduction & Crown Philosophy"
          pageSubtitle="Nairobi’s Neatest Locs • Westlands Flagship"
          categoryBadge="Pure Needle Craft"
        >
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
          <div className="border-t border-[#1a271e]/70 bg-[#0c1610]/60 backdrop-blur-sm py-4 px-4">
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
        </PageContainer>

        {/* 1. Section: Comprehensive Services Menu with KSh / USD Pricing */}
        <PageContainer
          id="services-section"
          pageTitle="Authentic Dreadlocks Services & Rates Menu"
          pageSubtitle="Interlocking, Retwists, Loc Styling & Herbal Detox"
          categoryBadge="Transparent Rates"
        >
          <ServicesMenu onSelectService={handleSelectService} />
        </PageContainer>

        {/* 2. Section: Transformations Showcase: Before & After Proof of Neatness with Videos & Photos */}
        <PageContainer
          id="transformations-section"
          pageTitle="Before & After Showcase, Videos & Photos"
          pageSubtitle="Live Studio Media, Wax-Free Precision & Needle Interlocking"
          categoryBadge="Photo & Video Vault"
        >
          <TransformationShowcase
            onBookService={(serviceName) => {
              handleOpenBooking();
            }}
            onOpenUploadModal={() => setMediaStudioOpen(true)}
          />
        </PageContainer>

        {/* 3. Section: Customer Reviews Section */}
        <PageContainer
          id="reviews-section"
          pageTitle="Verified Client Testimonials & Ratings"
          pageSubtitle="Trusted by Nairobi's Artists, Athletes & Professionals"
          categoryBadge="4.98★ Verified Rating"
        >
          <ReviewsSection />
        </PageContainer>

        {/* 4. Section: People's: P The dread genius & his artisan employees */}
        <PageContainer
          id="team-section"
          pageTitle="P The Dread Genius & The Artisan Crew"
          pageSubtitle="Master Stylists Trained in Needle Interlocking & Care"
          categoryBadge="Artisan Team"
        >
          <TeamSection onSelectLoctician={handleSelectLoctician} />
        </PageContainer>

        {/* 5. Section: The Neat Locs Care Manifesto */}
        <PageContainer
          id="care-section"
          pageTitle="The 100% Wax-Free Loc Care Manifesto"
          pageSubtitle="Guaranteed Methods for Clean, Lightweight, Odor-Free Locs"
          categoryBadge="Care Guidelines"
        >
          <CareGuide />
        </PageContainer>

        {/* Section: Interactive Loc Doctor & Price Matcher Tool */}
        <PageContainer
          id="diagnosis-tool"
          pageTitle="Loc Doctor & Instant Pricing Matcher"
          pageSubtitle="Interactive Crown Diagnostic & Hair Health Engine"
          categoryBadge="Diagnostic Quiz"
        >
          <LocDiagnosisQuiz
            onBookService={(srvId, locticianId) => {
              handleOpenBooking(srvId, locticianId);
            }}
          />
        </PageContainer>

        {/* 6. Section: Location, Amenities & Contact */}
        <PageContainer
          id="location-section"
          pageTitle="Westlands Studio Location & Appointments"
          pageSubtitle="Directions, Operating Hours, Amenities & Direct Booking"
          categoryBadge="Visit Us Daily"
        >
          <LocationAndContact
            onOpenMpesa={() => handleOpenMpesa()}
            onOpenBooking={() => handleOpenBooking()}
          />
        </PageContainer>
      </main>

      {/* Footer with Rasta color trim */}
      <Footer
        onOpenMpesa={() => handleOpenMpesa()}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Seamless Left-Swipe Back & Right-Swipe Next Navigation Controller */}
      <SwipeNavigationController />

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

      {/* Developer Media & Photo Gallery Manager Modal */}
      <MediaGalleryManager
        isOpen={mediaStudioOpen}
        onClose={() => setMediaStudioOpen(false)}
      />
    </div>
  );
}

