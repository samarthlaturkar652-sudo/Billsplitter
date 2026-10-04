import React from 'react';
import { AlertCircle, XCircle } from 'lucide-react';

interface ValidationAlertProps {
  message: string;
}

export const ValidationAlert: React.FC<ValidationAlertProps> = ({ message }) => {
  return (
    <div
      role="alert"
      className="rounded-2xl p-4 bg-rose-50 border-2 border-rose-300 text-rose-950 shadow-sm transition-all animate-in fade-in slide-in-from-top-1 duration-200"
    >
      <div className="flex items-start space-x-3">
        <div className="p-1.5 rounded-xl bg-rose-200/80 text-rose-800 shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5 text-rose-700 stroke-[2.2]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-bold text-rose-900">
              Calculation Not Allowed
            </h4>
            <span className="text-[11px] font-semibold bg-rose-200/70 text-rose-800 px-2 py-0.2 rounded-full">
              No Result Shown
            </span>
          </div>
          <p className="text-sm text-rose-900 mt-1 font-medium leading-snug">
            {message}
          </p>
          <div className="mt-2 text-xs text-rose-800/90 bg-white/70 rounded-lg p-2 border border-rose-200">
            <strong>Requirements:</strong> The bill amount must be greater than 0, and the number of people must be at least 1. Empty, zero, or negative numbers cannot be calculated.
          </div>
        </div>
      </div>
    </div>
  );
};
