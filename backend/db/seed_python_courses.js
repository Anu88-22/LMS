/**
 * Seed script: adds two Python courses with ₹ pricing to the database.
 * Run from the backend folder: node db/seed_python_courses.js
 */
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

    // Ensure price column exists
    await conn.query(`ALTER TABLE subjects ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0.00`).catch(() => { });

    // ---- COURSE 5: Python Full Course ----
    const [existing5] = await conn.query(`SELECT id FROM subjects WHERE slug='python-full-course-beginners'`);
    if (existing5.length === 0) {
        await conn.query(`INSERT INTO subjects (id, title, slug, description, is_published, price) VALUES (?, ?, ?, ?, ?, ?)`,
            [5, 'Python Full Course for Beginners', 'python-full-course-beginners',
                'A complete beginner-friendly Python course covering variables, data types, loops, functions, OOP, file handling, and real-world projects. Go from zero to Python hero!',
                1, 999.00]);
        console.log('✅ Inserted: Python Full Course for Beginners (₹999)');

        await conn.query(`INSERT INTO sections (id, subject_id, title, order_index) VALUES
            (10, 5, 'Getting Started with Python', 1),
            (11, 5, 'Core Python Concepts', 2),
            (12, 5, 'Functions & Modules', 3),
            (13, 5, 'Object-Oriented Programming', 4),
            (14, 5, 'File Handling & Projects', 5)`);

        await conn.query(`INSERT INTO videos (section_id, title, youtube_url, order_index, duration_seconds) VALUES
            (10, 'Python Tutorial – Introduction',            'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 1, 0),
            (10, 'Install Python & VS Code',                 'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 2, 0),
            (10, 'Your First Python Program',                'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 3, 0),
            (11, 'Variables & Data Types',                   'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 1, 0),
            (11, 'Strings & String Methods',                 'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 2, 0),
            (11, 'Lists, Tuples & Dictionaries',             'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 3, 0),
            (11, 'If / Else Conditions',                     'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 4, 0),
            (11, 'For & While Loops',                        'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 5, 0),
            (12, 'Defining & Calling Functions',             'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 1, 0),
            (12, 'Lambda Functions',                         'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 2, 0),
            (12, 'Importing Modules',                        'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 3, 0),
            (13, 'Classes & Objects',                        'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 1, 0),
            (13, 'Inheritance',                              'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 2, 0),
            (13, 'Encapsulation & Polymorphism',             'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 3, 0),
            (14, 'Reading & Writing Files',                  'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 1, 0),
            (14, 'Exception Handling',                       'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 2, 0),
            (14, 'Final Project: Build a Python App',        'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 3, 0)`);
        console.log('✅ Inserted sections & videos for Python Full Course');
    } else {
        console.log('ℹ️  Python Full Course already exists, skipping.');
    }

    // ---- COURSE 6: Python Masterclass ----
    const [existing6] = await conn.query(`SELECT id FROM subjects WHERE slug='python-masterclass-advanced'`);
    if (existing6.length === 0) {
        await conn.query(`INSERT INTO subjects (id, title, slug, description, is_published, price) VALUES (?, ?, ?, ?, ?, ?)`,
            [6, 'Python Masterclass – Advanced & Professional', 'python-masterclass-advanced',
                'Take your Python skills to the next level. This masterclass covers advanced topics including decorators, generators, async programming, web scraping, APIs, data science basics, and building production-ready Python apps.',
                1, 1999.00]);
        console.log('✅ Inserted: Python Masterclass – Advanced & Professional (₹1999)');

        await conn.query(`INSERT INTO sections (id, subject_id, title, order_index) VALUES
            (15, 6, 'Python Refresher & Setup', 1),
            (16, 6, 'Advanced Python Features', 2),
            (17, 6, 'Web & API Development', 3),
            (18, 6, 'Data Science with Python', 4),
            (19, 6, 'Real-World Projects', 5)`);

        await conn.query(`INSERT INTO videos (section_id, title, youtube_url, order_index, duration_seconds) VALUES
            (15, 'Masterclass – Welcome & Overview',     'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 1, 0),
            (15, 'Python Environment & Tools',           'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 2, 0),
            (15, 'Quick Python Refresher',               'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 3, 0),
            (16, 'Decorators & Closures',                'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 1, 0),
            (16, 'Generators & Iterators',               'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 2, 0),
            (16, 'Async / Await & Concurrency',          'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 3, 0),
            (16, 'Context Managers',                     'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 4, 0),
            (16, 'Advanced OOP Patterns',                'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 5, 0),
            (17, 'Working with REST APIs',               'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 1, 0),
            (17, 'Web Scraping with BeautifulSoup',      'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 2, 0),
            (17, 'Building APIs with FastAPI',           'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 3, 0),
            (18, 'NumPy Essentials',                     'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 1, 0),
            (18, 'Pandas for Data Analysis',             'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 2, 0),
            (18, 'Data Visualization with Matplotlib',   'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 3, 0),
            (19, 'Project: Web Scraper',                 'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 1, 0),
            (19, 'Project: REST API with FastAPI',       'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 2, 0),
            (19, 'Project: Data Dashboard',              'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 3, 0),
            (19, 'Deploying Your Python App',            'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 4, 0)`);
        console.log('✅ Inserted sections & videos for Python Masterclass');
    } else {
        console.log('ℹ️  Python Masterclass already exists, skipping.');
    }

    await conn.end();
    console.log('\n🎉 Done! Both Python courses are now in the database.');
}

run().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
