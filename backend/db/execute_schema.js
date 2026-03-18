const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// READ THESE FROM RAILWAY
const DB_HOST = process.argv[2];
const DB_PORT = process.argv[3];
const DB_USER = process.argv[4];
const DB_PASS = process.argv[5];
const DB_NAME = process.argv[6] || 'railway';

async function runSchema() {
    if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASS) {
        console.error("Usage: node execute_schema.js <host> <port> <user> <password> [dbname]");
        process.exit(1);
    }

    try {
        console.log(`Connecting to ${DB_HOST}:${DB_PORT} as ${DB_USER}...`);
        const connection = await mysql.createConnection({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASS,
            database: DB_NAME,
            multipleStatements: true
        });

        console.log("Connected successfully! Reading schema.sql...");
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaQuery = fs.readFileSync(schemaPath, 'utf8');

        console.log("Executing schema...");
        await connection.query(schemaQuery);

        console.log("Schema executed successfully! Your tables are ready on Railway.");
        connection.end();
    } catch (error) {
        console.error("Fatal Error preparing database:", error);
        process.exit(1);
    }
}

runSchema();
