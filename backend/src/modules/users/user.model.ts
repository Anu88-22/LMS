import { pool } from '../../config/db';

export interface User {
    id: number;
    email: string;
    password_hash: string;
    name: string;
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
};

export const findUserById = async (id: number): Promise<User | null> => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
};

export const createUser = async (email: string, password_hash: string, name: string): Promise<number> => {
    const [result] = await pool.query(
        'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
        [email, password_hash, name]
    );
    return (result as any).insertId;
};

export const saveRefreshToken = async (userId: number, tokenHash: string, expiresAt: Date) => {
    await pool.query(
        'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
        [userId, tokenHash, expiresAt]
    );
};

export const revokeRefreshToken = async (tokenHash: string) => {
    await pool.query(
        'UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP WHERE token_hash = ?',
        [tokenHash]
    );
};

export const validateRefreshToken = async (tokenHash: string): Promise<boolean> => {
    const [rows] = await pool.query(
        'SELECT * FROM refresh_tokens WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > CURRENT_TIMESTAMP',
        [tokenHash]
    );
    return (rows as any[]).length > 0;
};
