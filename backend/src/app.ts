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
        
        const files = ['schema.sql', 'seed.sql', 'add_python_courses.sql', 'add_custom_course.sql'];
        let log = "";

        for (const file of files) {
            const filePath = path.join(dbDir, file);
            if (fs.existsSync(filePath)) {
                console.log(`Executing ${file}...`);
                const sql = fs.readFileSync(filePath, 'utf8');
                try {
                    await pool.query(sql);
                    log += `Successfully executed ${file}\n`;
                } catch (sqlErr: any) {
                    // Ignore "already exists" errors so we can finish the other files
                    if (sqlErr.code === 'ER_DUP_ENTRY' || sqlErr.code === 'ER_DUP_FIELDNAME') {
                        log += `Partially skipped ${file} (data already exists)\n`;
                    } else {
                        throw sqlErr; // Real errors still stop the process
                    }
                }
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

// One-shot route to update Advanced React lessons with timestamps + fix Masterclass lesson names
app.get('/api/update-advanced-react', async (req: express.Request, res: express.Response) => {
    let log = "";
    try {
        // Get the actual section IDs for Advanced React (subject_id = 3)
        const [sections]: any = await pool.query(
            `SELECT id, order_index FROM sections WHERE subject_id = 3 ORDER BY order_index`
        );

        if (sections.length === 0) {
            // Ensure sections exist
            await pool.query(`INSERT IGNORE INTO sections (id, subject_id, title, order_index) VALUES (6, 3, 'Hooks & Re-renders', 1), (7, 3, 'Advanced Patterns', 2)`);
            sections.push({ id: 6, order_index: 1 }, { id: 7, order_index: 2 });
        }

        const sec1 = sections.find((s: any) => s.order_index === 1);
        const sec2 = sections.find((s: any) => s.order_index === 2);

        if (!sec1 || !sec2) {
            res.status(500).send('Could not find sections for Advanced React');
            return;
        }

        // Update section titles
        await pool.query(`UPDATE sections SET title = 'Hooks & Re-renders' WHERE id = ?`, [sec1.id]);
        await pool.query(`UPDATE sections SET title = 'Advanced Patterns' WHERE id = ?`, [sec2.id]);

        // Delete old videos
        await pool.query(`DELETE FROM videos WHERE section_id IN (?, ?)`, [sec1.id, sec2.id]);
        log += `Deleted old Advanced React videos from sections ${sec1.id} & ${sec2.id}\n`;

        // Insert 12 new lessons with timestamps
        const videos: [number, string, string, number][] = [
            [sec1.id, 'Introduction & What is React?',           'https://www.youtube.com/watch?v=SqcY0GlETPk&t=0',    1],
            [sec1.id, 'Setting Up the Development Environment',  'https://www.youtube.com/watch?v=SqcY0GlETPk&t=183',  2],
            [sec1.id, 'React Components & JSX',                  'https://www.youtube.com/watch?v=SqcY0GlETPk&t=465',  3],
            [sec1.id, 'Props & Component Communication',         'https://www.youtube.com/watch?v=SqcY0GlETPk&t=900',  4],
            [sec1.id, 'useState Hook & State Management',        'https://www.youtube.com/watch?v=SqcY0GlETPk&t=1500', 5],
            [sec1.id, 'useEffect Hook & Side Effects',           'https://www.youtube.com/watch?v=SqcY0GlETPk&t=2100', 6],
            [sec2.id, 'useContext & Context API',                'https://www.youtube.com/watch?v=SqcY0GlETPk&t=2700', 1],
            [sec2.id, 'useReducer for Complex State',            'https://www.youtube.com/watch?v=SqcY0GlETPk&t=3300', 2],
            [sec2.id, 'Custom Hooks',                            'https://www.youtube.com/watch?v=SqcY0GlETPk&t=3900', 3],
            [sec2.id, 'React Router & Navigation',               'https://www.youtube.com/watch?v=SqcY0GlETPk&t=4500', 4],
            [sec2.id, 'Fetching Data with Axios',                'https://www.youtube.com/watch?v=SqcY0GlETPk&t=5100', 5],
            [sec2.id, 'Performance Optimization & useMemo',      'https://www.youtube.com/watch?v=SqcY0GlETPk&t=5700', 6],
        ];

        for (const [sId, title, url, oi] of videos) {
            await pool.query(
                `INSERT INTO videos (section_id, title, youtube_url, order_index, duration_seconds) VALUES (?, ?, ?, ?, 0)`,
                [sId, title, url, oi]
            );
        }
        log += `Inserted 12 Advanced React lessons with timestamps\n`;

        // Update Ultimate Masterclass lesson names
        const [masterSecs]: any = await pool.query(
            `SELECT s.id FROM sections s JOIN subjects sub ON sub.id = s.subject_id WHERE sub.slug = 'ultimate-user-masterclass' LIMIT 1`
        );
        if (masterSecs.length > 0) {
            const msId = masterSecs[0].id;
            const names = [
                'Welcome to The Ultimate User Masterclass',
                'Understanding User Psychology & Behavior',
                'UX Research Methods & Techniques',
                'Designing Intuitive User Interfaces',
                'User Journey Mapping & Personas',
                'Usability Testing & Feedback Loops',
                'Accessibility & Inclusive Design',
                'Analytics & Measuring User Success',
                'Capstone: Building a User-Centric Product',
            ];
            for (let i = 0; i < names.length; i++) {
                await pool.query(`UPDATE videos SET title = ? WHERE section_id = ? AND order_index = ?`, [names[i], msId, i + 1]);
            }
            log += `Updated 9 Ultimate User Masterclass lesson names\n`;
        }

        res.set('Content-Type', 'text/plain').send(`✅ Update Complete!\n\n${log}`);
    } catch (err: any) {
        console.error("Update Error:", err);
        res.status(500).json({ error: 'Update failed', message: err.message });
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
