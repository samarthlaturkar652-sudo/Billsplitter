import React from 'react';
import {
  Users,
  Utensils,
  Plus,
  Minus,
  Calculator,
  Sparkles,
  Zap,
} from 'lucide-react';

interface BillFormProps {
  occasion: string;
  onOccasionChange: (val: string) => void;
  billAmount: string;
  onBillChange: (val: string) => void;
  peopleCount: string;
  onPeopleChange: (val: string) => void;
  currency: string;
  onCurrencyChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onLoadDemo: () => void;
  errorMessage: string | null;
}

const COMMON_OCCASIONS = [
  '🍕 Dinner with Friends',
  '☕ Cafe & Coffee',
  '🍻 Drinks Night',
  '🎂 Birthday Party',
  '🍱 Office Lunch',
];

const PARTY_PRESETS = [2, 3, 4, 5, 6, 8];

const POPULAR_CURRENCIES = [
  { symbol: '₹', label: '₹ INR' },
  { symbol: '$', label: '$ USD' },
  { symbol: '€', label: '€ EUR' },
  { symbol: '£', label: '£ GBP' },
];

export const BillForm: React.FC<BillFormProps> = ({
  occasion,
  onOccasionChange,
  billAmount,
  onBillChange,
  peopleCount,
  onPeopleChange,
  currency,
  onCurrencyChange,
  onSubmit,
  onLoadDemo,
  errorMessage,
}) => {
  const handlePeopleIncrement = (delta: number) => {
    const current = parseInt(peopleCount || '0', 10);
    const updated = Math.max(1, (isNaN(current) ? 1 : current) + delta);
    onPeopleChange(updated.toString());
  };

  const isBillError =
    errorMessage &&
    (billAmount.trim() === '' ||
      parseFloat(billAmount) <= 0 ||
      isNaN(parseFloat(billAmount)));

  const isPeopleError =
    errorMessage &&
    (peopleCount.trim() === '' ||
      parseInt(peopleCount, 10) <= 0 ||
      isNaN(parseInt(peopleCount, 10)));

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden"
    >
      {/* Top Banner / Quick Action */}
      <div className="bg-stone-50 border-b border-stone-200/80 px-5 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-xs text-stone-600 font-medium">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Enter 3 simple details to split instantly</span>
        </div>
        <button
          type="button"
          onClick={onLoadDemo}
          className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200/80 border border-emerald-300/80 px-2.5 py-1 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
          title="Load ₹100 ÷ 3 people example"
        >
          <Zap className="w-3.5 h-3.5 text-emerald-700" />
          <span>Try Demo: ₹100 ÷ 3 people</span>
        </button>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* 1. What the occasion is */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="occasion-input"
              className="block text-xs font-bold uppercase tracking-wider text-stone-700"
            >
              1. What is the occasion?
            </label>
            <span className="text-[11px] text-stone-400">e.g. Dinner, Drinks, Party</span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Utensils className="w-4 h-4" />
            </div>
            <input
              id="occasion-input"
              type="text"
              value={occasion}
              onChange={(e) => onOccasionChange(e.target.value)}
              placeholder="e.g. Dinner with Friends, Friday Drinks, Birthday Bash"
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 hover:bg-stone-100/50 focus:bg-white text-stone-900 border border-stone-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none"
            />
          </div>

          {/* Quick presets for occasion */}
          <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] text-stone-400 flex items-center gap-1 shrink-0">
              <Sparkles className="w-3 h-3 text-amber-500" /> Quick tags:
            </span>
            {COMMON_OCCASIONS.map((preset) => (
              <button
                type="button"
                key={preset}
                onClick={() => onOccasionChange(preset)}
                className="text-[11px] font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded-md transition-colors shrink-0 whitespace-nowrap cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* 2 & 3: Total Bill Amount & Number of People */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 2. Total Bill Amount */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="bill-amount"
                className="block text-xs font-bold uppercase tracking-wider text-stone-700"
              >
                2. Total Bill Amount <span className="text-rose-500">*</span>
              </label>
              {billAmount && (
                <button
                  type="button"
                  onClick={() => onBillChange('')}
                  className="text-[11px] text-stone-400 hover:text-stone-700 underline"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* Currency Selector */}
              <div className="relative">
                <select
                  value={currency}
                  onChange={(e) => onCurrencyChange(e.target.value)}
                  className="h-[46px] px-2.5 bg-stone-100 hover:bg-stone-200 font-bold text-stone-800 border border-stone-300 rounded-xl text-base outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                  title="Select currency symbol"
                >
                  {POPULAR_CURRENCIES.map((curr) => (
                    <option key={curr.symbol} value={curr.symbol}>
                      {curr.label}
                    </option>
                  ))}
                  <option value="¥">¥ JPY</option>
                  <option value="C$">C$ CAD</option>
                  <option value="A$">A$ AUD</option>
                  <option value="CHF">CHF</option>
                </select>
              </div>

              {/* Bill Input */}
              <div className="relative flex-1">
                <input
                  id="bill-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={billAmount}
                  onChange={(e) => onBillChange(e.target.value)}
                  placeholder="0.00"
                  className={`w-full px-4 py-2.5 text-stone-900 border rounded-xl text-xl font-bold tracking-tight transition-all outline-none ${
                    isBillError
                      ? 'border-rose-400 bg-rose-50/50 focus:ring-2 focus:ring-rose-500 focus:bg-white'
                      : 'border-stone-300 bg-stone-50 hover:bg-stone-100/50 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600'
                  }`}
                  autoComplete="off"
                />
              </div>
            </div>
            <p className="text-[11px] text-stone-500 mt-1.5">
              Enter total amount (must be greater than 0).
            </p>
          </div>

          {/* 3. How Many People Are Splitting */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="people-count"
                className="block text-xs font-bold uppercase tracking-wider text-stone-700"
              >
                3. Number of People <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-stone-400">Min: 1 person</span>
            </div>

            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Users className="w-4 h-4" />
              </div>
              <input
                id="people-count"
                type="number"
                min="1"
                step="1"
                value={peopleCount}
                onChange={(e) => onPeopleChange(e.target.value)}
                placeholder="e.g. 3"
                className={`w-full pl-10 pr-20 py-2.5 text-stone-900 border rounded-xl text-xl font-bold tracking-tight transition-all outline-none ${
                  isPeopleError
                    ? 'border-rose-400 bg-rose-50/50 focus:ring-2 focus:ring-rose-500 focus:bg-white'
                    : 'border-stone-300 bg-stone-50 hover:bg-stone-100/50 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600'
                }`}
              />
              <div className="absolute right-1.5 flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => handlePeopleIncrement(-1)}
                  className="w-8 h-8 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
                  title="Decrease party size"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handlePeopleIncrement(1)}
                  className="w-8 h-8 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
                  title="Increase party size"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Party Size buttons */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[11px] text-stone-400 shrink-0">Party:</span>
              {PARTY_PRESETS.map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => onPeopleChange(size.toString())}
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                    peopleCount === size.toString()
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer with "Calculate Split" */}
      <div className="bg-stone-50/90 px-5 sm:px-6 py-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-stone-500">
          Even when not divisible evenly, leftover paise/cents are distributed so the total matches exactly!
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-7 py-3 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-bold text-base rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Calculator className="w-5 h-5 stroke-[2.2]" />
          <span>Calculate Split</span>
        </button>
      </div>
    </form>
  );
};
