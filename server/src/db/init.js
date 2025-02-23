const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function initializeDatabase() {
    try {
        // Read the schema file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split the schema into individual statements
        const statements = schema
            .split(';')
            .filter(statement => statement.trim().length > 0);

        // Execute each statement
        for (const statement of statements) {
            await pool.query(statement);
            console.log('Executed:', statement.slice(0, 50) + '...');
        }

        // Insert default admin user if not exists
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await pool.query(`
            INSERT INTO users (email, password_hash, name, role)
            SELECT $1, $2, 'Admin', 'admin'
            WHERE NOT EXISTS (
                SELECT 1 FROM users WHERE email = $1
            )
        `, [adminEmail, hashedPassword]);

        console.log('Database initialization completed successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Run the initialization
initializeDatabase();
