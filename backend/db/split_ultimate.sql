-- New subjects split from the Ultimate Course
INSERT IGNORE INTO subjects (id, title, slug, description, is_published, price) VALUES 
(5, 'Complete HTML Course', 'html-course', 'Master the fundamentals of HTML5 and modern web structuring.', 1, 0.00),
(6, 'How to Learn AI', 'learn-ai', 'A step-by-step roadmap to becoming an AI and Machine Learning expert.', 1, 0.00),
(7, 'Professional Python Programming', 'python-pro', 'Go from basics to advanced professional Python coding.', 1, 0.00),
(8, 'Full-Stack Web Development', 'web-dev-stack', 'Build full-stack applications using the MERN stack and beyond.', 1, 0.00),
(9, 'Machine Learning Foundations', 'ml-foundations', 'Deep dive into neural networks, data science, and AI models.', 1, 0.00),
(10, 'Cybersecurity Bootcamp', 'cyber-security', 'Learn ethical hacking, network security, and digital defense.', 1, 0.00),
(11, 'Digital Marketing Strategy', 'digital-marketing', 'Master SEO, social media marketing, and data-driven advertising.', 1, 0.00),
(12, 'Graphic Design & UI/UX', 'graphic-design', 'Design stunning user interfaces and professional creative assets.', 1, 0.00),
(13, 'Cloud Computing Masterclass', 'cloud-computing', 'Deploy apps at scale using AWS, Azure, and Google Cloud.', 1, 0.00);

-- Sections for each new subject
INSERT IGNORE INTO sections (id, subject_id, title, order_index) VALUES 
(10, 5, 'HTML Fundamentals', 1),
(11, 6, 'AI Roadmap', 1),
(12, 7, 'Python Advanced', 1),
(13, 8, 'Full-Stack Projects', 1),
(14, 9, 'ML Core', 1),
(15, 10, 'Ethical Hacking', 1),
(16, 11, 'Marketing Strategy', 1),
(17, 12, 'UI/UX Design', 1),
(18, 13, 'Cloud Infrastructure', 1);

-- Videos moved to their respective new subjects
-- We use the same URLs with timestamps from the original Prompt Engineering masterclass video
INSERT IGNORE INTO videos (section_id, title, youtube_url, order_index, duration_seconds) VALUES 
(10, 'Course 1: Complete HTML Course (Fundamentals)',          'https://www.youtube.com/watch?v=VaSjiJMrq24&t=0', 1, 0),
(11, 'Course 2: How to Learn AI (Step-by-Step Guide)',         'https://www.youtube.com/watch?v=VaSjiJMrq24&t=600', 1, 0),
(12, 'Course 3: Professional Python Programming',              'https://www.youtube.com/watch?v=VaSjiJMrq24&t=1800', 1, 0),
(13, 'Course 4: Full-Stack Web Development',                   'https://www.youtube.com/watch?v=VaSjiJMrq24&t=3600', 1, 0),
(14, 'Course 5: Machine Learning and Deep Learning',           'https://www.youtube.com/watch?v=VaSjiJMrq24&t=5400', 1, 0),
(15, 'Course 6: Cybersecurity and Ethical Hacking',            'https://www.youtube.com/watch?v=VaSjiJMrq24&t=7200', 1, 0),
(16, 'Course 7: Digital Marketing and SEO',                    'https://www.youtube.com/watch?v=VaSjiJMrq24&t=9000', 1, 0),
(17, 'Course 8: Graphic Design & Creative UI/UX',              'https://www.youtube.com/watch?v=VaSjiJMrq24&t=10800', 1, 0),
(18, 'Course 9: Cloud Computing with AWS & Azure',             'https://www.youtube.com/watch?v=VaSjiJMrq24&t=12600', 1, 0);
