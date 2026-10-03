// src/services/voice.service.ts
import { LanguageCode } from '../types';

export interface VoiceCommandResult {
  action: 'navigate_tab' | 'filter_category' | 'switch_lang' | 'fill_report' | 'unknown';
  payload?: any;
  feedbackText: string;
}

class VoiceService {
  private synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private recognition: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
      }
    }
  }

  public isSupported(): boolean {
    return !!this.recognition || !!this.synth;
  }

  public speak(text: string, lang: LanguageCode = 'en') {
    if (!this.synth) return;
    try {
      this.synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (lang === 'hi') {
        utterance.lang = 'hi-IN';
      } else if (lang === 'mr') {
        utterance.lang = 'mr-IN';
      } else {
        utterance.lang = 'en-IN';
      }
      utterance.rate = 1.0;
      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  public listen(
    lang: LanguageCode = 'en',
    onResult: (text: string) => void,
    onError?: (err: any) => void
  ): { stop: () => void } {
    if (!this.recognition) {
      if (onError) onError('Speech recognition not available on this browser');
      return { stop: () => {} };
    }

    try {
      this.recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN';
      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };
      this.recognition.onerror = (event: any) => {
        if (onError) onError(event.error);
      };
      this.recognition.start();
    } catch (e) {
      if (onError) onError(e);
    }

    return {
      stop: () => {
        try {
          this.recognition?.stop();
        } catch {}
      },
    };
  }

  public parseCommand(transcript: string, currentLang: LanguageCode): VoiceCommandResult {
    const text = transcript.toLowerCase();

    // Map navigation
    if (text.includes('map') || text.includes('नक्शा') || text.includes('नकाशा')) {
      return {
        action: 'navigate_tab',
        payload: 'map',
        feedbackText: currentLang === 'hi' ? 'नागरिक मानचित्र खोला जा रहा है' : currentLang === 'mr' ? 'नागरी नकाशा उघडत आहे' : 'Opening civic map view',
      };
    }

    // Activity navigation
    if (text.includes('activity') || text.includes('मेरी शिकायत') || text.includes('माझ्या तक्रारी') || text.includes('status')) {
      return {
        action: 'navigate_tab',
        payload: 'activity',
        feedbackText: currentLang === 'hi' ? 'आपकी शिकायतें और सूचनाएं खोली जा रही हैं' : currentLang === 'mr' ? 'आपल्या तक्रारींची स्थिती दाखवत आहे' : 'Navigating to your activity and alerts',
      };
    }

    // Post Issue
    if (text.includes('report') || text.includes('post') || text.includes('दर्ज') || text.includes('नोंदवा') || text.includes('pothole') || text.includes('garbage')) {
      let initialCategory = 'infrastructure';
      if (text.includes('garbage') || text.includes('कचरा') || text.includes('सफाई')) {
        initialCategory = 'sanitation';
      } else if (text.includes('water') || text.includes('पानी') || text.includes('पाणी')) {
        initialCategory = 'utilities';
      }

      return {
        action: 'fill_report',
        payload: {
          category: initialCategory,
          initialTitle: transcript,
        },
        feedbackText: currentLang === 'hi' ? 'शिकायत दर्ज करने का फॉर्म खोला जा रहा है' : currentLang === 'mr' ? 'तक्रार नोंदणी अर्ज उघडत आहे' : 'Opening report form for you',
      };
    }

    // Language switch
    if (text.includes('hindi') || text.includes('हिंदी')) {
      return {
        action: 'switch_lang',
        payload: 'hi',
        feedbackText: 'भाषा बदलकर हिन्दी कर दी गई है।',
      };
    }
    if (text.includes('marathi') || text.includes('मराठी')) {
      return {
        action: 'switch_lang',
        payload: 'mr',
        feedbackText: 'भाषा बदलून मराठी केली आहे.',
      };
    }
    if (text.includes('english')) {
      return {
        action: 'switch_lang',
        payload: 'en',
        feedbackText: 'Switched language to English.',
      };
    }

    return {
      action: 'unknown',
      payload: transcript,
      feedbackText: currentLang === 'hi' ? `सुनाई दिया: "${transcript}"` : currentLang === 'mr' ? `ऐकले: "${transcript}"` : `Heard: "${transcript}"`,
    };
  }
}

export const voiceService = new VoiceService();
