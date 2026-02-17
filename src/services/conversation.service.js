import api from './api';

const conversationService = {
    /**
     * Get all conversations with filters
     */
    async getConversations(filters = {}) {
        const response = await api.get('/conversations', { params: filters });
        return response.data;
    },

    /**
     * Get single conversation by ID
     */
    async getConversation(id) {
        const response = await api.get(`/conversations/${id}`);
        return response.data;
    },

    /**
     * Create new conversation
     */
    async createConversation(data) {
        const response = await api.post('/conversations', data);
        return response.data;
    },

    /**
     * Send message in a conversation
     */
    async sendMessage(id, content, channel = 'email') {
        const response = await api.post(`/conversations/${id}/messages`, {
            content,
            channel
        });
        return response.data;
    },

    /**
     * Update conversation status
     */
    async updateStatus(id, status) {
        const response = await api.patch(`/conversations/${id}`, { status });
        return response.data;
    },

    /**
     * Mark conversation as read
     */
    async markAsRead(id) {
        const response = await api.post(`/conversations/${id}/read`);
        return response.data;
    }
};

export default conversationService;
