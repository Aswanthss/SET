const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const auth = require('../middleware/auth');

// Get all expenses for a user
router.get('/', auth, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get expenses error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add new expense
router.post('/', auth, async (req, res) => {
    try {
        const { amount, category, description, date } = req.body;
        const result = await pool.query(
            'INSERT INTO expenses (user_id, amount, category, description, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [req.user.id, amount, category, description, date]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Add expense error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update expense
router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, category, description, date } = req.body;
        
        const result = await pool.query(
            'UPDATE expenses SET amount = $1, category = $2, description = $3, date = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 AND user_id = $6 RETURNING *',
            [amount, category, description, date, id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update expense error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Delete expense error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Sync expenses
router.post('/sync', auth, async (req, res) => {
    try {
        const { expenses } = req.body;
        const results = [];

        for (const expense of expenses) {
            const result = await pool.query(
                'INSERT INTO expenses (user_id, amount, category, description, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [req.user.id, expense.amount, expense.category, expense.description, expense.date]
            );
            results.push(result.rows[0]);
        }

        res.json(results);
    } catch (error) {
        console.error('Sync expenses error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
