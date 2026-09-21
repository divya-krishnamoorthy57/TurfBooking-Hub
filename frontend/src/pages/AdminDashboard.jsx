import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Users,
  Compass,
  CalendarCheck,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  X,
  Search,
  Check
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [turfs, setTurfs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('turfs'); // 'turfs' or 'bookings'
  const [feedback, setFeedback] = useState(null);

  // Turf Modal State
  const [turfModalOpen, setTurfModalOpen] = useState(false);
  const [editingTurf, setEditingTurf] = useState(null);
  const [turfForm, setTurfForm] = useState({
    name: '',
    location: '',
    description: '',
    price_per_hour: 800,
    rating: 4.8,
    image: '',
    facilities: 'Parking, Flood Lights, Drinking Water, Washroom',
    sports: 'Football, Cricket'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, turfsData, bookingsData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAllTurfs(),
        adminService.getAllBookings(),
      ]);
      setStats(statsData);
      setTurfs(turfsData);
      setBookings(bookingsData);
    } catch (err) {
      console.error('Error loading admin data:', err);
      setFeedback({ type: 'error', text: 'Failed to load admin records' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreateTurf = () => {
    setEditingTurf(null);
    setTurfForm({
      name: '',
      location: 'Coimbatore',
      description: '',
      price_per_hour: 800,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
      facilities: 'Parking, Flood Lights, Drinking Water, Washroom',
      sports: 'Football, Cricket'
    });
    setTurfModalOpen(true);
  };

  const handleOpenEditTurf = (turf) => {
    setEditingTurf(turf);
    setTurfForm({
      name: turf.name,
      location: turf.location,
      description: turf.description,
      price_per_hour: turf.price_per_hour,
      rating: turf.rating,
      image: turf.image,
      facilities: turf.facilities || '',
      sports: (turf.sports || []).join(', ')
    });
    setTurfModalOpen(true);
  };

  const handleSaveTurf = async (e) => {
    e.preventDefault();
    try {
      const sportsArray = turfForm.sports.split(',').map((s) => s.trim()).filter(Boolean);
      const payload = {
        name: turfForm.name,
        location: turfForm.location,
        description: turfForm.description,
        price_per_hour: Number(turfForm.price_per_hour),
        rating: Number(turfForm.rating),
        image: turfForm.image,
        facilities: turfForm.facilities,
        sports: sportsArray,
      };

      if (editingTurf) {
        await adminService.updateTurf(editingTurf.id, payload);
        setFeedback({ type: 'success', text: `Turf "${payload.name}" updated successfully!` });
      } else {
        await adminService.createTurf(payload);
        setFeedback({ type: 'success', text: `Turf "${payload.name}" added successfully!` });
      }

      setTurfModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Error saving turf:', err);
      setFeedback({ type: 'error', text: err.friendlyMessage || 'Failed to save turf' });
    }
  };

  const handleDeleteTurf = async (turfId, turfName) => {
    if (!window.confirm(`Are you sure you want to delete "${turfName}"?`)) {
      return;
    }

    try {
      await adminService.deleteTurf(turfId);
      setFeedback({ type: 'success', text: `Turf "${turfName}" deleted.` });
      loadData();
    } catch (err) {
      console.error('Delete turf error:', err);
      setFeedback({ type: 'error', text: err.friendlyMessage || 'Failed to delete turf. Has active bookings.' });
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await adminService.updateBookingStatus(bookingId, newStatus);
      setFeedback({ type: 'success', text: `Booking #${bookingId} status updated to ${newStatus}` });
      loadData();
    } catch (err) {
      console.error('Status update error:', err);
      setFeedback({ type: 'error', text: err.friendlyMessage || 'Failed to update booking status' });
    }
  };

  if (loading && !stats) {
    return <LoadingSpinner message="Loading Admin Management Console..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full w-fit mb-2">
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor Coimbatore turf performance, manage venues, and control player reservations
          </p>
        </div>

        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="underline ml-4">Dismiss</button>
        </div>
      )}

      {/* METRIC CARDS (Total Users, Total Turfs, Total Bookings, Total Revenue) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Users */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
              Total Users
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1">{stats?.total_users || 0}</p>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Registered Players</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Turfs */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
              Total Turfs
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1">{stats?.total_turfs || 0}</p>
            <span className="text-[11px] text-teal-600 font-semibold mt-1 block">Coimbatore Venues</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
              Total Bookings
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1">{stats?.total_bookings || 0}</p>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
              {stats?.confirmed_bookings || 0} Confirmed
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
              Total Revenue
            </span>
            <p className="text-3xl font-black text-emerald-600 mt-1">₹{stats?.total_revenue || 0}</p>
            <span className="text-[11px] text-slate-500 font-semibold mt-1 block">Completed & Confirmed</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* TABS & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('turfs')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeView === 'turfs'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Manage Turfs ({turfs.length})</span>
          </button>

          <button
            onClick={() => setActiveView('bookings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeView === 'bookings'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Manage Bookings ({bookings.length})</span>
          </button>
        </div>

        {activeView === 'turfs' && (
          <button
            onClick={handleOpenCreateTurf}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-600/20 flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Turf</span>
          </button>
        )}
      </div>

      {/* VIEW 1: MANAGE TURFS */}
      {activeView === 'turfs' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Turf Details</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Sports</th>
                  <th className="px-6 py-4">Price / Hr</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {turfs.map((turf) => (
                  <tr key={turf.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={turf.image}
                          alt={turf.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{turf.name}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{turf.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-800">{turf.location}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {turf.sports && turf.sports.map((sp, idx) => (
                          <span key={idx} className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            {sp}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600">₹{turf.price_per_hour}</td>
                    <td className="px-6 py-4">★ {turf.rating}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditTurf(turf)}
                        className="p-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-lg transition"
                        title="Edit Turf"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTurf(turf.id, turf.name)}
                        className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-lg transition"
                        title="Delete Turf"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: MANAGE BOOKINGS */}
      {activeView === 'bookings' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Booking Code</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Turf Name</th>
                  <th className="px-6 py-4">Date & Slot</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Change Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-black text-slate-900">{b.booking_code}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{b.user_name || 'Player'}</p>
                      <p className="text-[11px] text-slate-400">{b.user_email || b.user_phone}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-800">{b.turf_name}</td>
                    <td className="px-6 py-4">
                      <p className="text-slate-900 font-bold">{b.booking_date}</p>
                      <p className="text-[11px] text-slate-500">{b.start_time} - {b.end_time}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600">₹{b.total_amount}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          b.status === 'CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : b.status === 'CANCELLED'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                      >
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD / EDIT TURF MODAL */}
      {turfModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">
                {editingTurf ? 'Edit Turf Details' : 'Add New Sports Turf'}
              </h3>
              <button
                onClick={() => setTurfModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTurf} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Turf Name</label>
                <input
                  type="text"
                  required
                  value={turfForm.name}
                  onChange={(e) => setTurfForm({ ...turfForm, name: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:border-emerald-500 outline-none"
                  placeholder="e.g., Coimbatore Sports Arena"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Location</label>
                  <input
                    type="text"
                    required
                    value={turfForm.location}
                    onChange={(e) => setTurfForm({ ...turfForm, location: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:border-emerald-500 outline-none"
                    placeholder="e.g., Saravanampatti, Coimbatore"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Price / Hour (₹)</label>
                  <input
                    type="number"
                    required
                    min="100"
                    step="50"
                    value={turfForm.price_per_hour}
                    onChange={(e) => setTurfForm({ ...turfForm, price_per_hour: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Description</label>
                <textarea
                  rows="3"
                  required
                  value={turfForm.description}
                  onChange={(e) => setTurfForm({ ...turfForm, description: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:border-emerald-500 outline-none"
                  placeholder="Describe surface, court size, and player amenities..."
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Available Sports (comma separated)</label>
                <input
                  type="text"
                  required
                  value={turfForm.sports}
                  onChange={(e) => setTurfForm({ ...turfForm, sports: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:border-emerald-500 outline-none"
                  placeholder="Football, Cricket, Badminton"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Image URL</label>
                <input
                  type="url"
                  required
                  value={turfForm.image}
                  onChange={(e) => setTurfForm({ ...turfForm, image: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:border-emerald-500 outline-none"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Facilities (comma separated)</label>
                <input
                  type="text"
                  value={turfForm.facilities}
                  onChange={(e) => setTurfForm({ ...turfForm, facilities: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:border-emerald-500 outline-none"
                  placeholder="Parking, Flood Lights, Washroom, Drinking Water"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setTurfModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  {editingTurf ? 'Update Turf' : 'Add Turf'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
