export interface PersonShare {
  index: number;
  name: string;
  amount: number;
  cents: number;
  isPaid: boolean;
  hasExtraPenny: boolean;
}

export interface SplitCalculation {
  occasion: string;
  subtotal: number;
  tipPercent: number;
  tipAmount: number;
  totalBill: number;
  totalCents: number;
  peopleCount: number;
  shares: PersonShare[];
  baseShareCents: number;
  remainderCents: number;
  currency: string;
  calculatedAt: string;
}

export interface StoredBillState {
  occasion: string;
  billAmount: string;
  peopleCount: string;
  tipPercent: number;
  customTip: string;
  currency: string;
  personNames: string[];
  paidStatus: Record<number, boolean>;
  paymentNote: string;
  hasCalculated: boolean;
}

export interface SplitHistoryItem {
  id: string;
  date: string;
  occasion: string;
  totalBill: number;
  peopleCount: number;
  currency: string;
  perPersonPreview: string;
}
