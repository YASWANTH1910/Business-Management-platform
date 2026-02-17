import api from './api';

export default {
    /**
     * Get all form templates
     */
    async getForms() {
        const response = await api.get('/forms/templates');
        return response.data;
    },

    /**
     * Create new form template
     */
    async createForm(data) {
        const response = await api.post('/forms/templates', data);
        return response.data;
    },

    /**
     * Update existing form template
     */
    async updateForm(id, data) {
        const response = await api.put(`/forms/templates/${id}`, data);
        return response.data;
    },

    /**
     * Delete form template
     */
    async deleteForm(id) {
        const response = await api.delete(`/forms/templates/${id}`);
        return response.data;
    },

    /**
     * Get all form submissions
     */
    async getSubmissions(filters = {}) {
        const response = await api.get('/forms/submissions', { params: filters });
        return response.data;
    },

    /**
     * Get single submission
     */
    async getSubmission(id) {
        const response = await api.get(`/forms/submissions/${id}`);
        return response.data;
    },

    /**
     * Submit a form response
     */
    async submitForm(data) {
        const response = await api.post('/forms/submissions', data);
        return response.data;
    }
};
