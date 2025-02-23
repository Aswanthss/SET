const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const auth = require('../middleware/auth');

// Get chat messages for a user
router.get('/messages', auth, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM chat_messages WHERE user_id = $1 ORDER BY created_at ASC',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Send a message
router.post('/messages', auth, async (req, res) => {
    try {
        const { message } = req.body;
        const result = await pool.query(
            'INSERT INTO chat_messages (user_id, message, is_admin_message) VALUES ($1, $2, false) RETURNING *',
            [req.user.id, message]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Get all chat messages
router.get('/admin/messages', auth, async (req, res) => {
    try {
        if (!req.user.is_admin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const result = await pool.query(
            'SELECT cm.*, u.name as user_name, u.email as user_email FROM chat_messages cm JOIN users u ON cm.user_id = u.id ORDER BY cm.created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get admin messages error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Send a response
router.post('/admin/messages/:userId', auth, async (req, res) => {
    try {
        if (!req.user.is_admin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { userId } = req.params;
        const { message } = req.body;
        
        const result = await pool.query(
            'INSERT INTO chat_messages (user_id, message, is_admin_message) VALUES ($1, $2, true) RETURNING *',
            [userId, message]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Send admin message error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
