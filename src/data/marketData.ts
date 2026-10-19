import { MarketItem } from '../types/news';

export const INITIAL_MARKET_DATA: MarketItem[] = [
  {
    symbol: 'S&P 500',
    name: 'S&P 500 Index',
    price: '5,864.67',
    change: +23.41,
    changePercent: '+0.40%',
    isPositive: true,
  },
  {
    symbol: 'NASDAQ',
    name: 'Nasdaq Composite',
    price: '18,371.90',
    change: +115.80,
    changePercent: '+0.63%',
    isPositive: true,
  },
  {
    symbol: 'NIFTY 50',
    name: 'NSE Nifty 50',
    price: '24,854.05',
    change: +104.55,
    changePercent: '+0.42%',
    isPositive: true,
  },
  {
    symbol: 'FTSE 100',
    name: 'FTSE 100 London',
    price: '8,247.33',
    change: -14.20,
    changePercent: '-0.17%',
    isPositive: false,
  },
  {
    symbol: 'NIKKEI 225',
    name: 'Tokyo Nikkei',
    price: '38,981.75',
    change: +70.93,
    changePercent: '+0.18%',
    isPositive: true,
  },
  {
    symbol: 'BRENT CRUDE',
    name: 'Crude Oil (USD/bbl)',
    price: '73.06',
    change: -0.88,
    changePercent: '-1.19%',
    isPositive: false,
  },
  {
    symbol: 'GOLD',
    name: 'Spot Gold (USD/oz)',
    price: '2,721.40',
    change: +28.60,
    changePercent: '+1.06%',
    isPositive: true,
  },
  {
    symbol: 'BTC/USD',
    name: 'Bitcoin',
    price: '68,410.00',
    change: +1420.50,
    changePercent: '+2.12%',
    isPositive: true,
  },
  {
    symbol: 'USD/INR',
    name: 'US Dollar / Indian Rupee',
    price: '84.07',
    change: +0.02,
    changePercent: '+0.02%',
    isPositive: true,
  },
];

export function getUpdatedMarketData(current: MarketItem[] = INITIAL_MARKET_DATA): MarketItem[] {
  return current.map((item) => {
    // Subtle tick between -0.15% and +0.15%
    const deltaPercent = (Math.random() - 0.49) * 0.12;
    const currentPriceNum = parseFloat(item.price.replace(/,/g, ''));
    const newPriceNum = +(currentPriceNum * (1 + deltaPercent / 100)).toFixed(2);
    const newChange = +(item.change + deltaPercent * (currentPriceNum / 1000)).toFixed(2);
    const isPositive = newChange >= 0;
    const formattedPercent = (isPositive ? '+' : '') + ((newChange / currentPriceNum) * 100).toFixed(2) + '%';

    return {
      ...item,
      price: newPriceNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      change: newChange,
      changePercent: formattedPercent,
      isPositive,
    };
  });
}
