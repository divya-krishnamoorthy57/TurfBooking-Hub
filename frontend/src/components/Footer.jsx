import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Shield, Award, Clock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-black text-lg">
                TB
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                TurfBooking<span className="text-emerald-400 ml-0.5">Hub</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Find Your Turf. Book Your Game. Coimbatore’s most dependable sports turf booking platform for football, cricket, badminton, and basketball.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Coimbatore, Tamil Nadu, India</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-emerald-400 transition">Home</Link></li>
              <li><Link to="/turfs" className="hover:text-emerald-400 transition">Explore All Turfs</Link></li>
              <li><Link to="/my-bookings" className="hover:text-emerald-400 transition">My Bookings</Link></li>
              <li><Link to="/login" className="hover:text-emerald-400 transition">Sign In / Register</Link></li>
            </ul>
          </div>

          {/* Col 3: Popular Sports in Coimbatore */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Sports Covered</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/turfs?sport=Football" className="hover:text-emerald-400 transition">Football Turfs</Link></li>
              <li><Link to="/turfs?sport=Cricket" className="hover:text-emerald-400 transition">Box Cricket Arenas</Link></li>
              <li><Link to="/turfs?sport=Badminton" className="hover:text-emerald-400 transition">Badminton Courts</Link></li>
              <li><Link to="/turfs?sport=Basketball" className="hover:text-emerald-400 transition">Basketball Courts</Link></li>
            </ul>
          </div>

          {/* Col 4: Platform Highlights */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Why Players Trust Us</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant live slot confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero double-booking guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified turf grounds & amenities</span>
              </div>
            </div>
            <div className="pt-2 text-xs text-slate-500 border-t border-slate-800">
              Support: support@turfbookinghub.com
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 TurfBooking Hub. All rights reserved. Built for Coimbatore Sports Community.</p>
          <p className="mt-2 sm:mt-0 font-medium">Find Your Turf. Book Your Game.</p>
        </div>
      </div>
    </footer>
  );
};
