INSERT IGNORE INTO users (email, password_hash, name) VALUES ('student@example.com', '$2b$10$fVHKz.O2.M44oW1Iu7oIaeT9NoflQ0V762tH7vJw6YmN5hXzLq9wG', 'John Doe');

INSERT IGNORE INTO subjects (id, title, slug, description, is_published) VALUES 
(1, 'Java Masterclass', 'java-masterclass', 'Learn Java from scratch to advanced.', 1),
(2, 'Python for Beginners', 'python-for-beginners', 'Your entry into the world of Python programming.', 1),
(3, 'Advanced React', 'advanced-react', 'Build scalable modern web apps.', 1);

INSERT IGNORE INTO sections (id, subject_id, title, order_index) VALUES 
(1, 1, 'Java Basics', 1),
(2, 1, 'Object Oriented Programming', 2),
(4, 2, 'Python Installation & Basics', 1),
(5, 2, 'Control Flow & Loops', 2),
(6, 3, 'Hooks & Re-renders', 1),
(7, 3, 'Advanced Patterns', 2);

INSERT IGNORE INTO videos (section_id, title, youtube_url, order_index, duration_seconds) VALUES 
(1, 'Introduction to Java', 'https://www.youtube.com/watch?v=WPvGqX-TXP0', 1, 600),
(1, 'Variables and Data Types', 'https://www.youtube.com/watch?v=WPvGqX-TXP0', 2, 800),
(2, 'Classes and Objects', 'https://www.youtube.com/watch?v=WPvGqX-TXP0', 1, 1200),
-- Python for Beginners (Subject 2)
(4, 'Python Tutorial for Beginners', 'https://www.youtube.com/watch?v=eWRfhZUzrAc', 1, 0),
-- Advanced React (Subject 3) — Codevolution Advanced React Patterns
(6, 'Intro to Advanced React Patterns',        'https://www.youtube.com/watch?v=qTDnwmMF5q8&t=0',    1, 0),
(6, 'Higher Order Components (HOC)',           'https://www.youtube.com/watch?v=qTDnwmMF5q8&t=300',  2, 0),
(6, 'Render Props Pattern',                    'https://www.youtube.com/watch?v=qTDnwmMF5q8&t=900',  3, 0),
(6, 'Compound Components Pattern',             'https://www.youtube.com/watch?v=qTDnwmMF5q8&t=1500', 4, 0),
(6, 'Context API Pattern',                     'https://www.youtube.com/watch?v=qTDnwmMF5q8&t=2100', 5, 0),
(6, 'Performance Optimization with Memo',      'https://www.youtube.com/watch?v=qTDnwmMF5q8&t=2700', 6, 0),
(7, 'Custom Hooks Patterns',                   'https://www.youtube.com/watch?v=qTDnwmMF5q8&t=3300', 1, 0),
(7, 'State Reducer Pattern',                   'https://www.youtube.com/watch?v=qTDnwmMF5q8&t=3900', 2, 0),
(7, 'Control Props Pattern',                   'https://www.youtube.com/watch?v=qTDnwmMF5q8&t=4500', 3, 0),
(7, 'React Server Components',                 'https://www.youtube.com/watch?v=qTDnwmMF5q8&t=5100', 4, 0),
(7, 'Advanced Fetching & Suspense',            'https://www.youtube.com/watch?v=qTDnwmMF5q8&t=5700', 5, 0),
(7, 'Capstone: Building a Design System',      'https://www.youtube.com/watch?v=qTDnwmMF5q8&t=6300', 6, 0);

-- Make user enrolled in Java Masterclass
INSERT INTO enrollments (user_id, subject_id) VALUES (1, 1);
