import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { turfService } from '../services/turfService';
import { SlotPicker } from '../components/SlotPicker';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Star,
  Trophy,
  CheckCircle,
  Calendar as CalendarIcon,
  ShieldCheck,
  Zap,
  ArrowLeft,
  Sparkles,
  Info
} from 'lucide-react';

export const TurfDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const todayStr = new Date().toISOString().split('T')[0];
  const initialDate = searchParams.get('date') || todayStr;

  const [turf, setTurf] = useState(null);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingTurf, setLoadingTurf] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');

  // 1. Fetch Turf Details
  useEffect(() => {
    setLoadingTurf(true);
    turfService.getTurfById(id)
      .then((data) => setTurf(data))
      .catch((err) => {
        console.error('Error loading turf:', err);
        setErrorNotice('Could not load turf details. Please try again.');
      })
      .finally(() => setLoadingTurf(false));
  }, [id]);

  // 2. Fetch Slots whenever date or turf id changes
  useEffect(() => {
    if (!id || !selectedDate) return;
    setLoadingSlots(true);
    setSelectedSlot(null); // Reset selected slot when date changes
    turfService.getTurfSlots(id, selectedDate)
      .then((data) => {
        setSlots(data.slots || []);
      })
      .catch((err) => {
        console.error('Error loading slots:', err);
      })
      .finally(() => setLoadingSlots(false));
  }, [id, selectedDate]);

  const handleBookNow = () => {
    if (!selectedSlot) {
      setErrorNotice('Please select an available time slot before booking.');
      return;
    }

    // Save booking intent and pass in location state
    const bookingPayload = {
      turf,
      date: selectedDate,
      slot: selectedSlot,
    };

    if (!isAuthenticated) {
      // Direct user to login, and then redirect to booking summary
      navigate(`/login?redirect=${encodeURIComponent(`/booking/summary?turf_id=${turf.id}&date=${selectedDate}&start=${selectedSlot.start_time}&end=${selectedSlot.end_time}`)}`, {
        state: bookingPayload,
      });
    } else {
      navigate('/booking/summary', { state: bookingPayload });
    }
  };

  if (loadingTurf) {
    return <LoadingSpinner message="Loading turf details..." />;
  }

  if (!turf) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-800">Turf Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The sports venue you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/turfs')}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Turfs
        </button>
      </div>
    );
  }

  // Parse facilities into array
  const facilitiesList = turf.facilities
    ? turf.facilities.split(',').map((f) => f.trim())
    : ['Parking', 'Drinking Water', 'Flood Lights', 'Washroom'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      {/* Hero Visual Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Turf Image */}
          <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden shadow-lg border border-slate-200">
            <img
              src={turf.image}
              alt={turf.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

            {/* Badges on Image */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {turf.sports && turf.sports.map((sp, idx) => (
                <span
                  key={idx}
                  className="bg-emerald-600/90 backdrop-blur-md text-white font-bold text-xs px-3 py-1 rounded-lg shadow-sm"
                >
                  {sp}
                </span>
              ))}
            </div>

            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 text-slate-900 shadow-md">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{Number(turf.rating).toFixed(1)} / 5.0</span>
            </div>

            {/* Bottom Title on Image */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{turf.name}</h1>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-300 font-medium mt-1">
                <MapPin className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{turf.location}</span>
              </div>
            </div>
          </div>

          {/* About Turf */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">About this Ground</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{turf.description}</p>
            </div>

            {/* Sports Supported */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Sports Supported</h3>
              <div className="flex flex-wrap gap-2">
                {turf.sports && turf.sports.map((sport, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200"
                  >
                    <Trophy className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{sport}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities & Facilities */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Ground Facilities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {facilitiesList.map((fac, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-semibold text-slate-700"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Booking Widget */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border-2 border-emerald-500/30 shadow-xl shadow-emerald-950/5 sticky top-24 space-y-6">
            {/* Price Header */}
            <div className="flex items-baseline justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Price per Hour</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-emerald-600">₹{turf.price_per_hour}</span>
                  <span className="text-xs font-semibold text-slate-500">/ 60 mins</span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                Instant Lock
              </span>
            </div>

            {/* Error banner */}
            {errorNotice && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorNotice}</span>
              </div>
            )}

            {/* Date Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-emerald-600" /> Select Match Date
              </label>
              <input
                type="date"
                min={todayStr}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setErrorNotice('');
                }}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:border-emerald-500 focus:bg-white outline-none cursor-pointer"
              />
            </div>

            {/* Slot Picker Component */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                <span>Select Available Slot</span>
                <span className="text-[11px] font-normal text-slate-500">1-hour slots</span>
              </label>
              <SlotPicker
                slots={slots}
                selectedSlot={selectedSlot}
                onSelectSlot={(slot) => {
                  setSelectedSlot(slot);
                  setErrorNotice('');
                }}
                loading={loadingSlots}
              />
            </div>

            {/* Selected Slot Summary Card */}
            {selectedSlot && (
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span>Selected Time:</span>
                  <span className="font-extrabold text-emerald-700">{selectedSlot.start_time} - {selectedSlot.end_time}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span>Total Amount:</span>
                  <span className="text-base font-black text-emerald-700">₹{turf.price_per_hour}</span>
                </div>
              </div>
            )}

            {/* Book Now Button */}
            <button
              onClick={handleBookNow}
              disabled={!selectedSlot}
              className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all ${
                selectedSlot
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 active:scale-[0.98] cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Book Now</span>
            </button>

            <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero cancellation fees up to match start</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
