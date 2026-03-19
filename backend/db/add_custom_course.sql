-- Add custom course data

INSERT IGNORE INTO subjects (id, title, slug, description, is_published, price) VALUES 
(4, 'Unlimited Course Masterclass', 'unlimited-course-masterclass', 'This is the premium custom course created with specific learning tracks.', 1, 99.99);

INSERT IGNORE INTO sections (id, subject_id, title, order_index) VALUES 
(3, 4, 'Core Courses', 1);

INSERT IGNORE INTO videos (section_id, title, youtube_url, order_index, duration_seconds) VALUES 
(3, 'Course 1: Complete HTML Course (Fundamentals)',          'https://www.youtube.com/watch?v=VaSjiJMrq24&t=0', 1, 0),
(3, 'Course 2: How to Learn AI (Step-by-Step Guide)',         'https://www.youtube.com/watch?v=VaSjiJMrq24&t=600', 2, 0),
(3, 'Course 3: Python Programming for Data Science',          'https://www.youtube.com/watch?v=VaSjiJMrq24&t=1800', 3, 0),
(3, 'Course 4: Full-Stack Web Development',                   'https://www.youtube.com/watch?v=VaSjiJMrq24&t=3600', 4, 0),
(3, 'Course 5: Machine Learning and Deep Learning',           'https://www.youtube.com/watch?v=VaSjiJMrq24&t=5400', 5, 0),
(3, 'Course 6: Cybersecurity and Ethical Hacking',            'https://www.youtube.com/watch?v=VaSjiJMrq24&t=7200', 6, 0),
(3, 'Course 7: Digital Marketing and SEO',                    'https://www.youtube.com/watch?v=VaSjiJMrq24&t=9000', 7, 0),
(3, 'Course 8: Graphic Design & Creative UI/UX',              'https://www.youtube.com/watch?v=VaSjiJMrq24&t=10800', 8, 0),
(3, 'Course 9: Cloud Computing with AWS & Azure',             'https://www.youtube.com/watch?v=VaSjiJMrq24&t=12600', 9, 0);
