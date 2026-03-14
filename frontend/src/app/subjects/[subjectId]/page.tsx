import { notFound } from 'next/navigation';
import SubjectClient from './SubjectClient';

export const dynamic = 'force-dynamic';

async function getSubject(id: string) {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
    try {
        const res = await fetch(`${API_BASE_URL}/subjects/${id}`, { cache: 'no-store' });
        if (!res.ok) {
            if (res.status === 404) return null;
            return null; // Return null instead of throwing error if API is down
        }
        return res.json();
    } catch (err) {
        console.error('Failed to fetch subject details:', err);
        return null;
    }
}

export default async function SubjectDetailsPage({ params }: { params: Promise<{ subjectId: string }> }) {
    const { subjectId } = await params;
    const subject = await getSubject(subjectId);

    if (!subject) {
        notFound();
    }

    return <SubjectClient subject={subject} />;
}
