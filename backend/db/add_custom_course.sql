-- Add custom course data

INSERT IGNORE INTO subjects (id, title, slug, description, is_published, price) VALUES 
(4, 'The Ultimate User Masterclass', 'ultimate-user-masterclass', 'This is the premium custom course created using the YouTube videos you specifically requested.', 1, 99.99);

INSERT IGNORE INTO sections (id, subject_id, title, order_index) VALUES 
(3, 4, 'Core Lessons', 1);

INSERT IGNORE INTO videos (section_id, title, youtube_url, order_index, duration_seconds) VALUES 
(3, 'Welcome to The Ultimate User Masterclass',   'https://www.youtube.com/watch?v=zZ6vybT1HQs&t=0', 1, 0),
(3, 'Understanding User Psychology & Behavior',   'https://www.youtube.com/watch?v=zZ6vybT1HQs&t=600', 2, 0),
(3, 'UX Research Methods & Techniques',           'https://www.youtube.com/watch?v=zZ6vybT1HQs&t=1800', 3, 0),
(3, 'Designing Intuitive User Interfaces',        'https://www.youtube.com/watch?v=zZ6vybT1HQs&t=3600', 4, 0),
(3, 'User Journey Mapping & Personas',            'https://www.youtube.com/watch?v=zZ6vybT1HQs&t=5400', 5, 0),
(3, 'Usability Testing & Feedback Loops',         'https://www.youtube.com/watch?v=zZ6vybT1HQs&t=7200', 6, 0),
(3, 'Accessibility & Inclusive Design',           'https://www.youtube.com/watch?v=zZ6vybT1HQs&t=9000', 7, 0),
(3, 'Analytics & Measuring User Success',         'https://www.youtube.com/watch?v=zZ6vybT1HQs&t=10800', 8, 0),
(3, 'Capstone: Building a User-Centric Product',  'https://www.youtube.com/watch?v=zZ6vybT1HQs&t=12600', 9, 0);
