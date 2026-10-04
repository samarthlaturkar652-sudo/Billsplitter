import React from 'react';
import { Receipt, RotateCcw, History } from 'lucide-react';

interface HeaderProps {
  currency: string;
  onCurrencyChange: (c: string) => void;
  onReset: () => void;
  historyCount: number;
  onOpenHistory: () => void;
  hasActiveData: boolean;
}

const CURRENCIES = [
  { symbol: '$', code: 'USD', label: '$ USD' },
  { symbol: '€', code: 'EUR', label: '€ EUR' },
  { symbol: '£', code: 'GBP', label: '£ GBP' },
  { symbol: '₹', code: 'INR', label: '₹ INR' },
  { symbol: 'C$', code: 'CAD', label: 'C$ CAD' },
  { symbol: 'A$', code: 'AUD', label: 'A$ AUD' },
  { symbol: '¥', code: 'JPY', label: '¥ JPY' },
  { symbol: 'CHF', code: 'CHF', label: 'CHF' },
];

export const Header: React.FC<HeaderProps> = ({
  currency,
  onCurrencyChange,
  onReset,
  historyCount,
  onOpenHistory,
  hasActiveData,
}) => {
  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-sm">
            <Receipt className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-stone-900">SettleUp</span>
              <span className="text-xs bg-emerald-50 text-emerald-800 font-medium px-2 py-0.5 rounded-full border border-emerald-200">
                Penny-Perfect
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">Fast dinner bill splitter for friends</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Currency Selector */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-lg px-2.5 py-1.5 cursor-pointer outline-none focus:ring-2 focus:ring-emerald-600 transition-colors"
              title="Select Currency"
            >
              {CURRENCIES.map((curr) => (
                <option key={curr.code} value={curr.symbol}>
                  {curr.label}
                </option>
              ))}
            </select>
          </div>

          {/* History Button */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center space-x-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg px-2.5 py-1.5 transition-colors"
            title="View recent dinner splits"
          >
            <History className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="bg-emerald-700 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {historyCount}
              </span>
            )}
          </button>

          {/* Reset Button */}
          {hasActiveData && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center space-x-1.5 text-xs font-medium text-stone-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-stone-200 hover:border-rose-200 rounded-lg px-2.5 py-1.5 transition-colors"
              title="Clear current inputs and start fresh"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Bill</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
