import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  DollarSign
} from 'lucide-react';

export const BookingSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const stateData = location.state || {};
  const { turf, date, slot } = stateData;

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!turf || !date || !slot) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">No Booking In Progress</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          Please select a turf ground, date, and available time slot to view your booking summary.
        </p>
        <Link
          to="/turfs"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Browse Turfs
        </Link>
      </div>
    );
  }

  const handleConfirm = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const payload = {
        turf_id: turf.id,
        booking_date: date,
        start_time: slot.start_time,
        end_time: slot.end_time,
      };

      const bookingResponse = await bookingService.createBooking(payload);
      // Navigate to confirmation page
      navigate('/booking/confirmation', {
        state: { booking: bookingResponse, turf },
        replace: true,
      });
    } catch (err) {
      console.error('Booking creation error:', err);
      const msg = err.friendlyMessage || 'This slot has already been booked. Please choose another slot.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Back link */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Change Slot or Turf
        </button>
      </div>

      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Booking Summary</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your reservation details before confirming your game slot
        </p>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Booking Could Not Be Completed</p>
            <p className="text-xs mt-0.5">{errorMessage}</p>
            <div className="mt-3">
              <Link
                to={`/turfs/${turf.id}?date=${date}`}
                className="inline-flex items-center gap-1 text-xs font-bold underline text-rose-900 hover:text-rose-950"
              >
                Choose another time slot
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Review Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        {/* Turf Header */}
        <div className="p-6 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={turf.image}
              alt={turf.name}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs"
            />
            <div>
              <h2 className="text-lg font-bold text-slate-900">{turf.name}</h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{turf.location}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Match Rate</span>
            <div className="text-lg font-black text-emerald-600">₹{turf.price_per_hour} <span className="text-xs font-medium text-slate-400">/ hr</span></div>
          </div>
        </div>

        {/* Breakdown details */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Date</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{date}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Time Slot</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{slot.start_time} - {slot.end_time}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Duration</span>
              </div>
              <p className="text-sm font-bold text-slate-900">1 Hour (60 Mins)</p>
            </div>
          </div>

          {/* Customer info */}
          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900">Player Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-slate-500">Name:</span>
                <p className="font-bold text-slate-800">{user?.name}</p>
              </div>
              <div>
                <span className="text-slate-500">Email:</span>
                <p className="font-bold text-slate-800">{user?.email}</p>
              </div>
              <div>
                <span className="text-slate-500">Phone:</span>
                <p className="font-bold text-slate-800">{user?.phone}</p>
              </div>
            </div>
          </div>

          {/* Price Calculation Table */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Ground Rental (1 Hour)</span>
              <span>₹{turf.price_per_hour}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Convenience & Platform Fee</span>
              <span className="text-emerald-600 font-bold">FREE (₹0)</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
              <span>Total Amount Payable</span>
              <span className="text-xl text-emerald-600 font-black">₹{turf.price_per_hour}</span>
            </div>
          </div>

          {/* Confirm Button */}
          <div className="pt-4">
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-base rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Confirming Slot...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Confirm Booking</span>
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>MVP Simulation: No online card charge required. Slot will be locked in MySQL immediately.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
