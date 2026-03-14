'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../../store/authStore';
import { apiClient } from '../../../lib/apiClient';

interface SubjectPageClientProps {
    subject: {
        id: number;
        title: string;
        description: string;
        price: number;
    };
}

export default function SubjectPageClient({ subject }: SubjectPageClientProps) {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [checkingEnrollment, setCheckingEnrollment] = useState(true);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

    const isPaid = Number(subject.price) > 0;
    const priceDisplay = isPaid ? `₹${Number(subject.price).toFixed(0)}` : 'Free';

    useEffect(() => {
        const checkEnrollment = async () => {
            if (!isAuthenticated) {
                setCheckingEnrollment(false);
                return;
            }
            try {
                const res = await apiClient.get(`/enrollments/check/${subject.id}`);
                setIsEnrolled(res.data.enrolled);
            } catch {
                // Silent fail – assume not enrolled
            } finally {
                setCheckingEnrollment(false);
            }
        };
        checkEnrollment();
    }, [isAuthenticated, subject.id]);

    const handleEnroll = async () => {
        if (!isAuthenticated) {
            // Save intended destination and redirect to login
            router.push(`/auth/login?redirect=/subjects/${subject.id}`);
            return;
        }

        setEnrolling(true);
        setMessage('');

        try {
            await apiClient.post('/enrollments/enroll', { subjectId: subject.id });
            setIsEnrolled(true);
            setMessage('🎉 Enrolled successfully! Click "Start Learning" to begin.');
            setMessageType('success');
        } catch (err: any) {
            setMessage(err.response?.data?.error || 'Enrollment failed. Please try again.');
            setMessageType('error');
        } finally {
            setEnrolling(false);
        }
    };

    const getButtonLabel = () => {
        if (!isAuthenticated) return isPaid ? `Buy & Enroll (${priceDisplay})` : 'Sign Up to Enroll Free';
        if (checkingEnrollment) return 'Checking...';
        if (isEnrolled) return 'Continue Learning';
        return isPaid ? `Buy & Enroll (${priceDisplay})` : 'Enroll Free Now';
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

                {/* Hero Banner */}
                <div className="h-64 bg-gradient-to-br from-indigo-700 to-violet-800 flex flex-col items-center justify-center p-8 gap-4">
                    <span className="text-xs uppercase font-bold tracking-widest text-indigo-200 bg-indigo-900 bg-opacity-50 px-3 py-1 rounded-full">
                        {isPaid ? 'Premium Course' : 'Free Course'}
                    </span>
                    <h1 className="text-4xl font-extrabold text-white text-center leading-tight">
                        {subject.title}
                    </h1>
                    <div className="text-3xl font-bold text-yellow-300">
                        {priceDisplay}
                    </div>
                </div>

                <div className="p-8 sm:p-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About this course</h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-8">
                        {subject.description}
                    </p>

                    {/* What you'll get */}
                    <div className="mb-8 bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                        <h3 className="text-lg font-semibold text-indigo-900 mb-3">What's Included:</h3>
                        <ul className="space-y-2">
                            {[
                                'Full video-based curriculum organised in chapters',
                                'Lifetime access after enrollment',
                                'Watch at your own pace – any device, anytime',
                                'Project-based learning with real examples',
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-2 text-indigo-800 text-sm">
                                    <svg className="w-4 h-4 text-indigo-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Status message */}
                    {message && (
                        <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${messageType === 'success'
                                ? 'bg-green-50 border border-green-200 text-green-700'
                                : 'bg-red-50 border border-red-200 text-red-700'
                            }`}>
                            {message}
                        </div>
                    )}

                    {/* Auth nudge for non-logged in users */}
                    {!isAuthenticated && (
                        <div className="mb-6 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                            <span className="font-semibold">Please sign in or create an account</span> to enroll in this course.{' '}
                            <Link href="/auth/register" className="underline font-medium">Register free →</Link>
                        </div>
                    )}

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        {isEnrolled ? (
                            <Link
                                href={`/learn/${subject.id}`}
                                className="w-full sm:w-auto px-8 py-4 text-base font-bold rounded-xl text-white bg-green-600 hover:bg-green-700 transition text-center shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                ▶ Start Learning
                            </Link>
                        ) : (
                            <button
                                onClick={handleEnroll}
                                disabled={enrolling || checkingEnrollment}
                                className="w-full sm:w-auto px-8 py-4 text-base font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition text-center shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                {enrolling ? 'Processing...' : getButtonLabel()}
                            </button>
                        )}
                        <Link
                            href="/"
                            className="w-full sm:w-auto text-center px-8 py-4 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition"
                        >
                            ← Back to Courses
                        </Link>
                    </div>

                    {/* Auth flow info */}
                    {!isAuthenticated && (
                        <p className="mt-6 text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link href={`/auth/login?redirect=/subjects/${subject.id}`} className="text-indigo-600 font-medium hover:underline">
                                Log in here
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
