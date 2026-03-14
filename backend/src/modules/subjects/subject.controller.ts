import { Request, Response } from 'express';
import { getAllSubjects, getSubjectById } from './subject.model';

export const getSubjects = async (req: Request, res: Response) => {
    try {
        const subjects = await getAllSubjects();
        res.json(subjects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error loading subjects' });
    }
};

export const getSubject = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        const subject = await getSubjectById(id);
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        res.json(subject);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error loading subject details' });
    }
};
