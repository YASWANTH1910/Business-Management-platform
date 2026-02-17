import api from './api';

const contactService = {
    /**
     * Get all contacts with pagination
     */
    async getContacts(skip = 0, limit = 100) {
        const response = await api.get('/contacts', {
            params: { skip, limit },
        });
        return response.data;
    },

    /**
     * Get single contact by ID
     */
    async getContact(id) {
        const response = await api.get(`/contacts/${id}`);
        return response.data;
    },

    /**
     * Create new contact (triggers welcome message)
     */
    async createContact(contactData) {
        const response = await api.post('/contacts', contactData);
        return response.data;
    },

    /**
     * Update contact
     */
    async updateContact(id, contactData) {
        const response = await api.patch(`/contacts/${id}`, contactData);
        return response.data;
    },

    /**
     * Delete contact (admin only)
     */
    async deleteContact(id) {
        await api.delete(`/contacts/${id}`);
    },
};

export default contactService;
