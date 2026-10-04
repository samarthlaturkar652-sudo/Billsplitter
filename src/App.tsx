/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { BillForm } from './components/BillForm';
import { SharesBreakdown } from './components/SharesBreakdown';
import { ValidationAlert } from './components/ValidationAlert';
import { HistoryModal } from './components/HistoryModal';
import {
  validateBillInputs,
  calculateExactSplit,
  formatCurrency,
} from './utils/calculations';
import {
  SplitCalculation,
  StoredBillState,
  SplitHistoryItem,
} from './types';
import { Users, ReceiptText, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'settleup_bill_v2';
const HISTORY_KEY = 'settleup_history_v2';

export default function App() {
  // 1. Core 3 Inputs
  const [occasion, setOccasion] = useState<string>('');
  const [billAmount, setBillAmount] = useState<string>('');
  const [peopleCount, setPeopleCount] = useState<string>('3');

  // Currency
  const [currency, setCurrency] = useState<string>('₹');

  // Per-person customizations (names & paid status)
  const [personNames, setPersonNames] = useState<string[]>([]);
  const [paidStatus, setPaidStatus] = useState<Record<number, boolean>>({});

  // Calculation & Validation State
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // History state
  const [history, setHistory] = useState<SplitHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Load from LocalStorage on mount (Persistent across reload)
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsed: StoredBillState = JSON.parse(savedState);
        setOccasion(parsed.occasion || '');
        setBillAmount(parsed.billAmount || '');
        setPeopleCount(parsed.peopleCount || '3');
        setCurrency(parsed.currency || '₹');
        setPersonNames(Array.isArray(parsed.personNames) ? parsed.personNames : []);
        setPaidStatus(parsed.paidStatus || {});

        // If it was previously calculated, re-validate
        if (parsed.hasCalculated) {
          const validation = validateBillInputs(parsed.billAmount, parsed.peopleCount);
          if (validation.isValid) {
            setHasCalculated(true);
            setValidationError(null);
          } else {
            // Bad stored inputs: show no result and clear calculated flag
            setHasCalculated(false);
            setValidationError(validation.errorMessage);
          }
        }
      }

      const savedHistory = localStorage.getItem(HISTORY_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.warn('Error reading stored state:', e);
    }
  }, []);

  // Save state to LocalStorage on changes
  useEffect(() => {
    try {
      const stateToStore: StoredBillState = {
        occasion,
        billAmount,
        peopleCount,
        tipPercent: 0,
        customTip: '',
        currency,
        personNames,
        paidStatus,
        paymentNote: '',
        hasCalculated,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore));
    } catch (e) {
      console.warn('Error saving state:', e);
    }
  }, [
    occasion,
    billAmount,
    peopleCount,
    currency,
    personNames,
    paidStatus,
    hasCalculated,
  ]);

  // Validation
  const currentValidation = useMemo(() => {
    return validateBillInputs(billAmount, peopleCount);
  }, [billAmount, peopleCount]);

  // Exact Calculation (Only computed if valid AND user clicked Calculate Split)
  const calculationResult: SplitCalculation | null = useMemo(() => {
    if (!hasCalculated) return null;
    if (!currentValidation.isValid) return null;

    return calculateExactSplit(
      occasion,
      currentValidation.billNum,
      currentValidation.peopleNum,
      0, // 0 tip for simple exact bill split
      currency,
      personNames,
      paidStatus
    );
  }, [
    hasCalculated,
    currentValidation,
    occasion,
    currency,
    personNames,
    paidStatus,
  ]);

  // Handle Calculate Split Button
  const handleCalculateSplit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = validateBillInputs(billAmount, peopleCount);

    if (!val.isValid) {
      // Must show error message and NO result if empty, zero, or negative
      setValidationError(val.errorMessage);
      setHasCalculated(false);
      return;
    }

    setValidationError(null);
    setHasCalculated(true);

    // Save to history list automatically
    const newItem: SplitHistoryItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }),
      occasion: occasion.trim() || 'Dinner Bill',
      totalBill: val.billNum,
      peopleCount: val.peopleNum,
      currency,
      perPersonPreview: formatCurrency(val.billNum / val.peopleNum, currency),
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev.filter((h) => h.id !== newItem.id)].slice(0, 20);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Quick Demo: ₹100 ÷ 3 people
  const handleLoadDemo = () => {
    setOccasion('Friday Dinner with Friends');
    setBillAmount('100');
    setPeopleCount('3');
    setCurrency('₹');
    setPersonNames(['Alex', 'Sam', 'Jordan']);
    setPaidStatus({});
    setValidationError(null);
    setHasCalculated(true);
  };

  // Inline rename
  const handleUpdateName = (index: number, newName: string) => {
    const updated = [...personNames];
    updated[index] = newName.trim();
    setPersonNames(updated);
  };

  // Toggle paid checkbox
  const handleTogglePaid = (index: number) => {
    setPaidStatus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Reset Split
  const handleReset = () => {
    setOccasion('');
    setBillAmount('');
    setPeopleCount('3');
    setPersonNames([]);
    setPaidStatus({});
    setHasCalculated(false);
    setValidationError(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      // ignore
    }
  };

  const handleLoadHistoryItem = (item: SplitHistoryItem) => {
    setOccasion(item.occasion);
    setBillAmount(item.totalBill.toString());
    setPeopleCount(item.peopleCount.toString());
    setCurrency(item.currency);
    setPersonNames([]);
    setPaidStatus({});
    setHasCalculated(true);
    setValidationError(null);
  };

  const hasActiveData = Boolean(
    billAmount.trim() || occasion.trim() || hasCalculated
  );

  return (
    <div className="min-h-screen bg-stone-100/80 text-stone-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Header Navigation */}
      <Header
        currency={currency}
        onCurrencyChange={setCurrency}
        onReset={handleReset}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        hasActiveData={hasActiveData}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Page Title & Explanation */}
        <div className="text-center sm:text-left pb-1 border-b border-stone-200">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
                Split the Bill Fast & Fair
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
                Enter what the occasion is, the bill amount, and party size. Divides every single paisa/cent so the shares add up exactly to the total!
              </p>
            </div>
            {hasCalculated && calculationResult && (
              <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs self-center">
                <ReceiptText className="w-4 h-4 text-emerald-600" />
                <span>Saved & Active</span>
              </div>
            )}
          </div>
        </div>

        {/* 3 Core Inputs Bill Form */}
        <BillForm
          occasion={occasion}
          onOccasionChange={(val) => {
            setOccasion(val);
          }}
          billAmount={billAmount}
          onBillChange={(val) => {
            setBillAmount(val);
            // If user changes bill, if it became invalid, clear calculated state
            const check = validateBillInputs(val, peopleCount);
            if (!check.isValid && hasCalculated) {
              setHasCalculated(false);
              setValidationError(check.errorMessage);
            }
          }}
          peopleCount={peopleCount}
          onPeopleChange={(val) => {
            setPeopleCount(val);
            const check = validateBillInputs(billAmount, val);
            if (!check.isValid && hasCalculated) {
              setHasCalculated(false);
              setValidationError(check.errorMessage);
            }
          }}
          currency={currency}
          onCurrencyChange={setCurrency}
          onSubmit={handleCalculateSplit}
          onLoadDemo={handleLoadDemo}
          errorMessage={validationError}
        />

        {/* Validation Error Banner (When bill or people is empty, zero or negative) */}
        {validationError && (
          <ValidationAlert message={validationError} />
        )}

        {/* The Exact Split Result View */}
        {hasCalculated && calculationResult && !validationError && (
          <SharesBreakdown
            calculation={calculationResult}
            onUpdateName={handleUpdateName}
            onTogglePaid={handleTogglePaid}
            onReset={handleReset}
          />
        )}

        {/* Initial Prompt State */}
        {!hasCalculated && !validationError && (
          <div className="bg-white/70 rounded-2xl border border-dashed border-stone-300 p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-stone-800">
              No Cent or Paisa Left Behind
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Fill in the occasion, bill, and number of people, then click <strong>Calculate Split</strong>. If ₹100 is split among 3 people, one person pays ₹33.34 and two pay ₹33.33 so the sum is exactly ₹100.
            </p>
          </div>
        )}
      </main>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onLoadItem={handleLoadHistoryItem}
      />

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white/70 py-4 text-center text-xs text-stone-500">
        <p>SettleUp · Enter bill → Split correctly → Handle bad inputs → Remember on refresh</p>
      </footer>
    </div>
  );
}
