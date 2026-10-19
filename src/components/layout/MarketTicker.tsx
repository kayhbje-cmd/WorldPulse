import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, ChevronRight } from 'lucide-react';
import { MarketItem } from '../../types/news';
import { INITIAL_MARKET_DATA, getUpdatedMarketData } from '../../data/marketData';

export const MarketTicker: React.FC = () => {
  const [marketItems, setMarketItems] = useState<MarketItem[]>(INITIAL_MARKET_DATA);
  const [isPaused, setIsPaused] = useState(false);

  // Subtle real-time market pulse every 12 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketItems((prev) => getUpdatedMarketData(prev));
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="bg-[#090b10] border-y border-white/5 py-2 px-3 sm:px-6 overflow-hidden flex items-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center gap-1.5 sm:gap-2 pr-3 sm:pr-4 border-r border-white/10 shrink-0 z-10 bg-[#090b10]">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af37]"></span>
        </span>
        <span className="text-[10px] sm:text-[11px] font-semibold tracking-widest text-[#d4af37] uppercase flex items-center gap-1">
          <Activity className="w-3 h-3" />
          Market Pulse
        </span>
      </div>

      <div className="relative overflow-hidden w-full ml-3 sm:ml-4">
        <div
          className={`flex items-center gap-6 whitespace-nowrap animate-marquee ${
            isPaused ? '[animation-play-state:paused]' : ''
          }`}
        >
          {/* Double items for infinite marquee loop */}
          {[...marketItems, ...marketItems].map((item, idx) => (
            <div key={`${item.symbol}-${idx}`} className="inline-flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-300 tracking-wide text-[11px]">{item.symbol}</span>
              <span className="text-slate-100 font-mono text-[11px]">{item.price}</span>
              <span
                className={`inline-flex items-center text-[10px] font-mono font-medium ${
                  item.isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {item.isPositive ? (
                  <TrendingUp className="w-2.5 h-2.5 mr-0.5 inline" />
                ) : (
                  <TrendingDown className="w-2.5 h-2.5 mr-0.5 inline" />
                )}
                {item.changePercent}
              </span>
              <span className="text-white/15 ml-4">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
