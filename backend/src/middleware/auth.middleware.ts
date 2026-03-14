import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthRequest extends Request {
    userId?: number;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = verifyAccessToken(token);
        req.userId = payload.userId;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
    }
};
