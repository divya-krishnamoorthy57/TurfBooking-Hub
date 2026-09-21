import api from './api';

export const bookingService = {
  async createBooking(bookingData) {
    const res = await api.post('/bookings', bookingData);
    return res.data;
  },

  async getMyBookings() {
    const res = await api.get('/bookings/my');
    return res.data;
  },

  async cancelBooking(bookingId) {
    const res = await api.put(`/bookings/${bookingId}/cancel`);
    return res.data;
  },
};
