// src/components/OtpLoginModal.tsx
import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Phone, ArrowRight, X, Sparkles, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const OtpLoginModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { loginWithOtp } = useAuth();

  const [selectedPersona, setSelectedPersona] = useState<'person1' | 'person2' | 'custom'>('person1');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [otpDigits, setOtpDigits] = useState<string[]>(['1', '2', '3', '4']);
  const [customName, setCustomName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  if (!isOpen) return null;

  const handleSelectPersona = (persona: 'person1' | 'person2') => {
    setSelectedPersona(persona);
    if (persona === 'person1') {
      setPhoneNumber('9876543210');
    } else {
      setPhoneNumber('9820112345');
    }
    setOtpDigits(['1', '2', '3', '4']);
    setError(null);
  };

  const handleDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];

    if (cleaned.length > 1) {
      // Pasted or multi-digit typed
      const chars = cleaned.slice(0, 4).split('');
      chars.forEach((c, i) => {
        if (index + i < 4) newDigits[index + i] = c;
      });
      setOtpDigits(newDigits);
      const nextFocus = Math.min(index + chars.length, 3);
      inputRefs[nextFocus]?.current?.focus();
      return;
    }

    newDigits[index] = cleaned;
    setOtpDigits(newDigits);
    setError(null);

    // Auto-advance to next box if filled
    if (cleaned && index < 3) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pasteData) return;
    const newDigits = ['', '', '', ''];
    pasteData.split('').forEach((char, idx) => {
      newDigits[idx] = char;
    });
    setOtpDigits(newDigits);
    const nextFocus = Math.min(pasteData.length, 3);
    inputRefs[nextFocus]?.current?.focus();
  };

  const handleAutoFillTestOtp = () => {
    setOtpDigits(['1', '2', '3', '4']);
    setError(null);
    inputRefs[3]?.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fullOtp = otpDigits.join('');
    if (fullOtp.length < 4) {
      setError('Please enter the full 4-digit OTP');
      return;
    }

    if (fullOtp !== '1234') {
      setError('Invalid test OTP! Use default test OTP: 1234');
      return;
    }

    setLoading(true);
    try {
      await loginWithOtp({
        phone: phoneNumber,
        otp: fullOtp,
        persona: selectedPersona,
        name: selectedPersona === 'custom' ? customName : undefined,
      });
      setLoading(false);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-[360px] sm:max-w-md bg-white rounded-3xl p-4 sm:p-6 shadow-2xl relative border border-gray-100 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 text-xl sm:text-2xl shadow-xs">
            🏛️
          </div>
          <h2 className="text-sm sm:text-base font-black text-gray-900">
            JanMitra Real-Time OTP Login
          </h2>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
            Test multi-user sync instantly with OTP <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded-sm">1234</span>
          </p>
        </div>

        {/* 1-Tap Persona Cards */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Select Fast Test Profile:
            </label>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <Sparkles size={10} /> 1-Tap Switch
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Person 1: Citizen Avinash */}
            <button
              type="button"
              onClick={() => handleSelectPersona('person1')}
              className={`p-2.5 sm:p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                selectedPersona === 'person1'
                  ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500 shadow-xs'
                  : 'border-gray-200 hover:bg-gray-50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60"
                  alt="Avinash"
                  className="w-7 h-7 rounded-full object-cover border border-emerald-500 shrink-0"
                />
                <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-sm">
                  CITIZEN
                </span>
              </div>
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold text-gray-900 leading-tight">
                  Avinash Shinde
                </h4>
                <p className="text-[10px] text-gray-500 leading-tight">Nagrik User</p>
                <p className="text-[10px] text-emerald-700 font-semibold mt-1 font-mono">
                  9876543210
                </p>
              </div>
            </button>

            {/* Person 2: Officer Rajesh */}
            <button
              type="button"
              onClick={() => handleSelectPersona('person2')}
              className={`p-2.5 sm:p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                selectedPersona === 'person2'
                  ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500 shadow-xs'
                  : 'border-gray-200 hover:bg-gray-50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60"
                  alt="Officer Rajesh"
                  className="w-7 h-7 rounded-full object-cover border border-blue-500 shrink-0"
                />
                <span className="text-[9px] font-bold text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded-sm">
                  OFFICER
                </span>
              </div>
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold text-gray-900 leading-tight">
                  Er. Rajesh K.
                </h4>
                <p className="text-[10px] text-gray-500 leading-tight">Ward Engineer</p>
                <p className="text-[10px] text-blue-700 font-semibold mt-1 font-mono">
                  9820112345
                </p>
              </div>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium animate-in fade-in">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Mobile Number Field */}
          <div>
            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
              Mobile Number
            </label>
            <div className="flex items-center rounded-2xl border border-gray-200 bg-gray-50 focus-within:bg-white focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 overflow-hidden transition-all">
              <div className="flex items-center gap-1 px-3 py-2.5 sm:py-3 bg-gray-100/90 border-r border-gray-200 text-xs font-bold text-gray-700 shrink-0 select-none">
                <span>🇮🇳</span>
                <span>+91</span>
              </div>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                  setSelectedPersona('custom');
                }}
                className="flex-1 px-3 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-gray-900 bg-transparent outline-none tracking-wider font-mono"
                placeholder="10-digit mobile number"
                required
              />
            </div>
          </div>

          {/* 4-Digit Segmented OTP Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                Enter 4-Digit OTP
              </label>
              <button
                type="button"
                onClick={handleAutoFillTestOtp}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg transition cursor-pointer flex items-center gap-1"
                title="Click to auto-fill 1234"
              >
                <span>⚡ Fill: 1234</span>
              </button>
            </div>

            {/* Segmented OTP digit boxes */}
            <div className="flex items-center justify-between gap-2 sm:gap-2.5">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  onFocus={(e) => e.target.select()}
                  className={`flex-1 h-12 sm:h-14 text-center text-xl sm:text-2xl font-black rounded-2xl border transition-all outline-none font-mono ${
                    digit
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950 ring-2 ring-emerald-500/30'
                      : 'border-gray-200 bg-gray-50 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 text-gray-900'
                  }`}
                  aria-label={`OTP Digit ${index + 1}`}
                  required
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Verifying & Logging In...</span>
            ) : (
              <>
                <span>Confirm & Start Session</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <p className="text-[10px] text-center text-gray-400 mt-3">
          Tip: Open in two tabs (one as Citizen, one as Officer) to see real-time sync!
        </p>
      </div>
    </div>
  );
};
