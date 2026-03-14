const mysql = require('mysql2/promise');
require('dotenv').config();

const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'lms_db',
};

async function run() {
    const conn = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL');

    // 1. Add video to Advanced React
    const [reactSubject] = await conn.query(`SELECT id FROM subjects WHERE slug='advanced-react'`);
    if (reactSubject.length > 0) {
        const reactSubjectId = reactSubject[0].id;

        // Find or create a section for Advanced React
        const [reactSections] = await conn.query(`SELECT id FROM sections WHERE subject_id=? ORDER BY order_index DESC LIMIT 1`, [reactSubjectId]);
        let reactSectionId;

        if (reactSections.length > 0) {
            reactSectionId = reactSections[0].id;
        } else {
            const [reactResult] = await conn.query(`INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)`, [reactSubjectId, 'React Advanced Features', 1]);
            reactSectionId = reactResult.insertId;
        }

        // Add the requested video
        const videoUrl1 = 'https://www.youtube.com/watch?v=dz458ZkBMak';
        const [existing1] = await conn.query(`SELECT id FROM videos WHERE youtube_url=? AND section_id=?`, [videoUrl1, reactSectionId]);
        if (existing1.length === 0) {
            const [videos] = await conn.query(`SELECT COUNT(*) as cnt FROM videos WHERE section_id=?`, [reactSectionId]);
            const order1 = videos[0].cnt + 1;
            await conn.query(`INSERT INTO videos (section_id, title, youtube_url, order_index, duration_seconds) VALUES (?, ?, ?, ?, ?)`,
                [reactSectionId, 'Advanced React Concepts', videoUrl1, order1, 0]);
            console.log('✅ Inserted new video for Advanced React');
        } else {
            console.log('ℹ️  Advanced React video already exists');
        }
    } else {
        console.log('❌ Advanced React subject not found');
    }

    // 2. Add video to Python for Beginners
    const [pythonSubject] = await conn.query(`SELECT id FROM subjects WHERE slug='python-for-beginners'`);
    if (pythonSubject.length > 0) {
        const pythonSubjectId = pythonSubject[0].id;

        // Find or create a section
        const [pySections] = await conn.query(`SELECT id FROM sections WHERE subject_id=? ORDER BY order_index DESC LIMIT 1`, [pythonSubjectId]);
        let pySectionId;

        if (pySections.length > 0) {
            pySectionId = pySections[0].id;
        } else {
            const [pyResult] = await conn.query(`INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)`, [pythonSubjectId, 'Python Basics', 1]);
            pySectionId = pyResult.insertId;
        }

        // Add the requested video
        const videoUrl2 = 'https://www.youtube.com/watch?v=th4OBktqK1I';
        const [existing2] = await conn.query(`SELECT id FROM videos WHERE youtube_url=? AND section_id=?`, [videoUrl2, pySectionId]);
        if (existing2.length === 0) {
            const [videos] = await conn.query(`SELECT COUNT(*) as cnt FROM videos WHERE section_id=?`, [pySectionId]);
            const order2 = videos[0].cnt + 1;
            await conn.query(`INSERT INTO videos (section_id, title, youtube_url, order_index, duration_seconds) VALUES (?, ?, ?, ?, ?)`,
                [pySectionId, 'Python Beginner Tutorial', videoUrl2, order2, 0]);
            console.log('✅ Inserted new video for Python for Beginners');
        } else {
            console.log('ℹ️  Python for Beginners video already exists');
        }
    } else {
        console.log('❌ Python for Beginners subject not found');
    }

    await conn.end();
}

run().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
