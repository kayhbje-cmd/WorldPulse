// src/services/realtime.service.ts
import { Problem } from '../types';

export type RealtimeEvent = {
  type: string;
  [key: string]: any;
};

type RealtimeListener = (event: RealtimeEvent) => void;

class RealtimeService {
  private ws: WebSocket | null = null;
  private channel: BroadcastChannel | null = null;
  private listeners: Set<RealtimeListener> = new Set();
  private isConnecting: boolean = false;
  private reconnectTimer: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.channel = new BroadcastChannel('janmitra_realtime_channel');
        this.channel.onmessage = (event) => {
          this.notifyListeners(event.data);
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported:', e);
      }
      this.connectWebSocket();
    }
  }

  public connectWebSocket() {
    if (typeof window === 'undefined' || this.isConnecting) return;
    this.isConnecting = true;

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('[JanMitra Realtime] WebSocket Connected');
        this.isConnecting = false;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notifyListeners(data);
          // Broadcast to local tabs as well
          this.channel?.postMessage(data);
        } catch (err) {
          console.error('[JanMitra Realtime] Parse error:', err);
        }
      };

      this.ws.onclose = () => {
        this.isConnecting = false;
        // Auto-reconnect after 2 seconds
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = setTimeout(() => {
          this.connectWebSocket();
        }, 2000);
      };

      this.ws.onerror = () => {
        this.isConnecting = false;
        this.ws?.close();
      };
    } catch (e) {
      this.isConnecting = false;
    }
  }

  public subscribe(listener: RealtimeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public notifyListeners(event: any) {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Error in realtime listener:', err);
      }
    });
  }

  public broadcastLocally(event: any) {
    this.notifyListeners(event);
    this.channel?.postMessage(event);
  }
}

export const realtimeService = new RealtimeService();
