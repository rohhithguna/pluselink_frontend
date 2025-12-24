import { create } from 'zustand';
import api from '../services/api';
import wsService from '../services/websocket';

const useAuthStore = create((set, get) => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),

    login: async (username, password) => {
        try {
            const response = await api.post('/auth/login', { username, password });
            const { access_token, user, first_login } = response.data;

            
            const userWithFlag = { ...user, first_login };

            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(userWithFlag));

            set({
                user: userWithFlag,
                token: access_token,
                isAuthenticated: true
            });

            
            wsService.connect(user.id, access_token);

            return { success: true, first_login };
        } catch (error) {
            
            if (error.response?.status === 403) {
                const detail = error.response?.data?.detail;
                if (detail && typeof detail === 'object' && detail.error === 'pending_approval') {
                    return {
                        success: false,
                        error: detail.message || 'Your account is awaiting admin approval.',
                        isPendingApproval: true
                    };
                }
            }
            return {
                success: false,
                error: error.response?.data?.detail || 'Login failed'
            };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        wsService.disconnect();

        set({
            user: null,
            token: null,
            isAuthenticated: false
        });
    },

    hasRole: (roles) => {
        const { user } = get();
        if (!user) return false;
        return roles.includes(user.role);
    },

    updateUser: (updates) => {
        const { user } = get();
        if (!user) return;

        const updatedUser = { ...user, ...updates };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
    },

    
    refreshUser: async () => {
        try {
            const response = await api.get('/users/me');
            const userData = response.data;

            localStorage.setItem('user', JSON.stringify(userData));
            set({ user: userData });

            return userData;
        } catch (error) {
            console.error('Failed to refresh user:', error);
            return null;
        }
    },

    
    verifyToken: async () => {
        const { token, logout } = get();
        if (!token) return false;

        try {
            const response = await api.get('/users/me');
            const userData = response.data;

            
            localStorage.setItem('user', JSON.stringify(userData));
            set({ user: userData, isAuthenticated: true });

            return true;
        } catch (error) {
            console.error('Token verification failed:', error);
            
            if (error.response?.status === 401 || error.response?.status === 403) {
                logout();
            }
            return false;
        }
    },
}));

export default useAuthStore;
