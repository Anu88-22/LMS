import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/security';
import authRoutes from './modules/auth/auth.routes';
import subjectRoutes from './modules/subjects/subject.routes';
import videoRoutes from './modules/videos/video.routes';
import enrollmentRoutes from './modules/enrollments/enrollment.routes';
import fs from 'fs';
import path from 'path';
import { pool } from './config/db';

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('<h1>LMS Backend is Live!</h1><p>Use /api/setup-db to initialize the database.</p>');
});

// Main health check logic
app.get('/api/health', (req: express.Request, res: express.Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Temporary Database Setup Route
app.get('/api/setup-db', async (req: express.Request, res: express.Response) => {
    try {
        console.log("Starting DB Setup...");
        const dbDir = path.join(process.cwd(), 'db');
        
        const files = ['schema.sql', 'seed.sql', 'add_python_courses.sql'];
        let log = "";

        for (const file of files) {
            const filePath = path.join(dbDir, file);
            if (fs.existsSync(filePath)) {
                console.log(`Executing ${file}...`);
                const sql = fs.readFileSync(filePath, 'utf8');
                await pool.query(sql);
                log += `Successfully executed ${file}\n`;
            } else {
                log += `Skipped ${file} (not found)\n`;
            }
        }

        res.set('Content-Type', 'text/plain').send(`Database Setup Complete!\n\n${log}`);
    } catch (err: any) {
        console.error("Setup Error:", err);
        res.status(500).json({ error: 'Setup failed', message: err.message });
    }
});

// Routes placeholders
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress', (req: express.Request, res: express.Response) => { res.json({ msg: 'progress placeholder' }) });

// Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
