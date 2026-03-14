import { Router } from 'express';
import { getVideosForSubject } from './video.controller';

const router = Router();

router.get('/subject/:subjectId', getVideosForSubject);

export default router;
