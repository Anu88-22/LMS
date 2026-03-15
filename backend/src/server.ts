import app from './app';
import { config } from './config/env';
import { pool } from './config/db';

const startServer = async () => {
    try {
        // Validate DB Connection
        await pool.getConnection();
        console.log('Connected to Database successfully!');

        app.listen(config.port, '0.0.0.0', () => {
            console.log(`LMS Backend running on 0.0.0.0:${config.port}`);
        });
    } catch (err) {
        console.error('Failed to start server. DB Connection error:', err);
        process.exit(1);
    }
};

startServer();
