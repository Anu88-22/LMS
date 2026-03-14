import { notFound } from 'next/navigation';
import SubjectClient from './SubjectClient';

async function getSubject(id: string) {
    const res = await fetch(`http://localhost:5000/api/subjects/${id}`, { cache: 'no-store' });
    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Failed to fetch subject details');
    }
    return res.json();
}

export default async function SubjectDetailsPage({ params }: { params: Promise<{ subjectId: string }> }) {
    const { subjectId } = await params;
    const subject = await getSubject(subjectId);

    if (!subject) {
        notFound();
    }

    return <SubjectClient subject={subject} />;
}
