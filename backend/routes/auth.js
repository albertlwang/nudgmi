// API for user creation and authentication
const express = require('express');
const router = express.Router();
const { getOrCreateUser } = require('../db/db');

// POST /api/register
router.post('/register', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.'});

    try {
        const { id, created } = await getOrCreateUser(email);
        return res.status(created ? 201 : 200).json({ user_id: id, created });
    } catch (err) {
        console.error('[register] Unexpected error: ', err.message);
        return res.status(500).json({ error: 'Unexpected server error.' });
    }
});

module.exports = router;