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
-- Advanced React (Subject 3) — React Full Course by Mosh Hamedani with timestamps
(6, 'Introduction & What is React?',           'https://www.youtube.com/watch?v=SqcY0GlETPk&t=0',    1, 0),
(6, 'Setting Up the Development Environment',  'https://www.youtube.com/watch?v=SqcY0GlETPk&t=183',  2, 0),
(6, 'React Components & JSX',                  'https://www.youtube.com/watch?v=SqcY0GlETPk&t=465',  3, 0),
(6, 'Props & Component Communication',         'https://www.youtube.com/watch?v=SqcY0GlETPk&t=900',  4, 0),
(6, 'useState Hook & State Management',        'https://www.youtube.com/watch?v=SqcY0GlETPk&t=1500', 5, 0),
(6, 'useEffect Hook & Side Effects',           'https://www.youtube.com/watch?v=SqcY0GlETPk&t=2100', 6, 0),
(7, 'useContext & Context API',                'https://www.youtube.com/watch?v=SqcY0GlETPk&t=2700', 1, 0),
(7, 'useReducer for Complex State',            'https://www.youtube.com/watch?v=SqcY0GlETPk&t=3300', 2, 0),
(7, 'Custom Hooks',                            'https://www.youtube.com/watch?v=SqcY0GlETPk&t=3900', 3, 0),
(7, 'React Router & Navigation',               'https://www.youtube.com/watch?v=SqcY0GlETPk&t=4500', 4, 0),
(7, 'Fetching Data with Axios',                'https://www.youtube.com/watch?v=SqcY0GlETPk&t=5100', 5, 0),
(7, 'Performance Optimization & useMemo',      'https://www.youtube.com/watch?v=SqcY0GlETPk&t=5700', 6, 0);

-- Make user enrolled in Java Masterclass
INSERT INTO enrollments (user_id, subject_id) VALUES (1, 1);
