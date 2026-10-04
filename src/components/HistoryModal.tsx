import React from 'react';
import { X, Trash2, Calendar, Users, DollarSign, ExternalLink } from 'lucide-react';
import { SplitHistoryItem } from '../types';
import { formatCurrency } from '../utils/calculations';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: SplitHistoryItem[];
  onClearHistory: () => void;
  onLoadItem: (item: SplitHistoryItem) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onLoadItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="font-bold text-stone-900 text-base">Dinner Split History</h3>
            <p className="text-xs text-stone-500">Saved past splits on this device</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="py-12 text-center">
              <DollarSign className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-700">No saved dinner splits yet</p>
              <p className="text-xs text-stone-400 mt-1">
                When you split a bill, click "Save Split" to keep a record here.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-stone-200 hover:border-stone-300 bg-stone-50/50 hover:bg-stone-50 transition-all flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-stone-900 text-sm truncate">
                      {item.occasion}
                    </span>
                    <span className="text-[11px] text-stone-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-stone-600 mt-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-stone-400" />
                      {item.peopleCount} people
                    </span>
                    <span>·</span>
                    <span className="font-medium text-emerald-800">
                      Total: {formatCurrency(item.totalBill, item.currency)}
                    </span>
                    <span>·</span>
                    <span className="text-stone-500">
                      ~{item.perPersonPreview} each
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onLoadItem(item);
                    onClose();
                  }}
                  className="px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 flex items-center space-x-1 shrink-0 transition-colors"
                  title="Load into calculator"
                >
                  <span>View</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        {history.length > 0 && (
          <div className="px-5 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
            <button
              type="button"
              onClick={onClearHistory}
              className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
