import React from 'react';
import { AlertCircle, SearchX } from 'lucide-react';

export const LoadingSpinner = ({ message = "Finding available turfs..." }) => (
  <div className="py-20 flex flex-col items-center justify-center gap-3">
    <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
    <p className="text-slate-600 font-semibold text-sm tracking-wide">{message}</p>
  </div>
);

export const EmptyState = ({
  icon: Icon = SearchX,
  title = "No results found",
  message = "No turfs found for your search.",
  action
}) => (
  <div className="py-16 px-4 text-center max-w-md mx-auto flex flex-col items-center justify-center">
    <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
    <p className="text-sm text-slate-500 mb-6">{message}</p>
    {action && <div>{action}</div>}
  </div>
);
