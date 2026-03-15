INSERT IGNORE INTO users (email, password_hash, name) VALUES ('student@example.com', '$2b$10$fVHKz.O2.M44oW1Iu7oIaeT9NoflQ0V762tH7vJw6YmN5hXzLq9wG', 'John Doe');

INSERT IGNORE INTO subjects (id, title, slug, description, is_published) VALUES 
(1, 'Java Masterclass', 'java-masterclass', 'Learn Java from scratch to advanced.', 1),
(2, 'Python for Beginners', 'python-for-beginners', 'Your entry into the world of Python programming.', 1),
(3, 'Advanced React', 'advanced-react', 'Build scalable modern web apps.', 1);

INSERT IGNORE INTO sections (id, subject_id, title, order_index) VALUES 
(1, 1, 'Java Basics', 1),
(2, 1, 'Object Oriented Programming', 2),
(4, 2, 'Python Installation & Basics', 1),
(5, 2, 'Control Flow & Loops', 2);

INSERT IGNORE INTO videos (section_id, title, youtube_url, order_index, duration_seconds) VALUES 
(1, 'Introduction to Java', 'https://www.youtube.com/watch?v=WPvGqX-TXP0', 1, 600),
(1, 'Variables and Data Types', 'https://www.youtube.com/watch?v=WPvGqX-TXP0', 2, 800),
(2, 'Classes and Objects', 'https://www.youtube.com/watch?v=WPvGqX-TXP0', 1, 1200),
(4, 'Python Installation', 'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 1, 300),
(4, 'First Python Script', 'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 2, 450),
(5, 'If Statements in Python', 'https://www.youtube.com/watch?v=t2_Q2BRzeEE', 1, 500);

-- Make user enrolled in Java Masterclass
INSERT INTO enrollments (user_id, subject_id) VALUES (1, 1);
