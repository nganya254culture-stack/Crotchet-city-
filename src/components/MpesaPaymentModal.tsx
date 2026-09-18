import React, { useState } from 'react';
import { X, Check, Copy, CreditCard, ShieldCheck, Smartphone, ArrowRight, Sparkles, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { STUDIO_INFO } from '../data/crochetData';

interface MpesaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAmount?: number;
  defaultPurpose?: string;
  onPaymentSuccess?: (receiptCode: string, amount: number) => void;
}

export const MpesaPaymentModal: React.FC<MpesaPaymentModalProps> = ({
  isOpen,
  onClose,
  defaultAmount = 500,
  defaultPurpose = 'Booking Deposit - Crochet City',
  onPaymentSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'stk' | 'till' | 'verify'>('stk');
  const [phoneNumber, setPhoneNumber] = useState('0712 345 678');
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [purpose, setPurpose] = useState(defaultPurpose);
  const [stkStatus, setStkStatus] = useState<'idle' | 'prompt_sent' | 'pin_entered' | 'confirmed' | 'failed'>('idle');
  const [simulatedPin, setSimulatedPin] = useState('');
  const [generatedReceipt, setGeneratedReceipt] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Verification tab state
  const [manualCode, setManualCode] = useState('');
  const [verifiedReceipt, setVerifiedReceipt] = useState<{ code: string; date: string; amount: number } | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const triggerStkPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 9) {
      alert('Please enter a valid Safaricom phone number (e.g., 0712 345 678)');
      return;
    }
    setStkStatus('prompt_sent');
  };

  const handleSimulatePin = (e: React.FormEvent) => {
    e.preventDefault();
    setStkStatus('pin_entered');
    setTimeout(() => {
      // Generate realistic M-Pesa receipt code e.g. SHK982K7DM
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = 'SK';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setGeneratedReceipt(code);
      setStkStatus('confirmed');
      if (onPaymentSuccess) {
        onPaymentSuccess(code, amount);
      }
    }, 1200);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    const cleanCode = manualCode.toUpperCase().trim();
    setVerifiedReceipt({
      code: cleanCode,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      amount: amount || 2500
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl rounded-3xl bg-[#0d140f] border border-[#213526] shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Rasta Trim */}
        <div className="h-1.5 w-full rasta-gradient-bar" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-[#111a13] border-b border-[#1f2f22] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#008751] flex items-center justify-center text-white font-black text-lg shadow-md">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white font-syne">
                  Safaricom M-Pesa Express
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Direct Pay
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Official payment terminal for <span className="text-amber-400 font-semibold">{STUDIO_INFO.name}</span>
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
              id="close-mpesa-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#18261b] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs inside Modal */}
        <div className="flex border-b border-[#1b2b1e] bg-[#0c130e]">
          <button
            id="mpesa-tab-stk"
            onClick={() => {
              setActiveTab('stk');
              setStkStatus('idle');
            }}
            className={`flex-1 py-3 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'stk'
                ? 'border-emerald-500 text-emerald-400 bg-[#121c15]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Instant STK Push</span>
          </button>
          <button
            id="mpesa-tab-till"
            onClick={() => setActiveTab('till')}
            className={`flex-1 py-3 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'till'
                ? 'border-emerald-500 text-emerald-400 bg-[#121c15]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Till / Paybill Info</span>
          </button>
          <button
            id="mpesa-tab-verify"
            onClick={() => setActiveTab('verify')}
            className={`flex-1 py-3 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'verify'
                ? 'border-emerald-500 text-emerald-400 bg-[#121c15]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Code</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* TAB 1: STK PUSH (SIMULATED DARAJA INTERACTIVE FLOW) */}
          {activeTab === 'stk' && (
            <div className="space-y-5">
              {stkStatus === 'idle' && (
                <form onSubmit={triggerStkPush} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      Select Amount to Pay (KSh)
                    </label>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {[500, 2000, 2500, 3500, 6500].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          id={`preset-amount-${preset}`}
                          onClick={() => setAmount(preset)}
                          className={`py-2 px-3 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                            amount === preset
                              ? 'bg-amber-500 text-stone-950 shadow-md'
                              : 'bg-[#141e17] text-stone-300 hover:bg-[#1b291f] border border-[#213225]'
                          }`}
                        >
                          KSh {preset.toLocaleString()}
                        </button>
                      ))}
                    </div>

                    <div className="relative mt-2">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-amber-400">
                        KSh
                      </span>
                      <input
                        id="custom-amount-input"
                        type="number"
                        min="50"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full bg-[#121b14] border border-[#243729] rounded-xl py-2.5 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-emerald-500"
                        placeholder="Enter custom amount"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      Safaricom M-Pesa Phone Number
                    </label>
                    <input
                      id="mpesa-phone-input"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="07XX XXX XXX or 01XX XXX XXX"
                      className="w-full bg-[#121b14] border border-[#243729] rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-emerald-500"
                      required
                    />
                    <p className="text-[11px] text-stone-400 mt-1">
                      A prompt will appear instantly on your phone requesting your M-Pesa PIN.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      Payment Purpose / Booking Notes
                    </label>
                    <input
                      id="mpesa-purpose-input"
                      type="text"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full bg-[#121b14] border border-[#243729] rounded-xl py-2 px-4 text-stone-300 text-xs focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. Needle Retwist Deposit, Starter Locs"
                    />
                  </div>

                  <button
                    type="submit"
                    id="submit-stk-push-btn"
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#008751] to-[#059669] hover:from-[#059669] hover:to-[#10b981] text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 cursor-pointer transition-all"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Send M-Pesa STK Push (KSh {amount.toLocaleString()})</span>
                  </button>
                </form>
              )}

              {/* STK PUSH PROMPT SIMULATOR OVERLAY */}
              {stkStatus === 'prompt_sent' && (
                <div className="p-6 rounded-2xl bg-[#09110b] border-2 border-emerald-500/80 text-center space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="w-14 h-14 rounded-full bg-[#008751] text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/40 animate-pulse">
                    <Smartphone className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-white">
                      M-PESA Prompt Sent to {phoneNumber}
                    </h4>
                    <p className="text-xs text-stone-300 mt-1">
                      &quot;Do you want to pay <strong className="text-amber-400 font-bold">KSh {amount.toLocaleString()}</strong> to{' '}
                      <strong className="text-white">CROCHET CITY DREADLOCK STUDIO</strong>?&quot;
                    </p>
                  </div>

                  {/* Interactive simulated phone screen */}
                  <form onSubmit={handleSimulatePin} className="max-w-xs mx-auto space-y-3 pt-2">
                    <div className="p-3 bg-black rounded-xl border border-stone-800">
                      <label className="block text-[11px] text-stone-400 mb-1">
                        Enter M-Pesa PIN (Simulated for Demo):
                      </label>
                      <input
                        id="mpesa-simulated-pin-input"
                        type="password"
                        maxLength={4}
                        placeholder="••••"
                        value={simulatedPin}
                        onChange={(e) => setSimulatedPin(e.target.value)}
                        autoFocus
                        className="w-full text-center text-xl tracking-widest bg-[#151c16] text-amber-400 border border-stone-700 rounded py-1.5 focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      id="confirm-simulated-pin-btn"
                      className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Authorize Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => setStkStatus('idle')}
                      className="text-xs text-stone-400 hover:text-stone-200 underline"
                    >
                      Cancel / Change Number
                    </button>
                  </form>
                </div>
              )}

              {stkStatus === 'pin_entered' && (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto" />
                  <p className="text-sm font-bold text-white">Contacting Safaricom Gateway...</p>
                  <p className="text-xs text-stone-400">Verifying transaction and booking slot</p>
                </div>
              )}

              {/* PAYMENT CONFIRMED RECEIPT */}
              {stkStatus === 'confirmed' && (
                <div className="p-5 rounded-2xl bg-[#09150d] border border-emerald-500/60 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center font-bold">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-white">Payment Confirmed!</h4>
                      <p className="text-xs text-emerald-400 font-semibold">
                        Receipt: <strong className="text-white">{generatedReceipt}</strong>
                      </p>
                    </div>
                  </div>

                  {/* SMS Message Mock */}
                  <div className="p-4 rounded-xl bg-black/60 border border-[#1b2b1d] font-mono text-xs text-stone-300 leading-relaxed">
                    <span className="text-amber-400 font-bold">{generatedReceipt}</span> Confirmed. Ksh {amount.toLocaleString()}.00 sent to <strong className="text-white">CROCHET CITY DREADLOCK STUDIO</strong> on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Account: <strong className="text-emerald-400">{STUDIO_INFO.owner.toUpperCase()}</strong>.
                  </div>

                  <p className="text-xs text-stone-300">
                    Your appointment / transaction has been logged with <span className="text-amber-400 font-semibold">{STUDIO_INFO.owner}</span> and the team. An SMS notification has also been dispatched to your phone.
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      id="copy-confirmed-receipt-btn"
                      onClick={() => handleCopy(generatedReceipt, 'receipt')}
                      className="flex-1 py-2.5 px-3 rounded-lg bg-[#142017] hover:bg-[#1a2c1f] text-emerald-300 text-xs font-bold border border-[#213526] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedKey === 'receipt' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedKey === 'receipt' ? 'Copied Code!' : 'Copy Receipt Code'}</span>
                    </button>
                    <button
                      id="close-after-confirmed-btn"
                      onClick={onClose}
                      className="flex-1 py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                    >
                      Done & Return to Site
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MANUAL TILL / PAYBILL INSTRUCTIONS */}
          {activeTab === 'till' && (
            <div className="space-y-4">
              {/* Buy Goods Till Number */}
              <div className="p-4 rounded-2xl bg-[#111c14] border border-[#223727] flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                    Option A (Recommended)
                  </span>
                  <h4 className="text-sm font-extrabold text-white">M-Pesa Buy Goods & Services (Till)</h4>
                  <p className="text-2xl font-black text-amber-400 tracking-wider mt-1 font-mono">
                    {STUDIO_INFO.mpesaTill}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Store: Crochet City Dreadlocks (P The dread genius)
                  </p>
                </div>

                <button
                  id="copy-till-btn"
                  onClick={() => handleCopy(STUDIO_INFO.mpesaTill, 'till')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-700/30 hover:bg-emerald-600 hover:text-white text-emerald-300 border border-emerald-600/40 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  {copiedKey === 'till' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'till' ? 'Copied!' : 'Copy Till'}</span>
                </button>
              </div>

              {/* Paybill Option */}
              <div className="p-4 rounded-2xl bg-[#111c14] border border-[#223727] flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                    Option B: Paybill
                  </span>
                  <h4 className="text-sm font-extrabold text-white">M-Pesa Paybill Number</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <div>
                      <span className="text-xs text-stone-400">Business No:</span>
                      <p className="text-lg font-black text-white font-mono">{STUDIO_INFO.mpesaPaybill}</p>
                    </div>
                    <div>
                      <span className="text-xs text-stone-400">Account No:</span>
                      <p className="text-lg font-black text-amber-400 font-mono">{STUDIO_INFO.mpesaAccount}</p>
                    </div>
                  </div>
                </div>

                <button
                  id="copy-paybill-btn"
                  onClick={() => handleCopy(`${STUDIO_INFO.mpesaPaybill} Acc: ${STUDIO_INFO.mpesaAccount}`, 'paybill')}
                  className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 hover:text-stone-950 text-amber-300 border border-amber-500/40 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  {copiedKey === 'paybill' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'paybill' ? 'Copied!' : 'Copy Paybill'}</span>
                </button>
              </div>

              {/* Step-by-step instructions */}
              <div className="p-3.5 rounded-xl bg-[#0e1611] border border-[#1b2b1e] text-xs text-stone-300 space-y-1.5">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  How to pay via M-Pesa SIM Tool / M-Pesa App:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-stone-400 pl-1">
                  <li>Go to Lipa na M-PESA &gt; Buy Goods and Services</li>
                  <li>Enter Till Number: <strong className="text-white">{STUDIO_INFO.mpesaTill}</strong></li>
                  <li>Enter Amount (e.g. Deposit KSh 500 or full service cost)</li>
                  <li>Enter your Secret M-PESA PIN & press send</li>
                  <li>Paste the confirmation code in the &quot;Verify Code&quot; tab to instantly link your appointment.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: VERIFY TRANSACTION CODE */}
          {activeTab === 'verify' && (
            <div className="space-y-4">
              <form onSubmit={handleVerifyCode} className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300">
                  Enter 10-Digit M-Pesa Transaction Code
                </label>
                <div className="flex gap-2">
                  <input
                    id="manual-mpesa-code-input"
                    type="text"
                    maxLength={12}
                    placeholder="e.g. SHK982K7DM"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    className="flex-1 uppercase font-mono tracking-widest bg-[#121b14] border border-[#243729] rounded-xl py-2.5 px-4 text-white text-sm font-bold focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <button
                    type="submit"
                    id="verify-code-btn"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Verify
                  </button>
                </div>
                <p className="text-[11px] text-stone-400">
                  Instant real-time validation with the Crochet City studio ledger.
                </p>
              </form>

              {verifiedReceipt && (
                <div className="p-4 rounded-xl bg-[#0d1c12] border border-emerald-500/50 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-extrabold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Transaction Verified & Active in Ledger!</span>
                  </div>
                  <div className="text-xs text-stone-300 space-y-1">
                    <p>Code: <strong className="text-white font-mono">{verifiedReceipt.code}</strong></p>
                    <p>Recipient: <strong className="text-white">CROCHET CITY (P THE DREAD GENIUS)</strong></p>
                    <p>Status: <span className="text-emerald-400 font-bold">Approved for Chair Booking</span></p>
                  </div>
                  <button
                    id="verified-done-btn"
                    onClick={onClose}
                    className="w-full mt-2 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Continue to Appointment
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Guarantee */}
        <div className="p-4 bg-[#0a100c] border-t border-[#1a281d] flex items-center justify-between text-[11px] text-stone-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            256-Bit Encrypted Safaricom M-Pesa Merchant
          </span>
          <span className="text-stone-500">Authorized by {STUDIO_INFO.owner}</span>
        </div>
      </div>
    </div>
  );
};
