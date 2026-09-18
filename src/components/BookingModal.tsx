import React, { useState } from 'react';
import { X, Calendar, Clock, User, Scissors, Check, Sparkles, CreditCard, ChevronRight, Phone, MessageSquare, CheckCircle2 } from 'lucide-react';
import { SERVICES, EMPLOYEES, STUDIO_INFO } from '../data/crochetData';
import { BookingRequest, Employee, ServiceItem } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
  initialLocticianId?: string;
  onOpenMpesaPay: (amount: number, purpose: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialServiceId,
  initialLocticianId,
  onOpenMpesaPay,
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || SERVICES[0].id
  );
  const [selectedLocticianId, setSelectedLocticianId] = useState<string>(
    initialLocticianId || 'emp-p-genius'
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('07');
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRequest | null>(null);

  if (!isOpen) return null;

  const currentService = SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];
  const currentLoctician = EMPLOYEES.find((e) => e.id === selectedLocticianId) || EMPLOYEES[0];

  const timeSlots = [
    '8:00 AM',
    '10:00 AM',
    '12:30 PM',
    '2:30 PM',
    '4:30 PM',
    '6:30 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || clientPhone.length < 9) {
      alert('Please enter your full name and phone number for booking confirmation.');
      return;
    }

    const newBooking: BookingRequest = {
      id: 'BK-' + Math.floor(100000 + Math.random() * 900000),
      clientName,
      clientPhone,
      serviceId: currentService.id,
      serviceName: currentService.name,
      locticianId: currentLoctician.id,
      locticianName: currentLoctician.name,
      date: selectedDate,
      timeSlot: selectedTime,
      notes,
      amountKsh: currentService.priceKsh,
      depositPaidKsh: 500,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    setConfirmedBooking(newBooking);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-[#0c130e] border border-[#213526] shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Rasta Trim */}
        <div className="h-1.5 w-full rasta-gradient-bar" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#101a13] border-b border-[#1d2d20] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-white font-cinzel">
                Reserve Your Loctician Chair
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                100% Needle
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Experience the neatness standard with <span className="text-amber-400 font-semibold">{STUDIO_INFO.owner}</span> & crew
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[11px] font-medium text-stone-400 hover:text-amber-300 px-2 py-1 rounded bg-[#162218] border border-[#233526] hover:border-amber-500/40 transition-all cursor-pointer"
              title="Close modal and return to index"
            >
              Back to Index
            </button>
            <button
              id="close-booking-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#18261b] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {step === 'details' ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Step 1: Select Service */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-2">
                1. Select Dreadlock Service
              </label>
              <select
                id="booking-service-select"
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full bg-[#121c15] border border-[#243729] rounded-xl py-3 px-4 text-white text-sm font-semibold focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — KSh {s.priceKsh.toLocaleString()} ({s.duration})
                  </option>
                ))}
              </select>
              <div className="mt-1.5 flex items-center justify-between text-xs text-stone-400">
                <span>Duration: <strong className="text-emerald-400">{currentService.duration}</strong></span>
                <span>Total: <strong className="text-amber-400 font-bold">KSh {currentService.priceKsh.toLocaleString()}</strong></span>
              </div>
            </div>

            {/* Step 2: Choose Stylist */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-2">
                2. Choose Master Loctician
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {EMPLOYEES.map((emp) => (
                  <button
                    key={emp.id}
                    type="button"
                    id={`select-emp-${emp.id}`}
                    onClick={() => setSelectedLocticianId(emp.id)}
                    className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer flex items-center gap-2.5 ${
                      selectedLocticianId === emp.id
                        ? 'bg-[#18281d] border-amber-400 ring-1 ring-amber-400/40 text-white'
                        : 'bg-[#121a14] border-[#203023] text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-9 h-9 rounded-lg object-cover ring-1 ring-[#263c2c]"
                    />
                    <div className="truncate">
                      <p className="text-xs font-bold truncate">
                        {emp.name} {emp.isOwner ? '👑' : ''}
                      </p>
                      <p className="text-[10px] text-amber-400/90 truncate">{emp.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  3. Select Date
                </label>
                <div className="relative">
                  <input
                    id="booking-date-input"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#121c15] border border-[#243729] rounded-xl py-2.5 px-3 text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  4. Available Time Slot
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      id={`time-slot-${time.replace(/[: ]/g, '')}`}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-1 text-center rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        selectedTime === time
                          ? 'bg-emerald-600 text-white font-bold shadow-md'
                          : 'bg-[#121c15] border border-[#203024] text-stone-300 hover:bg-[#18251c]'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4: Client Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  Your Full Name
                </label>
                <input
                  id="client-name-input"
                  type="text"
                  placeholder="e.g. David Mwangi"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-[#121c15] border border-[#243729] rounded-xl py-2.5 px-3 text-white text-xs focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  Phone / M-Pesa Number
                </label>
                <input
                  id="client-phone-input"
                  type="tel"
                  placeholder="0712 345 678"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-[#121c15] border border-[#243729] rounded-xl py-2.5 px-3 text-white text-xs focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                Hair Notes / Current Loc Status (Optional)
              </label>
              <textarea
                id="client-notes-textarea"
                rows={2}
                placeholder="e.g. 3 years loc'd, have some lint in crown, looking for neat parting..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#121c15] border border-[#243729] rounded-xl p-3 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* M-Pesa Deposit Notice */}
            <div className="p-3.5 rounded-xl bg-[#111e15] border border-[#203625] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold text-white">M-Pesa Deposit: KSh 500 to lock slot</p>
                  <p className="text-[11px] text-stone-400">Deducted from your total bill at the salon.</p>
                </div>
              </div>
              <span className="text-amber-400 font-mono font-bold">Till {STUDIO_INFO.mpesaTill}</span>
            </div>

            {/* Submit CTA - Smaller & Neat */}
            <button
              type="submit"
              id="confirm-booking-btn"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Confirm Appointment (KSh 500 Deposit)</span>
            </button>
          </form>
        ) : (
          /* BOOKING SUCCESS SCREEN */
          <div className="p-6 sm:p-8 space-y-6 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-green-400 text-stone-950 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/60">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Reservation Confirmed
              </span>
              <h4 className="text-2xl font-extrabold text-white font-cinzel mt-1">
                Your Chair Is Ready!
              </h4>
              <p className="text-xs text-stone-300 mt-1 max-w-md mx-auto">
                Thank you <strong className="text-white">{confirmedBooking?.clientName}</strong>. 
                Your needle appointment with <strong className="text-amber-300">{confirmedBooking?.locticianName}</strong> is reserved.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="p-5 rounded-2xl bg-[#111a14] border border-[#233527] text-left max-w-md mx-auto space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-[#1f2d21] pb-2">
                <span className="text-stone-400">Booking ID:</span>
                <span className="text-amber-400 font-bold">{confirmedBooking?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Service:</span>
                <span className="text-white font-sans font-bold">{confirmedBooking?.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Stylist:</span>
                <span className="text-emerald-400 font-bold">{confirmedBooking?.locticianName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Date & Time:</span>
                <span className="text-white font-bold">{confirmedBooking?.date} at {confirmedBooking?.timeSlot}</span>
              </div>
              <div className="flex justify-between border-t border-[#1f2d21] pt-2">
                <span className="text-stone-400">Location:</span>
                <span className="text-stone-200 font-sans">{STUDIO_INFO.address}</span>
              </div>
            </div>

            {/* M-Pesa Quick Pay Trigger for Deposit */}
            <div className="space-y-3 max-w-md mx-auto">
              <button
                id="booking-pay-mpesa-deposit-btn"
                onClick={() => {
                  onClose();
                  onOpenMpesaPay(500, `Booking ${confirmedBooking?.id} Deposit`);
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#008751] to-[#059669] hover:from-[#059669] hover:to-[#10b981] text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay KSh 500 Deposit Now (Instant M-Pesa STK)</span>
              </button>

              <button
                id="booking-whatsapp-confirm-btn"
                onClick={() => {
                  const message = encodeURIComponent(
                    `Hello P The dread genius & Crochet City team! I just booked an appointment: ${confirmedBooking?.serviceName} with ${confirmedBooking?.locticianName} on ${confirmedBooking?.date} at ${confirmedBooking?.timeSlot}. Name: ${confirmedBooking?.clientName}. Phone: ${confirmedBooking?.clientPhone}.`
                  );
                  window.open(`https://wa.me/254712345678?text=${message}`, '_blank');
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Notify Studio via WhatsApp</span>
              </button>
            </div>

            <button
              id="close-success-btn"
              onClick={onClose}
              className="text-xs text-stone-400 hover:text-white underline cursor-pointer"
            >
              Done & Return to Website
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
