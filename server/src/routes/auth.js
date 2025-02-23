const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

// Input validation middleware
const validateInput = (req, res, next) => {
    const { email, password, name } = req.body;
    const errors = {};

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!password || password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
    }

    if (req.path === '/register' && (!name || name.trim().length === 0)) {
        errors.name = 'Name is required';
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ 
            message: 'Validation failed',
            errors 
        });
    }

    next();
};

// Register
router.post('/register', validateInput, async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        // Check if user exists
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ 
                message: 'Registration failed',
                errors: {
                    email: 'An account with this email already exists'
                }
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const result = await pool.query(
            'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, is_admin',
            [email, hashedPassword, name]
        );

        const user = result.rows[0];

        // Create token
        const token = jwt.sign(
            { id: user.id, email: user.email, is_admin: user.is_admin },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                is_admin: user.is_admin
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ 
            message: 'Registration failed',
            errors: {
                server: 'An unexpected error occurred. Please try again later.'
            }
        });
    }
});

// Login
router.post('/login', validateInput, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user exists
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ 
                message: 'Login failed',
                errors: {
                    email: 'No account found with this email'
                }
            });
        }

        const user = result.rows[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                message: 'Login failed',
                errors: {
                    password: 'Incorrect password'
                }
            });
        }

        // Create token
        const token = jwt.sign(
            { id: user.id, email: user.email, is_admin: user.is_admin },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                is_admin: user.is_admin
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Login failed',
            errors: {
                server: 'An unexpected error occurred. Please try again later.'
            }
        });
    }
});

module.exports = router;
