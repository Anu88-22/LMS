-- Add custom course data

INSERT IGNORE INTO subjects (id, title, slug, description, is_published, price) VALUES 
(4, 'The Ultimate User Masterclass', 'ultimate-user-masterclass', 'This is the premium custom course created using the YouTube videos you specifically requested.', 1, 99.99);

INSERT IGNORE INTO sections (id, subject_id, title, order_index) VALUES 
(3, 4, 'Core Lessons', 1);

INSERT IGNORE INTO videos (section_id, title, youtube_url, order_index, duration_seconds) VALUES 
(3, 'Welcome to The Ultimate User Masterclass',   'https://www.youtube.com/watch?v=sNjyOSADDxE', 1, 0),
(3, 'Understanding User Psychology & Behavior',   'https://www.youtube.com/watch?v=npJB3PKiKQ4', 2, 0),
(3, 'UX Research Methods & Techniques',           'https://www.youtube.com/watch?v=7g-jXZ735G8', 3, 0),
(3, 'Designing Intuitive User Interfaces',        'https://www.youtube.com/watch?v=VaSjiJMrq24', 4, 0),
(3, 'User Journey Mapping & Personas',            'https://www.youtube.com/watch?v=YhRfgYH_AoU', 5, 0),
(3, 'Usability Testing & Feedback Loops',         'https://www.youtube.com/watch?v=FtQk_tPnD4I', 6, 0),
(3, 'Accessibility & Inclusive Design',           'https://www.youtube.com/watch?v=G3e-cpL7ofc', 7, 0),
(3, 'Analytics & Measuring User Success',         'https://www.youtube.com/watch?v=ufcT-f1Os6E', 8, 0),
(3, 'Capstone: Building a User-Centric Product',  'https://www.youtube.com/watch?v=K5KVEU3aaeQ', 9, 0);
