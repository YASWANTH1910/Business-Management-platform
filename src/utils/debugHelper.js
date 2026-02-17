/**
 * Debug Helper for API Integration
 * 
 * Run these commands in browser console to debug API issues
 */

// Check if token exists
export const debugToken = () => {
    const token = localStorage.getItem('careops_token');
    console.log('=== TOKEN DEBUG ===');
    console.log('Token exists:', !!token);
    console.log('Token length:', token?.length || 0);
    console.log('Token preview:', token?.substring(0, 50) + '...');
    console.log('Full token:', token);
    return token;
};

// Check if user exists
export const debugUser = () => {
    const userStr = localStorage.getItem('careops_user');
    const user = userStr ? JSON.parse(userStr) : null;
    console.log('=== USER DEBUG ===');
    console.log('User exists:', !!user);
    console.log('User data:', user);
    return user;
};

// Test API call manually
export const testDashboardAPI = async () => {
    const token = localStorage.getItem('careops_token');

    console.log('=== API TEST ===');
    console.log('Token:', token ? 'EXISTS' : 'MISSING');

    try {
        const response = await fetch('http://localhost:8000/dashboard', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);

        if (response.ok) {
            const data = await response.json();
            console.log('✅ SUCCESS! Data:', data);
            return data;
        } else {
            const error = await response.text();
            console.error('❌ ERROR:', error);
            return null;
        }
    } catch (error) {
        console.error('❌ NETWORK ERROR:', error);
        return null;
    }
};

// Clear everything and start fresh
export const resetAuth = () => {
    localStorage.clear();
    console.log('✅ All localStorage cleared. Refresh the page.');
};

// Auto-load in development
if (import.meta.env.DEV) {
    window.debugToken = debugToken;
    window.debugUser = debugUser;
    window.testDashboardAPI = testDashboardAPI;
    window.resetAuth = resetAuth;

    console.log(`
🐛 Debug Helper Loaded!

Commands:
- debugToken() - Check token status
- debugUser() - Check user data
- testDashboardAPI() - Test API call manually
- resetAuth() - Clear all auth data
  `);
}

export default {
    debugToken,
    debugUser,
    testDashboardAPI,
    resetAuth
};
