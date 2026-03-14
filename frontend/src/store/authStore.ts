import { create } from 'zustand';
import Cookies from 'js-cookie';

interface AuthState {
    user: any | null;
    isAuthenticated: boolean;
    login: (token: string, userData: any) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: typeof window !== 'undefined' ? !!Cookies.get('accessToken') : false,
    login: (token, userData) => {
        Cookies.set('accessToken', token);
        set({ user: userData, isAuthenticated: true });
    },
    logout: () => {
        Cookies.remove('accessToken');
        set({ user: null, isAuthenticated: false });
    },
}));
