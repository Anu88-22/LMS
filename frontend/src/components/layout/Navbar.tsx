'use client';

import Link from 'next/link';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../lib/apiClient';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuthStore();

    const handleLogout = async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch (e) {
            console.error(e);
        } finally {
            logout();
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex-shrink-0 flex items-center">
                    <Link href="/">
                        <span className="text-xl font-bold text-indigo-600 cursor-pointer">LMS Platform</span>
                    </Link>
                </div>
                <nav className="flex space-x-6 items-center">
                    {isAuthenticated ? (
                        <>
                            <span className="text-sm font-medium text-gray-500 hidden sm:block">Welcome, {user?.name}</span>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
                                Log in
                            </Link>
                            <Link href="/auth/register" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow-sm">
                                Sign up
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
