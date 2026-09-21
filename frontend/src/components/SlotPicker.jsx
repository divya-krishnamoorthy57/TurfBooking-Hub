import React from 'react';
import { Clock, CheckCircle2, Ban } from 'lucide-react';

export const SlotPicker = ({ slots = [], selectedSlot, onSelectSlot, loading = false }) => {
  if (loading) {
    return (
      <div className="py-8 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium">Checking live slot availability...</p>
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        <p className="text-sm">No slot information available for this date.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-white border border-slate-300"></span>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-emerald-600"></span>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-slate-200 border border-slate-300"></span>
          <span className="text-slate-400">Booked (Unavailable)</span>
        </div>
      </div>

      {/* Slot Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {slots.map((slot, index) => {
          const isSelected =
            selectedSlot &&
            selectedSlot.start_time === slot.start_time &&
            selectedSlot.end_time === slot.end_time;

          const isBooked = !slot.is_available;

          return (
            <button
              key={index}
              type="button"
              disabled={isBooked}
              onClick={() => onSelectSlot(slot)}
              className={`p-3.5 rounded-xl border text-sm font-semibold flex items-center justify-between transition-all duration-200 ${
                isBooked
                  ? 'bg-slate-100/80 border-slate-200 text-slate-400 cursor-not-allowed opacity-75'
                  : isSelected
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-[1.02]'
                  : 'bg-white border-slate-200/90 text-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50 active:scale-[0.99] cursor-pointer shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${isSelected ? 'text-white' : isBooked ? 'text-slate-400' : 'text-emerald-600'}`} />
                <span>{slot.start_time} - {slot.end_time}</span>
              </div>

              {isBooked ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                  <Ban className="w-3 h-3" /> Booked
                </span>
              ) : isSelected ? (
                <CheckCircle2 className="w-4 h-4 text-white" />
              ) : (
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Available
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
