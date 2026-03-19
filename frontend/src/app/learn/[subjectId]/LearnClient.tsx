'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../../store/authStore';
import { apiClient } from '../../../lib/apiClient';
import CoursePlayer from './CoursePlayer';

interface Section {
    id: number;
    title: string;
    order_index: number;
    videos: any[];
}

interface Props {
    subjectId: string;
    subject: { id: number; title: string; description: string; price: number };
    sections: Section[];
}

export default function LearnClient({ subjectId, subject, sections }: Props) {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);

    useEffect(() => {
        const verifyAccess = async () => {
            if (!isAuthenticated) {
                setIsEnrolled(false);
                return;
            }
            try {
                const res = await apiClient.get(`/enrollments/check/${subjectId}`);
                setIsEnrolled(res.data.enrolled);
            } catch {
                setIsEnrolled(false);
            }
        };
        verifyAccess();
    }, [isAuthenticated, subjectId]);

    // Loading state
    if (isEnrolled === null) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center text-gray-500 animate-pulse text-lg">Checking access...</div>
            </div>
        );
    }

    // Not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-5">
                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
                    <p className="text-gray-500 mb-6">
                        Please sign in or create a free account to access <strong>{subject.title}</strong>.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Link
                            href={`/auth/login?redirect=/learn/${subjectId}`}
                            className="w-full px-6 py-3 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-semibold transition text-center"
                        >
                            Log in to Continue
                        </Link>
                        <Link
                            href={`/auth/register?redirect=/subjects/${subjectId}`}
                            className="w-full px-6 py-3 rounded-xl text-indigo-600 border border-indigo-200 hover:bg-indigo-50 font-medium transition text-center"
                        >
                            Create Free Account
                        </Link>
                        <Link href={`/subjects/${subjectId}`} className="text-sm text-gray-400 hover:text-gray-600 mt-2">
                            ← Back to course details
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Authenticated but NOT enrolled
    if (!isEnrolled) {
        const isPaid = Number(subject.price) > 0;
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-5">
                        <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Enrollment Required</h2>
                    <p className="text-gray-500 mb-2">
                        You need to enroll in <strong>{subject.title}</strong> to access the course content.
                    </p>
                    {isPaid && (
                        <p className="text-lg font-bold text-indigo-700 mb-6">
                            Price: ₹{Number(subject.price).toFixed(0)}
                        </p>
                    )}
                    <div className="flex flex-col gap-3">
                        <Link
                            href={`/subjects/${subjectId}`}
                            className="w-full px-6 py-3 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-semibold transition text-center"
                        >
                            {isPaid ? `Buy & Enroll – ₹${Number(subject.price).toFixed(0)}` : 'Enroll Free Now'}
                        </Link>
                        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 mt-2">
                            ← Browse all courses
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleFixDB = async () => {
        try {
            await apiClient.get('/setup-db');
            alert('🎉 Database setup complete! Please refresh the page to see the new videos.');
            window.location.reload();
        } catch (err: any) {
            console.error('Setup Error:', err);
            alert('Failed to update database automatically. You might need to visit your backend URL + /api/setup-db manually.');
        }
    };

    // Fully enrolled — show course player
    if (sections.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-gray-50">
                <div className="text-center bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Lessons Found</h2>
                    <p className="text-gray-500 mb-8">It looks like the live database hasn't been populated with videos for this course yet.</p>
                    <button 
                        onClick={handleFixDB}
                        className="w-full px-6 py-3 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-semibold transition shadow-lg mb-3"
                    >
                        🚀 Fix & Setup Database Now
                    </button>
                    <button 
                        onClick={async () => {
                            try {
                                await apiClient.get('/rename-to-courses');
                                alert('🎉 Lessons renamed to Course 1, Course 2, etc. successfully!');
                                window.location.reload();
                            } catch (err: any) {
                                console.error('Rename Error:', err);
                                alert('Failed to rename courses automtically. Visit your backend /api/rename-to-courses manually.');
                            }
                        }}
                        className="w-full px-6 py-3 rounded-xl text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 font-semibold transition"
                    >
                        ✨ Rename to Course 1, 2, 3...
                    </button>
                    <button 
                        onClick={async () => {
                            try {
                                await apiClient.get('/split-ultimate-course');
                                alert('🎉 Course split into 9 individual subjects successfully! Redirecting to home...');
                                window.location.href = '/';
                            } catch (err: any) {
                                console.error('Split Error:', err);
                                alert('Failed to split course. Visit /api/split-ultimate-course manually.');
                            }
                        }}
                        className="w-full px-6 py-3 rounded-xl text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 font-semibold transition mt-3"
                    >
                        ✂️ Split into Individual Courses
                    </button>
                    <Link href="/" className="inline-block mt-4 text-sm text-gray-400 hover:text-gray-600">
                        ← Go back to dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return <CoursePlayer subjectTitle={subject.title} sections={sections} />;
}
