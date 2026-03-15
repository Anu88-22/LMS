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
-- Advanced React (Subject 3)
(6, 'Intro to re-renders', 'https://www.youtube.com/watch?v=qTDnwmMF5q8', 1, 0),
(6, 'Elements, Children and Re-renders', 'https://www.youtube.com/watch?v=qTDnwmMF5q8', 2, 0),
(7, 'Components as props', 'https://www.youtube.com/watch?v=qTDnwmMF5q8', 1, 0);

-- Make user enrolled in Java Masterclass
INSERT INTO enrollments (user_id, subject_id) VALUES (1, 1);
