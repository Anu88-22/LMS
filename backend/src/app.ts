import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/security';
import authRoutes from './modules/auth/auth.routes';
import subjectRoutes from './modules/subjects/subject.routes';
import videoRoutes from './modules/videos/video.routes';
import enrollmentRoutes from './modules/enrollments/enrollment.routes';

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Main health check logic
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Routes placeholders
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress', (req, res) => { res.json({ msg: 'progress placeholder' }) });

// Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
