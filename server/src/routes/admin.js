const express = require('express');
const { auth, checkPermission } = require('../middleware/auth');
const pool = require('../config/db');

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    next();
};

// Get all users
router.get('/users', auth, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete user
router.delete('/users/:userId', auth, isAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all support messages
router.get('/support-messages', auth, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT sm.*, 
                    json_build_object('name', u.name, 'email', u.email) as user
             FROM support_messages sm
             JOIN users u ON sm.user_id = u.id
             ORDER BY sm.created_at DESC`
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Respond to support message
router.post('/support-messages/:messageId/respond', auth, isAdmin, async (req, res) => {
    try {
        const { messageId } = req.params;
        const { response } = req.body;

        const result = await pool.query(
            `UPDATE support_messages 
             SET admin_response = $1, 
                 response_at = CURRENT_TIMESTAMP,
                 status = 'responded'
             WHERE id = $2
             RETURNING *`,
            [response, messageId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Message not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
