-- =============================================================
-- Two New Python Courses (prices in Indian Rupees)
-- Course 1: Python Full Course (playlist: PLGjplNEQ1it8-0CmoljS5yeV-GlKSUEt0)
-- Course 2: Python Masterclass   (playlist: PLZPZq0r_RZOPP5Yjt6IqgytMRY5uLt4y3)
-- =============================================================

-- Make sure price column exists (safely)
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2) DEFAULT 0.00;

-- ---------------------------------------------------------------
-- COURSE 5: Python Full Course for Beginners
-- ---------------------------------------------------------------
INSERT INTO subjects (id, title, slug, description, is_published, price) VALUES
(5,
 'Python Full Course for Beginners',
 'python-full-course-beginners',
 'A complete beginner-friendly Python course covering variables, data types, loops, functions, OOP, file handling, and real-world projects. Go from zero to Python hero in this comprehensive video course.',
 1,
 999.00);

-- Sections for Python Full Course
INSERT INTO sections (id, subject_id, title, order_index) VALUES
(10, 5, 'Getting Started with Python',    1),
(11, 5, 'Core Python Concepts',           2),
(12, 5, 'Functions & Modules',            3),
(13, 5, 'Object-Oriented Programming',    4),
(14, 5, 'File Handling & Projects',       5);

-- Videos for Python Full Course (from playlist PLGjplNEQ1it8-0CmoljS5yeV-GlKSUEt0)
INSERT INTO videos (section_id, title, youtube_url, order_index, duration_seconds) VALUES
-- Section 10: Getting Started
(10, 'Python Tutorial - Introduction',            'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 1, 0),
(10, 'Install Python & VS Code',                  'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 2, 0),
(10, 'Your First Python Program',                 'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 3, 0),
-- Section 11: Core Python Concepts
(11, 'Variables & Data Types',                    'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 1, 0),
(11, 'Strings & String Methods',                  'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 2, 0),
(11, 'Lists, Tuples & Dictionaries',              'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 3, 0),
(11, 'If / Else Conditions',                      'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 4, 0),
(11, 'For & While Loops',                         'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 5, 0),
-- Section 12: Functions & Modules
(12, 'Defining & Calling Functions',              'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 1, 0),
(12, 'Lambda Functions',                          'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 2, 0),
(12, 'Importing Modules',                         'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 3, 0),
-- Section 13: OOP
(13, 'Classes & Objects',                         'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 1, 0),
(13, 'Inheritance',                               'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 2, 0),
(13, 'Encapsulation & Polymorphism',              'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 3, 0),
-- Section 14: File Handling & Projects
(14, 'Reading & Writing Files',                   'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 1, 0),
(14, 'Exception Handling',                        'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 2, 0),
(14, 'Final Project: Build a Python App',         'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 3, 0);


-- ---------------------------------------------------------------
-- COURSE 6: Python Masterclass – Advanced & Professional
-- ---------------------------------------------------------------
INSERT INTO subjects (id, title, slug, description, is_published, price) VALUES
(6,
 'Python Masterclass – Advanced & Professional',
 'python-masterclass-advanced',
 'Take your Python skills to the next level. This masterclass covers advanced topics including decorators, generators, async programming, web scraping, APIs, data science basics, and building production-ready Python applications.',
 1,
 1999.00);

-- Sections for Python Masterclass
INSERT INTO sections (id, subject_id, title, order_index) VALUES
(15, 6, 'Python Refresher & Setup',             1),
(16, 6, 'Advanced Python Features',             2),
(17, 6, 'Web & API Development',                3),
(18, 6, 'Data Science with Python',             4),
(19, 6, 'Real-World Projects',                  5);

-- Videos for Python Masterclass (from playlist PLZPZq0r_RZOPP5Yjt6IqgytMRY5uLt4y3)
INSERT INTO videos (section_id, title, youtube_url, order_index, duration_seconds) VALUES
-- Section 15: Refresher
(15, 'Masterclass – Welcome & Overview',        'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 1, 0),
(15, 'Python Environment & Tools',              'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 2, 0),
(15, 'Quick Python Refresher',                  'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 3, 0),
-- Section 16: Advanced Features
(16, 'Decorators & Closures',                   'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 1, 0),
(16, 'Generators & Iterators',                  'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 2, 0),
(16, 'Async / Await & Concurrency',             'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 3, 0),
(16, 'Context Managers',                        'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 4, 0),
(16, 'Advanced OOP Patterns',                   'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 5, 0),
-- Section 17: Web & API
(17, 'Working with REST APIs',                  'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 1, 0),
(17, 'Web Scraping with BeautifulSoup',         'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 2, 0),
(17, 'Building APIs with FastAPI',              'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 3, 0),
-- Section 18: Data Science
(18, 'NumPy Essentials',                        'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 1, 0),
(18, 'Pandas for Data Analysis',                'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 2, 0),
(18, 'Data Visualization with Matplotlib',      'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 3, 0),
-- Section 19: Real-World Projects
(19, 'Project: Web Scraper',                    'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 1, 0),
(19, 'Project: REST API with FastAPI',          'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 2, 0),
(19, 'Project: Data Dashboard',                 'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 3, 0),
(19, 'Deploying Your Python App',               'https://www.youtube.com/watch?v=HGTJBPNC-Gw', 4, 0);
