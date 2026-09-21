import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Sparkles, ArrowRight } from 'lucide-react';

export const TurfCard = ({ turf }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col group">
      {/* Image Banner */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
        <img
          src={turf.image}
          alt={turf.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70"></div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md text-slate-800">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{Number(turf.rating).toFixed(1)}</span>
        </div>

        {/* Sports Chips on Image */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {turf.sports && turf.sports.map((sport, idx) => (
            <span
              key={idx}
              className="bg-emerald-600/90 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-md shadow-sm"
            >
              {sport}
            </span>
          ))}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors line-clamp-1">
              {turf.name}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-3">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{turf.location}</span>
          </div>

          <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed mb-4">
            {turf.description}
          </p>
        </div>

        {/* Card Footer: Price & View Details */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-emerald-600">₹{turf.price_per_hour}</span>
              <span className="text-slate-400 text-xs font-medium">/ hour</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Slots Available
            </div>
          </div>

          <Link
            to={`/turfs/${turf.id}`}
            className="inline-flex items-center gap-1.5 bg-slate-900 text-white hover:bg-emerald-600 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all group-hover:shadow-md"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
