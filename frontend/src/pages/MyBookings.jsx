import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { LoadingSpinner, EmptyState } from '../components/LoadingSpinner';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Ban,
  CheckCircle2,
  AlertTriangle,
  History,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'past', 'cancelled'
  const [cancellingId, setCancellingId] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  const fetchBookings = () => {
    setLoading(true);
    bookingService.getMyBookings()
      .then((data) => setBookings(data))
      .catch((err) => console.error('Failed to load user bookings:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  // Classify bookings
  const upcomingBookings = bookings.filter((b) => {
    return b.status === 'CONFIRMED' && b.booking_date >= todayStr;
  });

  const pastBookings = bookings.filter((b) => {
    return b.status === 'COMPLETED' || (b.status === 'CONFIRMED' && b.booking_date < todayStr);
  });

  const cancelledBookings = bookings.filter((b) => b.status === 'CANCELLED');

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? The slot will immediately become available for others.')) {
      return;
    }

    setCancellingId(bookingId);
    setActionNotice(null);

    try {
      await bookingService.cancelBooking(bookingId);
      setActionNotice({ type: 'success', text: 'Booking cancelled successfully. Slot has been freed.' });
      fetchBookings();
    } catch (err) {
      console.error('Cancel error:', err);
      setActionNotice({ type: 'error', text: err.friendlyMessage || 'Failed to cancel booking' });
    } finally {
      setCancellingId(null);
    }
  };

  const getDisplayedList = () => {
    if (activeTab === 'upcoming') return upcomingBookings;
    if (activeTab === 'past') return pastBookings;
    return cancelledBookings;
  };

  const displayedList = getDisplayedList();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Bookings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track and manage your scheduled match slots and past turf reservations
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Notice Message */}
      {actionNotice && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between ${
            actionNotice.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{actionNotice.text}</span>
          <button onClick={() => setActionNotice(null)} className="underline ml-4">Dismiss</button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'upcoming'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Upcoming Bookings</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'upcoming' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'}`}>
            {upcomingBookings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'past'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Past Bookings</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'past' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'}`}>
            {pastBookings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'cancelled'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Cancelled Bookings</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'cancelled' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'}`}>
            {cancelledBookings.length}
          </span>
        </button>
      </div>

      {/* Content List */}
      {loading ? (
        <LoadingSpinner message="Fetching your reservations..." />
      ) : displayedList.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="You don't have any bookings yet."
          message={
            activeTab === 'upcoming'
              ? "You have no upcoming match slots reserved. Ready to hit the ground?"
              : activeTab === 'past'
              ? "No past completed bookings found."
              : "No cancelled bookings."
          }
          action={
            <Link
              to="/turfs"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <span>Explore Turfs in Coimbatore</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {displayedList.map((item) => {
            const isUpcoming = activeTab === 'upcoming';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Left: Turf & ID */}
                <div className="flex items-center gap-4">
                  {item.turf_image ? (
                    <img
                      src={item.turf_image}
                      alt={item.turf_name}
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                      TB
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200">
                        {item.booking_code}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          item.status === 'CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : item.status === 'CANCELLED'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{item.turf_name}</h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item.turf_location}</span>
                    </div>
                  </div>
                </div>

                {/* Middle: Match Details */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t sm:border-t-0 sm:border-l border-slate-100 sm:pl-6 w-full md:w-auto">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Date</span>
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      {item.booking_date}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Time</span>
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      {item.start_time} - {item.end_time}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Total</span>
                    <span className="text-sm font-black text-emerald-600">
                      ₹{item.total_amount}
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="w-full md:w-auto flex md:flex-col items-center justify-end gap-2 border-t md:border-t-0 pt-4 md:pt-0">
                  {isUpcoming && (
                    <button
                      onClick={() => handleCancelBooking(item.id)}
                      disabled={cancellingId === item.id}
                      className="w-full sm:w-auto px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {cancellingId === item.id ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                          <span>Cancelling...</span>
                        </>
                      ) : (
                        <>
                          <Ban className="w-3.5 h-3.5" />
                          <span>Cancel Booking</span>
                        </>
                      )}
                    </button>
                  )}

                  <Link
                    to={`/turfs/${item.turf_id}`}
                    className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold text-center transition"
                  >
                    View Turf
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
