-- Add custom course data

INSERT IGNORE INTO subjects (id, title, slug, description, is_published, price) VALUES 
(4, 'The Ultimate User Masterclass', 'ultimate-user-masterclass', 'This is the premium custom course created using the YouTube videos you specifically requested.', 1, 99.99);

INSERT IGNORE INTO sections (id, subject_id, title, order_index) VALUES 
(3, 4, 'Core Lessons', 1);

INSERT IGNORE INTO videos (section_id, title, youtube_url, order_index, duration_seconds) VALUES 
(3, 'Introduction to Prompt Engineering',          'https://www.youtube.com/watch?v=VaSjiJMrq24&t=0', 1, 0),
(3, 'How Large Language Models Work',              'https://www.youtube.com/watch?v=VaSjiJMrq24&t=600', 2, 0),
(3, 'Zero-Shot vs Few-Shot Prompting',             'https://www.youtube.com/watch?v=VaSjiJMrq24&t=1800', 3, 0),
(3, 'Chain of Thought Prompting Techniques',       'https://www.youtube.com/watch?v=VaSjiJMrq24&t=3600', 4, 0),
(3, 'Advanced Prompt Patterns for Coding',         'https://www.youtube.com/watch?v=VaSjiJMrq24&t=5400', 5, 0),
(3, 'Avoiding Hallucinations & Biases',            'https://www.youtube.com/watch?v=VaSjiJMrq24&t=7200', 6, 0),
(3, 'Prompt Engineering for Business',             'https://www.youtube.com/watch?v=VaSjiJMrq24&t=9000', 7, 0),
(3, 'Iterative Prompt Development',                'https://www.youtube.com/watch?v=VaSjiJMrq24&t=10800', 8, 0),
(3, 'Capstone: Designing an AI Agent Prompt',      'https://www.youtube.com/watch?v=VaSjiJMrq24&t=12600', 9, 0);
