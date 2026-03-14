import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { enrollUser, isUserEnrolled, getUserEnrollments } from './enrollment.model';
import { getSubjectById } from '../subjects/subject.model';

// POST /api/enrollments/enroll  { subjectId }
export const enroll = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId!;
        const { subjectId } = req.body;

        if (!subjectId) {
            return res.status(400).json({ error: 'subjectId is required' });
        }

        const subject = await getSubjectById(Number(subjectId));
        if (!subject) {
            return res.status(404).json({ error: 'Course not found' });
        }

        await enrollUser(userId, Number(subjectId));
        res.json({ success: true, message: 'Enrolled successfully! You can now start learning.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during enrollment' });
    }
};

// GET /api/enrollments/check/:subjectId
export const checkEnrollment = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId!;
        const subjectId = parseInt(String(req.params.subjectId), 10);
        const enrolled = await isUserEnrolled(userId, subjectId);
        res.json({ enrolled });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error checking enrollment' });
    }
};

// GET /api/enrollments/mine
export const myEnrollments = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId!;
        const subjectIds = await getUserEnrollments(userId);
        res.json({ enrolledSubjectIds: subjectIds });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error loading enrollments' });
    }
};
