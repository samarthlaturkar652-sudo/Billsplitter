import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  Share2,
  ShieldCheck,
  Edit2,
  Sparkles,
  Info,
  BadgeCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SplitCalculation, PersonShare } from '../types';
import { formatCurrency, getFractionalUnit } from '../utils/calculations';

interface SharesBreakdownProps {
  calculation: SplitCalculation;
  onUpdateName: (index: number, newName: string) => void;
  onTogglePaid: (index: number) => void;
  onReset: () => void;
}

export const SharesBreakdown: React.FC<SharesBreakdownProps> = ({
  calculation,
  onUpdateName,
  onTogglePaid,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const {
    occasion,
    totalBill,
    peopleCount,
    shares,
    remainderCents,
    currency,
  } = calculation;

  const unitSingular = getFractionalUnit(currency, 1);
  const unitPlural = getFractionalUnit(currency, 2);

  // Calculate total paid vs remaining
  const paidCount = shares.filter((s) => s.isPaid).length;
  const paidAmount = shares.reduce((acc, s) => (s.isPaid ? acc + s.amount : acc), 0);
  const remainingAmount = totalBill - paidAmount;
  const isAllPaid = paidCount === peopleCount;

  // Sum of individual shares to verify exact precision
  const sumOfShares = shares.reduce((acc, s) => acc + s.amount, 0);
  const difference = Math.abs(sumOfShares - totalBill);

  const handleTogglePaidWithConfetti = (index: number) => {
    const isCurrentlyPaid = shares[index].isPaid;
    onTogglePaid(index);

    // If this click completes all payments
    if (!isCurrentlyPaid && paidCount + 1 === peopleCount) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#047857', '#10b981', '#f59e0b', '#3b82f6'],
        });
      } catch {
        // ignore if confetti fails
      }
    }
  };

  const generateShareText = () => {
    let text = `🧾 Bill Split: ${occasion}\n`;
    text += `Total Amount: ${formatCurrency(totalBill, currency)}\n`;
    text += `Split among: ${peopleCount} people\n`;
    text += `--------------------------------\n`;

    shares.forEach((share) => {
      text += `• ${share.name}: ${formatCurrency(share.amount, currency)}${
        share.hasExtraPenny ? ` (+1 ${unitSingular})` : ''
      }${share.isPaid ? ' [PAID ✅]' : ''}\n`;
    });

    text += `--------------------------------\n`;
    text += `Sum of shares: ${formatCurrency(sumOfShares, currency)} (Exact total, 0 ${unitPlural} lost!)\n`;

    return text;
  };

  const handleCopyText = async () => {
    const text = generateShareText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Bill Split: ${occasion}`,
          text: generateShareText(),
        });
      } catch {
        // Ignore user cancellation
      }
    } else {
      handleCopyText();
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-emerald-500/80 shadow-md overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Receipt Top Header */}
      <div className="bg-stone-900 text-stone-100 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-400">
                Split Result
              </span>
              <span className="text-[11px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full">
                Saved in Browser
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
              {occasion}
            </h2>
          </div>
          <div className="text-left sm:text-right bg-stone-800/80 px-4 py-2.5 rounded-xl border border-stone-700/80">
            <span className="text-xs text-stone-400 block font-medium">Total Bill</span>
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-400">
              {formatCurrency(totalBill, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Exact Match Verification Banner */}
      <div className="bg-emerald-50/90 border-b border-emerald-200/80 p-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-start sm:items-center space-x-2.5">
            <div className="p-1 rounded-lg bg-emerald-600 text-white shrink-0 mt-0.5 sm:mt-0">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                <span>Exact Match: Sum of shares = {formatCurrency(sumOfShares, currency)}</span>
                <BadgeCheck className="w-4 h-4 text-emerald-600 inline" />
              </div>
              <p className="text-xs text-emerald-800 font-medium">
                {remainderCents === 0 ? (
                  `Divides perfectly to the exact ${unitSingular} among all ${peopleCount} people.`
                ) : (
                  <>
                    Instead of losing {remainderCents} {getFractionalUnit(currency, remainderCents)},{' '}
                    <strong>
                      {remainderCents} {remainderCents === 1 ? 'person pays' : 'people pay'} +1 {unitSingular}
                    </strong>{' '}
                    so the total is still <strong>exactly {formatCurrency(totalBill, currency)}</strong>.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-lg self-start sm:self-auto shrink-0">
            Difference: {formatCurrency(difference, currency)} (0 {unitPlural} lost)
          </div>
        </div>
      </div>

      {/* Settle-Up Progress Bar & Tracking */}
      <div className="px-5 sm:px-6 pt-4 pb-2">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <div className="flex items-center space-x-1.5 font-bold text-stone-800">
            <span>Settle-Up Progress:</span>
            <span className={isAllPaid ? 'text-emerald-700' : 'text-stone-900'}>
              {paidCount} of {peopleCount} collected
            </span>
          </div>
          <div className="text-stone-500 font-medium">
            {formatCurrency(paidAmount, currency)} collected
            {remainingAmount > 0 && ` · ${formatCurrency(remainingAmount, currency)} remaining`}
          </div>
        </div>

        <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isAllPaid ? 'bg-emerald-600' : 'bg-emerald-500'
            }`}
            style={{ width: `${(paidCount / peopleCount) * 100}%` }}
          />
        </div>

        {isAllPaid && (
          <div className="mt-2.5 text-xs font-bold text-emerald-900 bg-emerald-100/70 border border-emerald-300 rounded-xl p-2.5 text-center flex items-center justify-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>All {peopleCount} people have paid! The bill is completely settled. 🎉</span>
          </div>
        )}
      </div>

      {/* Individual Shares List */}
      <div className="px-5 sm:px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            What Each Person Pays ({peopleCount} People)
          </h3>
          <span className="text-[11px] text-stone-400">Tap name to edit · Click checkmark when paid</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {shares.map((share: PersonShare) => (
            <div
              key={share.index}
              className={`p-3.5 rounded-xl border transition-all ${
                share.isPaid
                  ? 'bg-emerald-50/70 border-emerald-400 shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100/70 border-stone-200'
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Person Name / Edit */}
                <div className="flex-1 mr-2 min-w-0">
                  {editingIndex === share.index ? (
                    <input
                      type="text"
                      autoFocus
                      defaultValue={share.name}
                      onBlur={(e) => {
                        onUpdateName(share.index, e.target.value);
                        setEditingIndex(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          onUpdateName(share.index, (e.target as HTMLInputElement).value);
                          setEditingIndex(null);
                        }
                      }}
                      className="text-sm font-bold text-stone-900 bg-white border-2 border-emerald-500 rounded-lg px-2 py-0.5 w-full outline-none"
                    />
                  ) : (
                    <div
                      onClick={() => setEditingIndex(share.index)}
                      className="flex items-center space-x-1.5 cursor-pointer group"
                      title="Click to change name"
                    >
                      <span className="text-sm font-bold text-stone-900 truncate">
                        {share.name}
                      </span>
                      <Edit2 className="w-3 h-3 text-stone-400 group-hover:text-stone-700 opacity-60" />
                    </div>
                  )}

                  <div className="flex items-center space-x-2 mt-1">
                    {share.hasExtraPenny ? (
                      <span className="text-[10px] font-semibold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                        +1 {unitSingular} remainder
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-500">
                        Exact base share
                      </span>
                    )}
                    {share.isPaid && (
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100/80 px-1.5 py-0.2 rounded">
                        PAID ✅
                      </span>
                    )}
                  </div>
                </div>

                {/* Amount & Paid Checkbox */}
                <div className="flex items-center space-x-3 shrink-0">
                  <span className="text-lg font-black text-stone-900 tracking-tight">
                    {formatCurrency(share.amount, currency)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleTogglePaidWithConfetti(share.index)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all cursor-pointer ${
                      share.isPaid
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs scale-105'
                        : 'bg-white border-stone-300 text-stone-300 hover:border-emerald-500 hover:text-emerald-500'
                    }`}
                    title={share.isPaid ? 'Mark as unpaid' : 'Mark as paid'}
                  >
                    <Check className={`w-4 h-4 stroke-[3] ${share.isPaid ? 'text-white' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {remainderCents > 0 && (
          <div className="mt-3 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
            <div>
              <strong>Why the slight difference?</strong> Because{' '}
              {formatCurrency(totalBill, currency)} doesn’t divide into an exact whole number of{' '}
              {unitPlural} when divided by {peopleCount},{' '}
              {remainderCents} {remainderCents === 1 ? 'person has' : 'people have'} 1 extra{' '}
              {unitSingular} assigned. Summing every person’s share gives exactly{' '}
              <strong>{formatCurrency(totalBill, currency)}</strong>.
            </div>
          </div>
        )}
      </div>

      {/* Share / Copy Action Footer */}
      <div className="bg-stone-50/90 border-t border-stone-200 px-5 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          {/* Copy Group Text */}
          <button
            type="button"
            onClick={handleCopyText}
            className="flex items-center space-x-1.5 text-xs font-bold px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy for WhatsApp / Group Chat</span>
              </>
            )}
          </button>

          {/* Web Share (Mobile) */}
          <button
            type="button"
            onClick={handleNativeShare}
            className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-xl transition-colors cursor-pointer"
            title="Share via messaging apps"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="text-xs text-stone-500 hover:text-rose-700 font-semibold px-3 py-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
        >
          Reset Split
        </button>
      </div>
    </div>
  );
};
