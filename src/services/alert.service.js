import api from './api';

const alertService = {
    /**
     * Get all alerts with filters
     */
    async getAlerts(skip = 0, limit = 100, includeDismissed = false, alertType = null, severity = null) {
        const params = { skip, limit, include_dismissed: includeDismissed };
        if (alertType) {
            params.alert_type = alertType;
        }
        if (severity) {
            params.severity = severity;
        }
        const response = await api.get('/alerts', { params });
        return response.data;
    },

    /**
     * Get single alert by ID
     */
    async getAlert(id) {
        const response = await api.get(`/alerts/${id}`);
        return response.data;
    },

    /**
     * Get active alert count
     */
    async getActiveCount() {
        const response = await api.get('/alerts/count');
        return response.data.active_count;
    },

    /**
     * Dismiss an alert
     */
    async dismissAlert(id) {
        const response = await api.patch(`/alerts/${id}/dismiss`);
        return response.data;
    },
};

export default alertService;
