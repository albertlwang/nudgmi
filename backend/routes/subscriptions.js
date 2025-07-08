// API for interacting with a user's subscriptions

const express = require('express');
const router = express.Router();
const { getUserSubs, createUserSub, deleteSub } = require('../db/db');

// GET /api/subscriptions?user_id=xyz
router.get('/subscriptions', async (req, res) => {
    const { user_id } = req.query;
    if(!user_id) {
        return res.status(400).json({ error: 'user_id is required.' });
    }

    try {
        const subscriptions = await getUserSubs(user_id);
        return res.status(200).json({ subscriptions });
    } catch (err) {
        console.error('[subscriptions] Unexpected error: ', err.message);
        return res.status(500).json({ error: 'Failed to fetch subscriptions.' });
    }
});

// POST /api/subscribe
router.post('/subscribe', async (req, res) => {
    const {user_id, source, topic } = req.body;
    if (!user_id || !source || !topic) {
        return res.status(400).json({ error: 'user_id, source, and topic are required.' });
    }

    try {
        const subscription = await createUserSub(user_id, source, topic);
        return res.status(201).json({ subscription });
    } catch (err) {
        if (err.message.includes('duplicate key')) {
            return res.status(409).json({ error: 'Duplicate subscription' });
        } else {
            return res.status(500).json({ error: 'Failed to create subscription' });
        }
    }
});

// DELETE /api/subscriptions/:id
router.delete('/subscriptions/:id', async (req, res) => {
    const { id: subscription_id } = req.params;
    if (!subscription_id) {
        return res.status(400).json({ error: 'subscription_id is required.' });
    }

    try {
        await deleteSub(subscription_id);
        return res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete subscription' });
    }
});

module.exports = router;