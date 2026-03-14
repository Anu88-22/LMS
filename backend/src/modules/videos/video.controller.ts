import { Request, Response } from 'express';
import { getSubjectVideos } from './video.model';

export const getVideosForSubject = async (req: Request, res: Response) => {
    try {
        const subjectId = parseInt(req.params.subjectId as string, 10);
        const sections = await getSubjectVideos(subjectId);

        if (!sections || sections.length === 0) {
            return res.status(404).json({ error: 'No videos found for this subject' });
        }

        res.json(sections);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error loading videos' });
    }
};
