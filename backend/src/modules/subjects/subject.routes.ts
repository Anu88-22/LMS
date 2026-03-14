import { Router } from 'express';
import { getSubjects, getSubject } from './subject.controller';

const router = Router();

router.get('/', getSubjects);
router.get('/:id', getSubject);

export default router;
