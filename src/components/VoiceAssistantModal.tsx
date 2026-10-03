// src/components/VoiceAssistantModal.tsx
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, Navigation, AlertCircle } from 'lucide-react';
import { voiceService, VoiceCommandResult } from '../services/voice.service';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageCode } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onAutoFillReport?: (data: { category: string; title: string }) => void;
}

export const VoiceAssistantModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onAutoFillReport,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [activeListener, setActiveListener] = useState<{ stop: () => void } | null>(null);

  useEffect(() => {
    if (isOpen) {
      startListening();
    } else {
      stopListening();
      setTranscript('');
      setFeedback('');
    }
    return () => {
      stopListening();
    };
  }, [isOpen]);

  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    setFeedback(t('listening', 'Listening... speak your civic request'));

    const listener = voiceService.listen(
      language,
      (spokenText) => {
        setTranscript(spokenText);
        handleCommand(spokenText);
      },
      (err) => {
        setIsListening(false);
        setFeedback(typeof err === 'string' ? err : 'Could not hear voice. Tap to retry.');
      }
    );
    setActiveListener(listener);
  };

  const stopListening = () => {
    if (activeListener) {
      activeListener.stop();
      setActiveListener(null);
    }
    setIsListening(false);
  };

  const handleCommand = (text: string) => {
    setIsListening(false);
    const result: VoiceCommandResult = voiceService.parseCommand(text, language);
    setFeedback(result.feedbackText);
    voiceService.speak(result.feedbackText, language);

    setTimeout(() => {
      if (result.action === 'navigate_tab') {
        onNavigateTab(result.payload);
        onClose();
      } else if (result.action === 'fill_report') {
        onNavigateTab('post');
        if (onAutoFillReport) {
          onAutoFillReport({
            category: result.payload.category,
            title: result.payload.initialTitle,
          });
        }
        onClose();
      } else if (result.action === 'switch_lang') {
        setLanguage(result.payload as LanguageCode);
      }
    }, 1200);
  };

  if (!isOpen) return null;

  const quickPrompts = [
    { label: language === 'hi' ? 'सड़क का गड्ढा रिपोर्ट करें' : language === 'mr' ? 'खड्डा नोंदवा' : 'Report a road pothole', text: 'Report a road pothole' },
    { label: language === 'hi' ? 'नागरिक मानचित्र दिखाओ' : language === 'mr' ? 'नकाशा उघडा' : 'Open civic map', text: 'Show civic map' },
    { label: language === 'hi' ? 'मेरी शिकायतें देखें' : language === 'mr' ? 'माझ्या तक्रारी' : 'Check my activity', text: 'Show my activity' },
    { label: 'मराठी / Hindi', text: language === 'hi' ? 'Switch to Marathi' : 'Switch to Hindi' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-3 animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl relative border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
        >
          <X size={18} />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">{t('voiceTitle', 'JanMitra Civic Voice Assistant')}</h3>
            <p className="text-[11px] text-gray-500">AI Voice Assistant • English, हिन्दी, मराठी</p>
          </div>
        </div>

        {/* Dynamic Voice Waveform & Microphone Visualizer */}
        <div className="my-6 flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all shadow-lg cursor-pointer ${
              isListening
                ? 'bg-red-500 ring-8 ring-red-100 animate-pulse scale-105'
                : 'bg-emerald-600 hover:bg-emerald-700 ring-4 ring-emerald-100'
            }`}
          >
            {isListening ? <Mic size={32} /> : <MicOff size={28} />}
          </button>

          {/* Voice Wave Animation */}
          {isListening && (
            <div className="flex items-center gap-1.5 mt-4 h-6">
              {[40, 70, 95, 60, 85, 45, 90, 50, 75, 30].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-emerald-500 rounded-full animate-bounce"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${i * 80}ms`,
                    animationDuration: '600ms',
                  }}
                />
              ))}
            </div>
          )}

          {/* Transcript / Feedback box */}
          <div className="mt-4 w-full bg-gray-50 rounded-2xl p-3.5 text-center min-h-[58px] flex flex-col items-center justify-center border border-gray-100">
            {transcript ? (
              <p className="text-sm font-semibold text-gray-800 italic">"{transcript}"</p>
            ) : null}
            <p className="text-xs text-emerald-700 mt-1 font-medium">{feedback}</p>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mt-2">
          <p className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-2">
            Try saying or tap:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(p.text);
                  handleCommand(p.text);
                }}
                className="text-xs font-medium px-3 py-1.5 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 rounded-full transition border border-gray-200/60"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
