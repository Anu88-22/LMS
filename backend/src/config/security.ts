import { config } from './env';

export const corsOptions = {
    origin: config.cors.origin,
    credentials: true,
};

export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const, // For local dev it's often 'lax', for production 'strict' or 'none' with secure
    domain: config.cookie.domain,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};
