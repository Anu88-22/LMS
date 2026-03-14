import app from './app';
import { config } from './config/env';
import { pool } from './config/db';

const startServer = async () => {
    try {
        // Validate DB Connection
        await pool.getConnection();
        console.log('Connected to Database successfully!');

        app.listen(config.port, () => {
            console.log(`LMS Backend running strictly ordered server on port ${config.port}`);
        });
    } catch (err) {
        console.error('Failed to start server. DB Connection error:', err);
        process.exit(1);
    }
};

startServer();
