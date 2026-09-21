import api from './api';

export const turfService = {
  async getTurfs(filters = {}) {
    const params = new URLSearchParams();
    if (filters.location) params.append('location', filters.location);
    if (filters.sport && filters.sport !== 'All') params.append('sport', filters.sport);
    if (filters.min_price) params.append('min_price', filters.min_price);
    if (filters.max_price) params.append('max_price', filters.max_price);
    if (filters.min_rating) params.append('min_rating', filters.min_rating);
    if (filters.sort_by) params.append('sort_by', filters.sort_by);

    const res = await api.get(`/turfs?${params.toString()}`);
    return res.data;
  },

  async getTurfById(turfId) {
    const res = await api.get(`/turfs/${turfId}`);
    return res.data;
  },

  async getTurfSlots(turfId, dateStr) {
    const res = await api.get(`/turfs/${turfId}/slots?date=${dateStr}`);
    return res.data;
  },
};
