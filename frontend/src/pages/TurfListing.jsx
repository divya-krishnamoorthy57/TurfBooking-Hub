import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { turfService } from '../services/turfService';
import { TurfCard } from '../components/TurfCard';
import { LoadingSpinner, EmptyState } from '../components/LoadingSpinner';
import { Filter, SlidersHorizontal, RotateCcw, Search, MapPin, Trophy, Star } from 'lucide-react';

export const TurfListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state from URL query or defaults
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [sport, setSport] = useState(searchParams.get('sport') || 'All');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '1200');
  const [minRating, setMinRating] = useState(searchParams.get('min_rating') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || '');

  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state with URL params changes
  useEffect(() => {
    setLocation(searchParams.get('location') || '');
    setSport(searchParams.get('sport') || 'All');
    setMaxPrice(searchParams.get('max_price') || '1200');
    setMinRating(searchParams.get('min_rating') || '');
    setSortBy(searchParams.get('sort_by') || '');
  }, [searchParams]);

  // Fetch turfs
  useEffect(() => {
    setLoading(true);
    const filters = {
      location: location.trim(),
      sport: sport,
      max_price: maxPrice ? Number(maxPrice) : undefined,
      min_rating: minRating ? Number(minRating) : undefined,
      sort_by: sortBy,
    };

    turfService.getTurfs(filters)
      .then((data) => setTurfs(data))
      .catch((err) => console.error('Failed to load turfs:', err))
      .finally(() => setLoading(false));
  }, [location, sport, maxPrice, minRating, sortBy]);

  const updateFilters = (newFilters) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'All') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params);
  };

  const handleReset = () => {
    setLocation('');
    setSport('All');
    setMaxPrice('1200');
    setMinRating('');
    setSortBy('');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Coimbatore Sports Hub</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Explore Turfs</h1>
          <p className="text-sm text-slate-500 mt-1">
            Discover {turfs.length} top-rated synthetic and natural sports grounds in Coimbatore
          </p>
        </div>

        {/* Sorting Dropdown & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                updateFilters({ sort_by: e.target.value });
              }}
              className="bg-transparent text-sm font-semibold text-slate-800 outline-none cursor-pointer py-1"
            >
              <option value="">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
        {/* FILTERS SIDEBAR (Desktop & Mobile Drawer) */}
        <aside className={`md:block ${showMobileFilters ? 'block mb-6' : 'hidden'} space-y-6`}>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Filter className="w-4 h-4 text-emerald-600" />
                <span>Filters</span>
              </div>
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Filter by Location */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Location in Coimbatore
              </label>
              <select
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  updateFilters({ location: e.target.value });
                }}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:border-emerald-500 outline-none"
              >
                <option value="">All Locations</option>
                <option value="Saravanampatti">Saravanampatti</option>
                <option value="Peelamedu">Peelamedu</option>
                <option value="RS Puram">RS Puram</option>
                <option value="Saibaba Colony">Saibaba Colony</option>
                <option value="Vadavalli">Vadavalli</option>
                <option value="Gandhipuram">Gandhipuram</option>
              </select>
            </div>

            {/* Filter by Sport */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-emerald-600" /> Sport
              </label>
              <div className="space-y-1.5">
                {['All', 'Football', 'Cricket', 'Badminton', 'Basketball'].map((sp) => (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => {
                      setSport(sp);
                      updateFilters({ sport: sp });
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition ${
                      sport === sp
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{sp}</span>
                    {sport === sp && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Max Price */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <span className="uppercase tracking-wider">Max Price / Hour</span>
                <span className="text-emerald-600 font-extrabold">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="400"
                max="1200"
                step="50"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  updateFilters({ max_price: e.target.value });
                }}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>₹400</span>
                <span>₹800</span>
                <span>₹1200</span>
              </div>
            </div>

            {/* Filter by Rating */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Minimum Rating
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: 'Any', value: '' },
                  { label: '4.5+ ★', value: '4.5' },
                  { label: '4.8+ ★', value: '4.8' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setMinRating(item.value);
                      updateFilters({ min_rating: item.value });
                    }}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                      minRating === item.value
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* TURF CARDS GRID */}
        <main className="md:col-span-3">
          {loading ? (
            <LoadingSpinner message="Finding available turfs in Coimbatore..." />
          ) : turfs.length === 0 ? (
            <EmptyState
              title="No turfs found for your search"
              message="Try adjusting your filters, location, or price range to find available sporting venues."
              action={
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-emerald-700 transition"
                >
                  Clear All Filters
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {turfs.map((turf) => (
                <TurfCard key={turf.id} turf={turf} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
