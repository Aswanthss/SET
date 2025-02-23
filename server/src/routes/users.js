const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { auth, checkPermission } = require('../middleware/auth');
const pool = require('../config/db');

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING *',
            [email, hashedPassword, name]
        );

        // Assign default permissions for new user
        const defaultPermissions = ['manage_expenses', 'view_analytics'];
        await Promise.all(defaultPermissions.map(async (permName) => {
            const permResult = await pool.query(
                'SELECT id FROM permissions WHERE name = $1',
                [permName]
            );
            if (permResult.rows[0]) {
                await pool.query(
                    'INSERT INTO user_permissions (user_id, permission_id) VALUES ($1, $2)',
                    [result.rows[0].id, permResult.rows[0].id]
                );
            }
        }));

        const token = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET);
        res.status(201).json({ user: result.rows[0], token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query(
            'SELECT users.*, array_agg(permissions.name) as permissions FROM users ' +
            'LEFT JOIN user_permissions ON users.id = user_permissions.user_id ' +
            'LEFT JOIN permissions ON user_permissions.permission_id = permissions.id ' +
            'WHERE email = $1 ' +
            'GROUP BY users.id',
            [email]
        );

        const user = result.rows[0];
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            throw new Error('Invalid login credentials');
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        delete user.password_hash;
        res.json({ user: { ...user, permissions: user.permissions.filter(p => p !== null) }, token });
    } catch (error) {
        res.status(401).json({ error: 'Invalid login credentials' });
    }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        delete req.user.password_hash;
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user permissions (admin only)
router.post('/permissions/:userId', auth, checkPermission('manage_users'), async (req, res) => {
    try {
        const { userId } = req.params;
        const { permissions } = req.body;

        await pool.query('DELETE FROM user_permissions WHERE user_id = $1', [userId]);

        if (permissions && permissions.length) {
            const permissionValues = permissions.map(p => `('${p}')`).join(',');
            const permResult = await pool.query(
                `SELECT id FROM permissions WHERE name IN (${permissionValues})`
            );

            await Promise.all(permResult.rows.map(async (perm) => {
                await pool.query(
                    'INSERT INTO user_permissions (user_id, permission_id) VALUES ($1, $2)',
                    [userId, perm.id]
                );
            }));
        }

        res.json({ message: 'Permissions updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user role (admin only)
router.post('/role/:userId', auth, checkPermission('manage_users'), async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        const result = await pool.query(
            'UPDATE users SET role = $1 WHERE id = $2 RETURNING *',
            [role, userId]
        );

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
