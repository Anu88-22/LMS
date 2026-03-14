import { pool } from '../../config/db';

export const enrollUser = async (userId: number, subjectId: number): Promise<void> => {
    await pool.query(
        'INSERT IGNORE INTO enrollments (user_id, subject_id) VALUES (?, ?)',
        [userId, subjectId]
    );
};

export const isUserEnrolled = async (userId: number, subjectId: number): Promise<boolean> => {
    const [rows] = await pool.query(
        'SELECT id FROM enrollments WHERE user_id = ? AND subject_id = ?',
        [userId, subjectId]
    );
    return (rows as any[]).length > 0;
};

export const getUserEnrollments = async (userId: number): Promise<number[]> => {
    const [rows] = await pool.query(
        'SELECT subject_id FROM enrollments WHERE user_id = ?',
        [userId]
    );
    return (rows as any[]).map((r) => r.subject_id);
};
