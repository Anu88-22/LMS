import dotenv from 'dotenv';
dotenv.config();

export const config = {
    db: {
        url: process.env.DATABASE_URL || process.env.MYSQL_URL || '',
        host: process.env.MYSQLHOST || process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.MYSQLPORT || process.env.MYSQL_PORT || process.env.DB_PORT || '3306', 10),
        user: process.env.MYSQLUSER || process.env.MYSQL_USER || process.env.DB_USER || 'root',
        pass: process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || process.env.DB_PASS || '',
        name: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || process.env.DB_NAME || 'lms_db',
    },
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET || 'access_secret_key',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_key',
        accessLifetime: process.env.JWT_ACCESS_LIFETIME || '15m',
        refreshLifetime: process.env.JWT_REFRESH_LIFETIME || '30d',
    },
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    },
    cookie: {
        domain: process.env.COOKIE_DOMAIN || 'localhost',
    },
    port: parseInt(process.env.PORT || '5000', 10),
};
