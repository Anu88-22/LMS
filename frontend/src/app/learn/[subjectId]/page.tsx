import { notFound } from 'next/navigation';
import LearnClient from './LearnClient';

async function getSubject(id: string) {
    const res = await fetch(`http://localhost:5000/api/subjects/${id}`, { cache: 'no-store' });
    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Failed to fetch subject details');
    }
    return res.json();
}

async function getSubjectVideos(id: string) {
    const res = await fetch(`http://localhost:5000/api/videos/subject/${id}`, { cache: 'no-store' });
    if (!res.ok) {
        if (res.status === 404) return [];
        throw new Error('Failed to fetch subject videos');
    }
    return res.json();
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
