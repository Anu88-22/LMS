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
            [sec1.id, 'Intro to Advanced React Patterns',        'https://www.youtube.com/watch?v=qTDnwmMF5q8&t=0',    1],
            [sec1.id, 'Higher Order Components (HOC)',           'https://www.youtube.com/watch?v=qTDnwmMF5q8&t=300',  2],
            [sec1.id, 'Render Props Pattern',                    'https://www.youtube.com/watch?v=qTDnwmMF5q8&t=900',  3],
            [sec1.id, 'Compound Components Pattern',             'https://www.youtube.com/watch?v=qTDnwmMF5q8&t=1500', 4],
            [sec1.id, 'Context API Pattern',                     'https://www.youtube.com/watch?v=qTDnwmMF5q8&t=2100', 5],
            [sec1.id, 'Performance Optimization with Memo',      'https://www.youtube.com/watch?v=qTDnwmMF5q8&t=2700', 6],
            [sec2.id, 'Custom Hooks Patterns',                   'https://www.youtube.com/watch?v=qTDnwmMF5q8&t=3300', 1],
            [sec2.id, 'State Reducer Pattern',                   'https://www.youtube.com/watch?v=qTDnwmMF5q8&t=3900', 2],
            [sec2.id, 'Control Props Pattern',                   'https://www.youtube.com/watch?v=qTDnwmMF5q8&t=4500', 3],
            [sec2.id, 'React Server Components',                 'https://www.youtube.com/watch?v=qTDnwmMF5q8&t=5100', 4],
            [sec2.id, 'Advanced Fetching & Suspense',            'https://www.youtube.com/watch?v=qTDnwmMF5q8&t=5700', 5],
            [sec2.id, 'Capstone: Building a Design System',      'https://www.youtube.com/watch?v=qTDnwmMF5q8&t=6300', 6],
        ];

        for (const [sId, title, url, oi] of videos) {
            await pool.query(
                `INSERT INTO videos (section_id, title, youtube_url, order_index, duration_seconds) VALUES (?, ?, ?, ?, 0)`,
                [sId, title, url, oi]
            );
        }
        log += `Inserted 12 Advanced React lessons with timestamps\n`;

        // Update Ultimate Masterclass lesson names & timestamps
        const [masterSecs]: any = await pool.query(
            `SELECT s.id FROM sections s JOIN subjects sub ON sub.id = s.subject_id WHERE sub.slug = 'ultimate-user-masterclass' LIMIT 1`
        );
        if (masterSecs.length > 0) {
            const msId = masterSecs[0].id;
            const lessons = [
                ['Introduction to Prompt Engineering',          'https://www.youtube.com/watch?v=VaSjiJMrq24&t=0'],
                ['How Large Language Models Work',              'https://www.youtube.com/watch?v=VaSjiJMrq24&t=600'],
                ['Zero-Shot vs Few-Shot Prompting',             'https://www.youtube.com/watch?v=VaSjiJMrq24&t=1800'],
                ['Chain of Thought Prompting Techniques',       'https://www.youtube.com/watch?v=VaSjiJMrq24&t=3600'],
                ['Advanced Prompt Patterns for Coding',         'https://www.youtube.com/watch?v=VaSjiJMrq24&t=5400'],
                ['Avoiding Hallucinations & Biases',            'https://www.youtube.com/watch?v=VaSjiJMrq24&t=7200'],
                ['Prompt Engineering for Business',             'https://www.youtube.com/watch?v=VaSjiJMrq24&t=9000'],
                ['Iterative Prompt Development',                'https://www.youtube.com/watch?v=VaSjiJMrq24&t=10800'],
                ['Capstone: Designing an AI Agent Prompt',      'https://www.youtube.com/watch?v=VaSjiJMrq24&t=12600'],
            ];
            for (let i = 0; i < lessons.length; i++) {
                await pool.query(
                    `UPDATE videos SET title = ?, youtube_url = ? WHERE section_id = ? AND order_index = ?`, 
                    [lessons[i][0], lessons[i][1], msId, i + 1]
                );
            }
            log += `Updated 9 Ultimate User Masterclass lessons with Prompt Engineering content\n`;
        }

        res.set('Content-Type', 'text/plain').send(`✅ Update Complete!\n\n${log}`);
    } catch (err: any) {
        console.error("Update Error:", err);
        res.status(500).json({ error: 'Update failed', message: err.message });
    }
});

// Route to apply the new "Unlimited Course" structure
app.get('/api/rename-to-courses', async (req: express.Request, res: express.Response) => {
    let log = "";
    try {
        // 1. Update the subject title and description
        await pool.query(
            `UPDATE subjects SET title = 'Unlimited Course Masterclass', slug = 'unlimited-course-masterclass', 
             description = 'This is the premium custom course created with specific learning tracks.' WHERE id = 4`
        );
        log += "Updated Subject 4 title to 'Unlimited Course Masterclass'\n";

        // 2. Update the section title
        await pool.query(
            `UPDATE sections SET title = 'Core Courses' WHERE subject_id = 4 AND order_index = 1`
        );
        log += "Updated Section title to 'Core Courses'\n";

        // 3. Update the video titles (Course 1 to Course 9)
        const courses = [
            'Course 1: Complete HTML Course (Fundamentals)',
            'Course 2: How to Learn AI (Step-by-Step Guide)',
            'Course 3: Professional Python Programming',
            'Course 4: Full-Stack Web Development',
            'Course 5: Machine Learning and Deep Learning',
            'Course 6: Cybersecurity and Ethical Hacking',
            'Course 7: Digital Marketing and SEO',
            'Course 8: Graphic Design & Creative UI/UX',
            'Course 9: Cloud Computing with AWS & Azure'
        ];

        // Need to find the section ID for Subject 4
        const [sections]: any = await pool.query(`SELECT id FROM sections WHERE subject_id = 4 LIMIT 1`);
        if (sections.length > 0) {
            const sectionId = sections[0].id;
            for (let i = 0; i < courses.length; i++) {
                await pool.query(
                    `UPDATE videos SET title = ? WHERE section_id = ? AND order_index = ?`,
                    [courses[i], sectionId, i + 1]
                );
            }
            log += `Updated ${courses.length} video titles to 'Course X' format\n`;
        } else {
            log += "Warning: No section found for Subject 4, skipping video title updates\n";
        }

        res.set('Content-Type', 'text/plain').send(`✅ Unlimited Course Renaming Complete!\n\n${log}`);
    } catch (err: any) {
        console.error("Rename Error:", err);
        res.status(500).json({ error: 'Rename failed', message: err.message });
    }
});

// Route to split the Masterclass into separate top-level courses
app.get('/api/split-ultimate-course', async (req: express.Request, res: express.Response) => {
    let log = "";
    try {
        console.log("Starting Course Split (v2)...");
        
        // 1. Cleanup: Delete any previously created subjects/sections from IDs 5-13 OR IDs 100+
        // This ensures a clean slate
        await pool.query(`DELETE FROM videos WHERE section_id BETWEEN 100 AND 120`);
        await pool.query(`DELETE FROM sections WHERE id BETWEEN 100 AND 120`);
        await pool.query(`DELETE FROM subjects WHERE id BETWEEN 100 AND 120`);
        log += "Cleanup of old split attempts complete.\n";

        // 2. Create the new subjects (IDs 101 to 111)
        const subjects = [
            [101, 'Complete HTML Course', 'html-course-new', 'Master the fundamentals of HTML5 and modern web structuring.', 0],
            [102, 'How to Learn AI', 'learn-ai-new', 'A step-by-step roadmap to becoming an AI and Machine Learning expert.', 0],
            [103, 'Professional Python Programming', 'python-pro-new', 'Go from basics to advanced professional Python coding.', 0],
            [104, 'Full-Stack Web Development', 'web-dev-stack-new', 'Build full-stack applications using the MERN stack and beyond.', 0],
            [105, 'Machine Learning Foundations', 'ml-foundations-new', 'Deep dive into neural networks, data science, and AI models.', 0],
            [106, 'Cybersecurity Bootcamp', 'cyber-security-new', 'Learn ethical hacking, network security, and digital defense.', 0],
            [107, 'Digital Marketing Strategy', 'digital-marketing-new', 'Master SEO, social media marketing, and data-driven advertising.', 0],
            [108, 'Graphic Design & UI/UX', 'graphic-design-new', 'Design stunning user interfaces and professional creative assets.', 0],
            [109, 'Cloud Computing Masterclass', 'cloud-computing-new', 'Deploy apps at scale using AWS, Azure, and Google Cloud.', 0],
            [110, 'Premium AI Masterclass (Buy Course)', 'premium-ai-pro', 'Exclusive paid course on advanced AI strategy and implementation.', 4999],
            [111, 'Building AI with Hugging Face (Sample AI)', 'huggingface-ai-sample', 'Learn how to create and deploy AI models using Hugging Face Transformers.', 0]
        ];

        for (const [id, title, slug, desc, price] of subjects) {
            await pool.query(
                `INSERT INTO subjects (id, title, slug, description, is_published, price) VALUES (?, ?, ?, ?, 1, ?)`,
                [id, title, slug, desc, price]
            );
            log += `Created Subject: ${title}\n`;
        }

        // 3. Create sections for each new subject (ID 101 to 111)
        for (let i = 0; i < subjects.length; i++) {
            const subjectId = subjects[i][0];
            const sectionId = 101 + i;
            await pool.query(
                `INSERT INTO sections (id, subject_id, title, order_index) VALUES (?, ?, 'Course Content', 1)`,
                [sectionId, subjectId]
            );
            log += `Created section for ${subjects[i][1]}\n`;
        }

        // 4. Add the videos to their respective new sections
        const videos = [
            [101, 'Complete HTML Course (Beginner to Pro)', 'https://www.youtube.com/watch?v=G3e-cpL7ofc'],
            [102, 'How to Learn AI in 2026',                  'https://www.youtube.com/watch?v=CT_WEGUKejQ'],
            [103, 'Professional Python Programming',         'https://www.youtube.com/watch?v=K5KVEU3aaeQ'],
            [104, 'Full-Stack Web Development Course',       'https://www.youtube.com/watch?v=nu_pCVPKzTk'],
            [105, 'Neural Networks & Data Science',          'https://www.youtube.com/watch?v=VaSjiJMrq24&t=5400'],
            [106, 'Cybersecurity Bootcamp (Full Guide)',     'https://www.youtube.com/watch?v=lpa8uy4DyMo'],
            [107, 'Digital Marketing Strategy 2026',         'https://www.youtube.com/watch?v=jVgYgN0zcWs'],
            [108, 'Graphic Design & UI/UX Masterclass',      'https://www.youtube.com/watch?v=O5IXf8qB9U4'],
            [109, 'Cloud Computing Masterclass (Complete)',  'https://www.youtube.com/watch?v=NhDYbskXRgc'],
            [110, 'Advanced AI for Business Professionals',  'https://www.youtube.com/watch?v=5NgNicANyqM'],
            [111, 'Hugging Face AI Development Tutorial',    'https://www.youtube.com/watch?v=_u7Gf1IInYI']
        ];

        for (const [secId, title, url] of videos) {
            await pool.query(
                `INSERT INTO videos (section_id, title, youtube_url, order_index, duration_seconds) VALUES (?, ?, ?, 1, 0)`,
                [secId, title, url]
            );
            log += `Linked video: ${title}\n`;
        }

        // 5. Hide the old Subjects 4 through 13 if they were partial or old
        await pool.query(`UPDATE subjects SET is_published = 0 WHERE id BETWEEN 4 AND 13`);
        log += "Cleaned up old subject visibility.\n";

        res.set('Content-Type', 'text/plain').send(`🎉 Course Split FIXED Successfully!\n\n${log}`);
    } catch (err: any) {
        console.error("Split Error:", err);
        res.status(500).json({ error: 'Split failed', message: err.message });
    }
});

// AI Chatbot Route (Hugging Face Proxy)
import axios from 'axios';
app.post('/api/chat', async (req: express.Request, res: express.Response) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });

        const HF_API_TOKEN = process.env.HF_API_TOKEN?.trim();
        
        // Use the Unified Router API (OpenAI-compatible)
        const endpoint = "https://router.huggingface.co/v1/chat/completions";
        // Using a more widely supported model alias or version
        const model = "mistralai/Mistral-7B-Instruct-v0.3"; 
        
        const response = await axios.post(
            endpoint,
            { 
                model: model,
                messages: [
                    { role: "system", content: "You are a helpful AI tutor for the LMS platform. Help students with their courses and topics." },
                    { role: "user", content: message }
                ],
                max_tokens: 500
            },
            {
                headers: {
                    ...(HF_API_TOKEN ? { Authorization: `Bearer ${HF_API_TOKEN}` } : {}),
                    'Content-Type': 'application/json'
                },
                timeout: 20000 // 20 second timeout for AI
            }
        );

        let reply = "I'm sorry, I couldn't generate a response at this moment.";
        
        // Handle Chat Completion format
        if (response.data?.choices?.[0]?.message?.content) {
            reply = response.data.choices[0].message.content;
        }

        if (!HF_API_TOKEN) {
            reply = `[FREE MODE]\n\n${reply}\n\n⚠️ TIP: Add your 'HF_API_TOKEN' to Render for better AI!`;
        }

        res.json({ reply });
    } catch (err: any) {
        console.error("Chat Error:", err.response?.data || err.message);
        
        const errorMsg = err.response?.data?.error?.message || err.response?.data?.error || err.message;

        if (!process.env.HF_API_TOKEN) {
            return res.status(200).json({ 
                reply: "👋 Hi! To activate me, please add your 'HF_API_TOKEN' to your Render Dashboard settings! link: https://huggingface.co/settings/tokens" 
            });
        }
        
        if (errorMsg.includes("loading") || errorMsg.includes("overloaded")) {
             return res.status(200).json({ reply: "I'm just waking up or a bit busy! Please try again in 30 seconds. 🧠" });
        }

        res.status(200).json({ 
            reply: `AI is currently busy (${errorMsg}). Please try again shortly or check your token!` 
        });
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
