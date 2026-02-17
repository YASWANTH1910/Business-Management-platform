import api from './api';

const dashboardService = {
    /**
     * Get dashboard metrics
     */
    async getMetrics() {
        const response = await api.get('/dashboard');
        return response.data;
    },
};

export default dashboardService;
