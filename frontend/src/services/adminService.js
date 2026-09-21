import api from './api';

export const adminService = {
  async getDashboardStats() {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },

  async getAllTurfs() {
    const res = await api.get('/admin/turfs');
    return res.data;
  },

  async createTurf(turfData) {
    const res = await api.post('/admin/turfs', turfData);
    return res.data;
  },

  async updateTurf(turfId, turfData) {
    const res = await api.put(`/admin/turfs/${turfId}`, turfData);
    return res.data;
  },

  async deleteTurf(turfId) {
    const res = await api.delete(`/admin/turfs/${turfId}`);
    return res.data;
  },

  async getAllBookings() {
    const res = await api.get('/admin/bookings');
    return res.data;
  },

  async updateBookingStatus(bookingId, status) {
    const res = await api.put(`/admin/bookings/${bookingId}`, { status });
    return res.data;
  },
};
