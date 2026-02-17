import api from './api';

const authService = {
    /**
     * Register a new user
     */
    async register(userData) {
        const response = await api.post('/auth/register', userData);
        if (response.data.access_token) {
            localStorage.setItem('careops_token', response.data.access_token);
            localStorage.setItem('careops_user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    /**
     * Login with email and password
     */
    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.access_token) {
            localStorage.setItem('careops_token', response.data.access_token);
            localStorage.setItem('careops_user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    /**
     * Logout - clear token and user data
     */
    logout() {
        localStorage.removeItem('careops_token');
        localStorage.removeItem('careops_user');
    },

    /**
     * Get current user from localStorage
     */
    getCurrentUser() {
        const userStr = localStorage.getItem('careops_user');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Get stored token
     */
    getToken() {
        return localStorage.getItem('careops_token');
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.getToken();
    },
};

export default authService;
