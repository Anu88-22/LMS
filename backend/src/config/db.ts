import mysql from 'mysql2/promise';
import { config } from './env';

const poolOptions: any = config.db.url 
    ? config.db.url + (config.db.url.includes('?') ? '&' : '?') + 'multipleStatements=true'
    : {
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.pass,
        database: config.db.name,
        multipleStatements: true,
    };

export const pool = mysql.createPool(poolOptions);
