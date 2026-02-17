import api from './api';

const bookingService = {
    /**
     * Get all bookings with optional filters
     */
    async getBookings(skip = 0, limit = 100, status = null) {
        const params = { skip, limit };
        if (status) {
            params.status = status;
        }
        const response = await api.get('/bookings', { params });
        return response.data;
    },

    /**
     * Get single booking by ID
     */
    async getBooking(id) {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
    },

    /**
     * Create new booking (triggers confirmation message)
     */
    async createBooking(bookingData) {
        const response = await api.post('/bookings', bookingData);
        return response.data;
    },

    /**
     * Update booking
     */
    async updateBooking(id, bookingData) {
        const response = await api.patch(`/bookings/${id}`, bookingData);
        return response.data;
    },

    /**
     * Send booking reminder manually
     */
    async sendReminder(id) {
        const response = await api.post(`/bookings/${id}/send-reminder`);
        return response.data;
    },

    /**
     * Send form reminder manually
     */
    async sendFormReminder(id) {
        const response = await api.post(`/bookings/${id}/send-form-reminder`);
        return response.data;
    },
};

export default bookingService;
