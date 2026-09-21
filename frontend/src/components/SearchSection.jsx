import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Trophy, Calendar, Search } from 'lucide-react';

export const SearchSection = ({ initialLocation = '', initialSport = 'All', initialDate = '' }) => {
  const navigate = useNavigate();

  // Format today's date YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  const [location, setLocation] = useState(initialLocation);
  const [sport, setSport] = useState(initialSport);
  const [date, setDate] = useState(initialDate || todayStr);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.append('location', location.trim());
    if (sport && sport !== 'All') params.append('sport', sport);
    if (date) params.append('date', date);

    navigate(`/turfs?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl shadow-emerald-950/5 border border-emerald-100 p-4 sm:p-6 transition-all">
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
        {/* Location Field */}
        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Location
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 text-sm font-medium rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition cursor-pointer"
            >
              <option value="">All Coimbatore</option>
              <option value="Saravanampatti">Saravanampatti</option>
              <option value="Peelamedu">Peelamedu</option>
              <option value="RS Puram">RS Puram</option>
              <option value="Saibaba Colony">Saibaba Colony</option>
              <option value="Vadavalli">Vadavalli</option>
              <option value="Gandhipuram">Gandhipuram</option>
            </select>
          </div>
        </div>

        {/* Sport Field */}
        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Sport
          </label>
          <div className="relative">
            <Trophy className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 text-sm font-medium rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition cursor-pointer"
            >
              <option value="All">All Sports</option>
              <option value="Football">Football</option>
              <option value="Cricket">Cricket</option>
              <option value="Badminton">Badminton</option>
              <option value="Basketball">Basketball</option>
            </select>
          </div>
        </div>

        {/* Date Field */}
        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Date
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              min={todayStr}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 text-sm font-medium rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition cursor-pointer"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-full">
          <button
            type="submit"
            className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition"
          >
            <Search className="w-4 h-4" />
            <span>Find Turf</span>
          </button>
        </div>
      </form>
    </div>
  );
};
