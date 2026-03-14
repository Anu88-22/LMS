import { notFound } from 'next/navigation';
import LearnClient from './LearnClient';

export const dynamic = 'force-dynamic';

async function getSubject(id: string) {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
    try {
        const res = await fetch(`${API_BASE_URL}/subjects/${id}`, { cache: 'no-store' });
        if (!res.ok) {
            if (res.status === 404) return null;
            return null;
        }
        return res.json();
    } catch (err) {
        console.error('Failed to fetch subject details:', err);
        return null;
    }
}

async function getSubjectVideos(id: string) {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
    try {
        const res = await fetch(`${API_BASE_URL}/videos/subject/${id}`, { cache: 'no-store' });
        if (!res.ok) {
            if (res.status === 404) return [];
            return [];
        }
        return res.json();
    } catch (err) {
        console.error('Failed to fetch subject videos:', err);
        return [];
    }
}

export default async function LearnPage({ params }: { params: Promise<{ subjectId: string }> }) {
    const { subjectId } = await params;

    const [subject, sections] = await Promise.all([
        getSubject(subjectId),
        getSubjectVideos(subjectId)
    ]);

    if (!subject) {
        notFound();
    }

    return (
        <LearnClient
            subjectId={subjectId}
            subject={subject}
            sections={sections}
        />
    );
}
