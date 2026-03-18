const mysql = require('mysql2/promise');

const DB_HOST = process.argv[2] || 'localhost';
const DB_PORT = process.argv[3] || '3306';
const DB_USER = process.argv[4] || 'root';
const DB_PASS = process.argv[5] || 'Root@1234';
const DB_NAME = process.argv[6] || 'lms_db';

async function run() {
    const c = await mysql.createConnection({
        host: DB_HOST,
        port: parseInt(DB_PORT),
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
    });
    console.log('✅ Connected to MySQL');

    // ── Step 1: Ensure subject 3 (Advanced React) exists ──────────────────
    await c.query(`
        INSERT IGNORE INTO subjects (id, title, slug, description, is_published, price) VALUES
        (3, 'Advanced React', 'advanced-react', 'Build scalable modern web apps with advanced React patterns.', 1, 0.00)
    `);

    // ── Step 2: Look up existing sections for subject 3 ───────────────────
    const [existingSections] = await c.query(
        `SELECT id, title, order_index FROM sections WHERE subject_id = 3 ORDER BY order_index`
    );
    console.log('Existing sections for Advanced React:', existingSections);

    // ── Step 3: Ensure we have two sections for subject 3 ─────────────────
    // We'll upsert by querying for them with order_index
    let sec1Id, sec2Id;

    const sec1 = existingSections.find(s => s.order_index === 1);
    const sec2 = existingSections.find(s => s.order_index === 2);

    if (sec1) {
        sec1Id = sec1.id;
        await c.query(`UPDATE sections SET title = 'Hooks & Re-renders' WHERE id = ?`, [sec1Id]);
    } else {
        const [result] = await c.query(
            `INSERT INTO sections (subject_id, title, order_index) VALUES (3, 'Hooks & Re-renders', 1)`
        );
        sec1Id = result.insertId;
    }

    if (sec2) {
        sec2Id = sec2.id;
        await c.query(`UPDATE sections SET title = 'Advanced Patterns' WHERE id = ?`, [sec2Id]);
    } else {
        const [result] = await c.query(
            `INSERT INTO sections (subject_id, title, order_index) VALUES (3, 'Advanced Patterns', 2)`
        );
        sec2Id = result.insertId;
    }

    console.log(`✅ Section IDs for Advanced React: section1=${sec1Id}, section2=${sec2Id}`);

    // ── Step 4: Delete old videos for those sections ───────────────────────
    await c.query(`DELETE FROM videos WHERE section_id IN (?, ?)`, [sec1Id, sec2Id]);
    console.log('🗑️  Old Advanced React videos removed');

    // ── Step 5: Insert 12 new lessons with timestamps ──────────────────────
    const videos1 = [
        ['Introduction & What is React?',           'https://www.youtube.com/watch?v=SqcY0GlETPk&t=0',    1],
        ['Setting Up the Development Environment',  'https://www.youtube.com/watch?v=SqcY0GlETPk&t=183',  2],
        ['React Components & JSX',                  'https://www.youtube.com/watch?v=SqcY0GlETPk&t=465',  3],
        ['Props & Component Communication',         'https://www.youtube.com/watch?v=SqcY0GlETPk&t=900',  4],
        ['useState Hook & State Management',        'https://www.youtube.com/watch?v=SqcY0GlETPk&t=1500', 5],
        ['useEffect Hook & Side Effects',           'https://www.youtube.com/watch?v=SqcY0GlETPk&t=2100', 6],
    ];
    const videos2 = [
        ['useContext & Context API',                'https://www.youtube.com/watch?v=SqcY0GlETPk&t=2700', 1],
        ['useReducer for Complex State',            'https://www.youtube.com/watch?v=SqcY0GlETPk&t=3300', 2],
        ['Custom Hooks',                            'https://www.youtube.com/watch?v=SqcY0GlETPk&t=3900', 3],
        ['React Router & Navigation',               'https://www.youtube.com/watch?v=SqcY0GlETPk&t=4500', 4],
        ['Fetching Data with Axios',                'https://www.youtube.com/watch?v=SqcY0GlETPk&t=5100', 5],
        ['Performance Optimization & useMemo',      'https://www.youtube.com/watch?v=SqcY0GlETPk&t=5700', 6],
    ];

    for (const [title, url, oi] of videos1) {
        await c.query(
            `INSERT INTO videos (section_id, title, youtube_url, order_index, duration_seconds) VALUES (?, ?, ?, ?, 0)`,
            [sec1Id, title, url, oi]
        );
    }
    for (const [title, url, oi] of videos2) {
        await c.query(
            `INSERT INTO videos (section_id, title, youtube_url, order_index, duration_seconds) VALUES (?, ?, ?, ?, 0)`,
            [sec2Id, title, url, oi]
        );
    }
    console.log('✅ 12 Advanced React lessons inserted with timestamps');

    // ── Step 6: Update Ultimate Masterclass lesson names (section_id = 3) ──
    // First find what section_id the Ultimate Masterclass videos are in
    const [masterSections] = await c.query(
        `SELECT s.id FROM sections s JOIN subjects sub ON sub.id = s.subject_id WHERE sub.slug = 'ultimate-user-masterclass' LIMIT 1`
    );
    if (masterSections.length > 0) {
        const masterSecId = masterSections[0].id;
        const masterUpdates = [
            ['Welcome to The Ultimate User Masterclass',   1],
            ['Understanding User Psychology & Behavior',   2],
            ['UX Research Methods & Techniques',           3],
            ['Designing Intuitive User Interfaces',        4],
            ['User Journey Mapping & Personas',            5],
            ['Usability Testing & Feedback Loops',         6],
            ['Accessibility & Inclusive Design',           7],
            ['Analytics & Measuring User Success',         8],
            ['Capstone: Building a User-Centric Product',  9],
        ];
        for (const [title, orderIndex] of masterUpdates) {
            await c.query(
                `UPDATE videos SET title = ? WHERE section_id = ? AND order_index = ?`,
                [title, masterSecId, orderIndex]
            );
        }
        console.log('✅ Ultimate User Masterclass lesson names updated');
    } else {
        console.log('ℹ️  Ultimate User Masterclass not found — skipping lesson name update');
    }

    await c.end();
    console.log('\n🎉 All done! Advanced React & Ultimate Masterclass are fully updated.');
}

run().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
