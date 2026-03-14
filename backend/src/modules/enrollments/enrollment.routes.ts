import { Router } from 'express';
import { enroll, checkEnrollment, myEnrollments } from './enrollment.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

// All enrollment routes require authentication
router.post('/enroll', requireAuth, enroll);
router.get('/check/:subjectId', requireAuth, checkEnrollment);
router.get('/mine', requireAuth, myEnrollments);

export default router;
