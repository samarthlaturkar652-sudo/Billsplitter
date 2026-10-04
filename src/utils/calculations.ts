import { PersonShare, SplitCalculation } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  billNum: number;
  peopleNum: number;
}

export function getFractionalUnit(currency: string, count: number = 1): string {
  if (currency === '₹') {
    return count === 1 ? 'paisa' : 'paise';
  }
  if (currency === '£') {
    return count === 1 ? 'penny' : 'pence';
  }
  return count === 1 ? 'cent' : 'cents';
}

export function validateBillInputs(billStr: string, peopleStr: string): ValidationResult {
  const trimmedBill = billStr.trim();
  const trimmedPeople = peopleStr.trim();

  // 1. Check if bill is empty
  if (!trimmedBill) {
    return {
      isValid: false,
      errorMessage: 'Please enter the total bill amount. It cannot be empty.',
      billNum: 0,
      peopleNum: 0,
    };
  }

  const billNum = parseFloat(trimmedBill);
  // 2. Check if bill is NaN
  if (isNaN(billNum)) {
    return {
      isValid: false,
      errorMessage: 'Please enter a valid numeric bill amount.',
      billNum: 0,
      peopleNum: 0,
    };
  }

  // 3. Check if bill is 0 or negative
  if (billNum <= 0) {
    return {
      isValid: false,
      errorMessage: 'Bill amount must be greater than zero (0). Zero or negative bills cannot be split.',
      billNum: 0,
      peopleNum: 0,
    };
  }

  // 4. Check if number of people is empty
  if (!trimmedPeople) {
    return {
      isValid: false,
      errorMessage: 'Please enter how many people are splitting the bill. It cannot be empty.',
      billNum,
      peopleNum: 0,
    };
  }

  const peopleNum = parseInt(trimmedPeople, 10);
  // 5. Check if people is NaN or <= 0
  if (isNaN(peopleNum) || peopleNum <= 0) {
    return {
      isValid: false,
      errorMessage: 'The number of people must be at least 1. Zero or negative values are not allowed.',
      billNum,
      peopleNum: 0,
    };
  }

  return {
    isValid: true,
    errorMessage: null,
    billNum,
    peopleNum,
  };
}

export function calculateExactSplit(
  occasion: string,
  subtotal: number,
  peopleCount: number,
  tipPercent: number = 0,
  currency: string = '₹',
  customNames: string[] = [],
  paidStatus: Record<number, boolean> = {}
): SplitCalculation {
  // Convert tip to exact cents/paise
  const tipAmount = tipPercent > 0 ? (Math.round(subtotal * tipPercent * 100) / 10000) : 0;
  const tipCents = Math.round(tipAmount * 100);
  const subtotalCents = Math.round(subtotal * 100);
  const totalCents = subtotalCents + tipCents;
  const totalBill = totalCents / 100;

  const baseShareCents = Math.floor(totalCents / peopleCount);
  const remainderCents = totalCents % peopleCount;

  const shares: PersonShare[] = [];

  for (let i = 0; i < peopleCount; i++) {
    const hasExtraPenny = i < remainderCents;
    const personCents = baseShareCents + (hasExtraPenny ? 1 : 0);
    const amount = personCents / 100;
    const name = customNames[i]?.trim() || `Person ${i + 1}`;

    shares.push({
      index: i,
      name,
      amount,
      cents: personCents,
      isPaid: Boolean(paidStatus[i]),
      hasExtraPenny,
    });
  }

  return {
    occasion: occasion.trim() || 'Dinner Bill',
    subtotal: subtotalCents / 100,
    tipPercent,
    tipAmount: tipCents / 100,
    totalBill,
    totalCents,
    peopleCount,
    shares,
    baseShareCents,
    remainderCents,
    currency,
    calculatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

export function formatCurrency(amount: number, currency: string = '₹'): string {
  return `${currency}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
