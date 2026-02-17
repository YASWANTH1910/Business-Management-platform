/**
 * Token Helper for Testing
 * 
 * Since we're skipping the login page for now, use this helper to manually
 * set your JWT token for testing the API integration.
 * 
 * Usage:
 * 1. Get a token from Swagger UI (http://localhost:8000/docs)
 * 2. Call setToken() in browser console or in your code
 * 3. Refresh the page - the token will be used for all API calls
 */

export const setToken = (token) => {
    localStorage.setItem('careops_token', token);
    console.log('✅ Token saved! Refresh the page to use it.');
};

export const setMockUser = (user = { id: 2, name: 'Test User', email: 'test@example.com', role: 'admin' }) => {
    localStorage.setItem('careops_user', JSON.stringify(user));
    console.log('✅ User saved!', user);
};

export const clearAuth = () => {
    localStorage.removeItem('careops_token');
    localStorage.removeItem('careops_user');
    console.log('✅ Auth cleared!');
};

export const getToken = () => {
    return localStorage.getItem('careops_token');
};

export const getUser = () => {
    const userStr = localStorage.getItem('careops_user');
    return userStr ? JSON.parse(userStr) : null;
};

// Auto-setup for development
if (import.meta.env.DEV) {
    window.setToken = setToken;
    window.setMockUser = setMockUser;
    window.clearAuth = clearAuth;
    window.getToken = getToken;
    window.getUser = getUser;

    console.log(`
🔧 Token Helper Loaded!

To set your token for testing:
1. Login at http://localhost:8000/docs
2. Copy your access_token
3. Run in console: setToken('your_token_here')
4. Refresh the page

Commands available:
- setToken(token) - Set JWT token
- setMockUser(user) - Set user data
- clearAuth() - Clear all auth data
- getToken() - View current token
- getUser() - View current user
  `);
}

export default {
    setToken,
    setMockUser,
    clearAuth,
    getToken,
    getUser
};
