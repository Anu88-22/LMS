import { pool } from '../../config/db';

export const getAllSubjects = async () => {
    const [rows] = await pool.query('SELECT id, title, slug, description, price FROM subjects WHERE is_published = 1');
    return rows;
};

export const getSubjectById = async (id: number) => {
    const [rows] = await pool.query('SELECT id, title, slug, description, price FROM subjects WHERE id = ? AND is_published = 1', [id]);
    const subjects = rows as any[];
    return subjects.length > 0 ? subjects[0] : null;
};
