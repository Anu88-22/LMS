import mysql from 'mysql2/promise';
import { config } from './env';

const poolConfig: any = config.db.url 
    ? { uri: config.db.url }
    : {
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.pass,
        database: config.db.name,
    };

export const pool = mysql.createPool({
    ...poolConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
    ssl: config.db.url.includes('aivencloud.com') ? { rejectUnauthorized: false } : undefined
});
