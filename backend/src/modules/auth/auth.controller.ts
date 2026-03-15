import { Request, Response } from 'express';
import { findUserByEmail, createUser, saveRefreshToken, validateRefreshToken, revokeRefreshToken, findUserById } from '../users/user.model';
import { hashPassword, verifyPassword } from '../../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { cookieOptions } from '../../config/security';
import crypto from 'crypto';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashed = await hashPassword(password);
        const userId = await createUser(email, hashed, name);

        // Generate tokens
        const accessToken = generateAccessToken(userId);
        const refreshToken = generateRefreshToken(userId);

        // Hash refresh token for DB
        const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        await saveRefreshToken(userId, tokenHash, expiresAt);

        // Set cookie
        res.cookie('refreshToken', refreshToken, cookieOptions);

        res.status(201).json({ accessToken, user: { id: userId, email, name } });
    } catch (err) {
        console.error("REGISTRATION ERROR DETAILS:", err);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const valid = await verifyPassword(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        await saveRefreshToken(user.id, tokenHash, expiresAt);

        res.cookie('refreshToken', refreshToken, cookieOptions);

        res.json({ accessToken, user: { id: user.id, email: user.email, name: user.name } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during login' });
    }
};

export const refresh = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({ error: 'No refresh token provided' });
        }

        let payload;
        try {
            payload = verifyRefreshToken(refreshToken);
        } catch (e) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const isValid = await validateRefreshToken(tokenHash);

        if (!isValid) {
            return res.status(401).json({ error: 'Refresh token revoked or expired' });
        }

        const user = await findUserById(payload.userId);
        if (!user) {
            return res.status(401).json({ error: 'User no longer exists' });
        }

        const accessToken = generateAccessToken(user.id);
        res.json({ accessToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during token refresh' });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.cookies;
        if (refreshToken) {
            const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
            await revokeRefreshToken(tokenHash);
            res.clearCookie('refreshToken', { domain: cookieOptions.domain });
        }
        res.json({ status: 'ok' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during logout' });
    }
};
