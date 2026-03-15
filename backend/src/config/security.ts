import { config } from './env';

export const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || config.cors.origin === '*' || config.cors.origin === origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

export const cookieOptions: any = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

if (process.env.NODE_ENV === 'production' && config.cookie.domain !== 'localhost') {
    cookieOptions.domain = config.cookie.domain;
}
