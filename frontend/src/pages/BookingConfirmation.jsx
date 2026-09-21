import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  ArrowRight,
  Download,
  Share2,
  ShieldCheck
} from 'lucide-react';

export const BookingConfirmation = () => {
  const location = useLocation();
  const booking = location.state?.booking;
  const turf = location.state?.turf;

  if (!booking) {
    return <Navigate to="/my-bookings" replace />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Success Badge */}
      <div className="text-center space-y-3 mb-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
          <CheckCircle className="w-9 h-9 stroke-[2.5]" />
        </div>
        <div className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider">
          Reservation Locked
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Booking Confirmed Successfully!
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Your turf slot has been secured in the database. Show your Booking ID at the venue counter upon arrival.
        </p>
      </div>

      {/* Ticket Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
        {/* Ticket Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Ticket className="w-6 h-6 text-emerald-300" />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300 block">
                Booking ID
              </span>
              <span className="text-xl font-black tracking-wider text-white">
                {booking.booking_code}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300 block">Status</span>
            <span className="text-xs font-extrabold bg-emerald-500/30 border border-emerald-400/40 text-white px-2.5 py-0.5 rounded-md">
              {booking.status}
            </span>
          </div>
        </div>

        {/* Ticket Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">{booking.turf_name}</h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{booking.turf_location}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Date
              </span>
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                {booking.booking_date}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Slot Time
              </span>
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                {booking.start_time} - {booking.end_time}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Amount Paid
              </span>
              <span className="text-base font-black text-emerald-600">
                ₹{booking.total_amount}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Booked By</span>
              <span className="font-semibold text-slate-800">{booking.user_name || 'Registered Player'}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
              <span className="font-semibold text-slate-800">Coimbatore, TN</span>
            </div>
          </div>
        </div>

        {/* Decorative Ticket Perforation dots */}
        <div className="flex justify-between items-center px-4 -my-3">
          <div className="w-6 h-6 rounded-full bg-slate-50 -ml-7 border-r border-slate-200"></div>
          <div className="flex-1 border-b-2 border-dashed border-slate-200 mx-2"></div>
          <div className="w-6 h-6 rounded-full bg-slate-50 -mr-7 border-l border-slate-200"></div>
        </div>

        {/* Ticket Footer Actions */}
        <div className="p-6 bg-slate-50/50 flex flex-col sm:flex-row gap-3">
          <Link
            to="/my-bookings"
            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold text-center shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5"
          >
            <span>View in My Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/turfs"
            className="py-3 px-5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold text-center transition"
          >
            Explore More Turfs
          </Link>
        </div>
      </div>
    </div>
  );
};
