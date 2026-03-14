import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface JwtPayload {
    userId: number;
}

export const generateAccessToken = (userId: number): string => {
    return jwt.sign({ userId }, config.jwt.accessSecret, {
        expiresIn: config.jwt.accessLifetime as any,
    });
};

export const generateRefreshToken = (userId: number): string => {
    return jwt.sign({ userId }, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshLifetime as any,
    });
};

export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
};
