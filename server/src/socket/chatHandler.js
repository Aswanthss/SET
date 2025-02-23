const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const setupChatHandlers = (io) => {
    // Middleware to authenticate socket connections
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                throw new Error('Authentication error');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const result = await pool.query(
                'SELECT id, role FROM users WHERE id = $1',
                [decoded.id]
            );

            if (!result.rows[0]) {
                throw new Error('User not found');
            }

            socket.user = result.rows[0];
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', async (socket) => {
        console.log(`User connected: ${socket.user.id}`);

        // Create or get active chat session for user
        if (socket.user.role !== 'admin') {
            try {
                const sessionResult = await pool.query(
                    `INSERT INTO chat_sessions (user_id, status)
                     SELECT $1, 'active'
                     WHERE NOT EXISTS (
                         SELECT 1 FROM chat_sessions 
                         WHERE user_id = $1 AND status = 'active'
                     )
                     RETURNING id`,
                    [socket.user.id]
                );

                if (sessionResult.rows[0]) {
                    socket.sessionId = sessionResult.rows[0].id;
                } else {
                    const existingSession = await pool.query(
                        'SELECT id FROM chat_sessions WHERE user_id = $1 AND status = $1',
                        [socket.user.id, 'active']
                    );
                    socket.sessionId = existingSession.rows[0].id;
                }

                // Join user to their own room
                socket.join(`user_${socket.user.id}`);
            } catch (error) {
                console.error('Error creating chat session:', error);
            }
        } else {
            // Admin joins all active session rooms
            const activeSessions = await pool.query(
                'SELECT user_id FROM chat_sessions WHERE status = $1',
                ['active']
            );
            activeSessions.rows.forEach(session => {
                socket.join(`user_${session.user_id}`);
            });
        }

        // Handle user messages
        socket.on('user_message', async (data) => {
            try {
                const result = await pool.query(
                    `INSERT INTO chat_messages 
                     (user_id, message, is_admin_message, read_by_admin)
                     VALUES ($1, $2, false, false)
                     RETURNING *`,
                    [socket.user.id, data.message]
                );

                const message = result.rows[0];

                // Update session timestamp
                await pool.query(
                    'UPDATE chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND status = $2',
                    [socket.user.id, 'active']
                );

                // Emit to user's room and all admin sockets
                io.to(`user_${socket.user.id}`).emit('message', message);
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });

        // Handle admin messages
        socket.on('admin_message', async (data) => {
            if (socket.user.role !== 'admin') return;

            try {
                const result = await pool.query(
                    `INSERT INTO chat_messages 
                     (user_id, message, is_admin_message, read_by_user)
                     VALUES ($1, $2, true, false)
                     RETURNING *`,
                    [data.userId, data.message]
                );

                const message = result.rows[0];

                // Update session timestamp
                await pool.query(
                    'UPDATE chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
                    [data.sessionId]
                );

                // Emit to specific user's room
                io.to(`user_${data.userId}`).emit('message', message);
            } catch (error) {
                console.error('Error saving admin message:', error);
            }
        });

        // Handle typing indicators
        socket.on('user_typing', () => {
            if (socket.user.role !== 'admin') {
                io.emit('user_typing', { userId: socket.user.id });
            }
        });

        socket.on('admin_typing', (data) => {
            if (socket.user.role === 'admin') {
                io.to(`user_${data.userId}`).emit('admin_typing');
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user.id}`);
        });
    });
};

module.exports = setupChatHandlers;
