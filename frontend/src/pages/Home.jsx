import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { turfService } from '../services/turfService';
import { SearchSection } from '../components/SearchSection';
import { TurfCard } from '../components/TurfCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  CalendarCheck2,
  Clock,
  ShieldCheck,
  Trophy,
  ArrowRight,
  Zap,
  MapPin,
  CheckCircle2,
  Users
} from 'lucide-react';

export const Home = () => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    turfService.getTurfs()
      .then((data) => setTurfs(data.slice(0, 3)))
      .catch((err) => console.error('Failed to load turfs:', err))
      .finally(() => setLoading(false));
  }, []);

  const sportsList = [
    {
      name: 'Football',
      icon: '⚽',
      tagline: '5-a-side & 7-a-side AstroTurf',
      count: '4 Arenas',
      bg: 'from-emerald-500/10 to-teal-500/10',
      border: 'border-emerald-200'
    },
    {
      name: 'Cricket',
      icon: '🏏',
      tagline: 'Box Cricket & Practice Pitches',
      count: '3 Arenas',
      bg: 'from-amber-500/10 to-orange-500/10',
      border: 'border-amber-200'
    },
    {
      name: 'Badminton',
      icon: '🏸',
      tagline: 'BWF Wooden & Synthetic Courts',
      count: '2 Arenas',
      bg: 'from-teal-500/10 to-cyan-500/10',
      border: 'border-teal-200'
    },
    {
      name: 'Basketball',
      icon: '🏀',
      tagline: 'All-Weather Acrylic Hardcourts',
      count: '2 Courts',
      bg: 'from-indigo-500/10 to-purple-500/10',
      border: 'border-indigo-200'
    },
  ];

  return (
    <div className="space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Subtle decorative background gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-100/50 via-emerald-50/20 to-transparent -z-10 rounded-b-[4rem] pointer-events-none"></div>
        <div className="absolute top-12 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute top-20 right-10 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Target Location Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Coimbatore's Premier Turf Network</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Find Your Turf.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500">
              Book Your Game.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Discover and book sports turfs near you in just a few clicks. Real-time slot availability, instant confirmation, and top-tier facilities.
          </p>

          {/* Hero Search Section */}
          <div className="mt-10">
            <SearchSection />
          </div>

          {/* Quick Metrics Under Search */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-slate-200/70">
            <div>
              <p className="text-2xl font-black text-slate-900">100%</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Instant Booking</p>
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-600">6+</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Arenas in Coimbatore</p>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">4</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Popular Sports</p>
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-600">4.8★</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Player Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR SPORTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
              What Do You Play?
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Popular Sports
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1 sm:mt-0">
            Choose your sport to explore specialized courts in Coimbatore
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {sportsList.map((sp, idx) => (
            <Link
              key={idx}
              to={`/turfs?sport=${sp.name}`}
              className={`p-6 rounded-2xl bg-white border ${sp.border} shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between group`}
            >
              <div>
                <div className="text-4xl mb-4 p-3 w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
                  {sp.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-600 transition-colors">
                  {sp.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{sp.tagline}</p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                <span>{sp.count}</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. POPULAR TURFS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
              Top Rated Grounds
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Popular Turfs in Coimbatore
            </h2>
          </div>
          <Link
            to="/turfs"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 mt-2 sm:mt-0 transition"
          >
            <span>View All Turfs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading popular turfs in Coimbatore..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {turfs.map((turf) => (
              <TurfCard key={turf.id} turf={turf} />
            ))}
          </div>
        )}
      </section>

      {/* 4. WHY TURFBOOKING HUB? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-900 rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-xl relative overflow-hidden">
          {/* Subtle glow accent */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full">
              The Platform Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-4">
              Why TurfBooking Hub?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2">
              Designed specifically for players and organizers looking for reliable match bookings without the phone-call hassle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">Easy Booking</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Book your favorite turf in less than 60 seconds with simple slot selection and quick confirmation.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">Real-Time Slot Availability</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Live calendar status guarantees you never clash with another team. What you see is guaranteed available.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">Secure Booking</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Bank-grade backend validation and database constraints prevent double booking and ensure instant reservation codes.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">Multiple Sports</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  From 7-a-side Football and Box Cricket to indoor Badminton and Basketball hardcourts across Coimbatore.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
