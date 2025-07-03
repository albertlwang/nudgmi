// API for retrieving a user's personal feed

const express = require('express');
const router = express.Router();
const { getUserFeed } = require('../db/db');

// GET /api/feed?user_id=...&topic=...&after=...&limit=...
router.get('/feed', async (req, res) => {
    const { user_id, source, topic, after, limit } = req.query;

    if (!user_id) {
        return res.status(400).json({ error: 'user_id is required.'});
    }

    try {
        const posts = await getUserFeed(user_id, {
            source,
            topic,
            after,
            limit: limit ? parseInt(limit) : undefined,
        });
        
        return res.status(200).json({ posts });
    } catch (err) {
        console.error('[feed] Error:', err.message);
        return res.status(500).json({ error: 'Unexpected server error' });
    }
});

module.exports = router;