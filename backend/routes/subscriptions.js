// API for interacting with a user's subscriptions

const express = require('express');
const router = express.Router();
const { getUserSubs, createUserSub, fetchIconUrl, deleteSub, getIconUrl } = require('../db/db');
const { getChannelUri } = require('../services/youtube');

// GET /api/subscriptions?user_id=xyz
// Returns all rows of subscriptions tables for given user
// Low level
router.get('/subscriptions', async (req, res) => {
    const { user_id } = req.query;
    if (!user_id) {
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

// GET /api/sources?user_id=xyz
// Returns all distinct sources a given user is subscribed to, along with metadata for each source
// Sort in alphabetical order by author
router.get('/sources', async (req, res) => {
    const { user_id } = req.query;
    if (!user_id) {
        return res.status(400).json({ error: 'user_id is required.' });
    }

    try {
        const subscriptions = await getUserSubs(user_id);

        const grouped = {};

        for (const sub of subscriptions) {
            const { source, topic, author, id } = sub;

            if (!grouped[source]) {
                grouped[source] = { source: source, author: author, topics: [topic], ids: [id] };
            } else {
                grouped[source].topics.push(topic);
                grouped[source].ids.push(id);
            }
        }
        // Enrich with metadata, Promise.all to handle multiple async functions in parallel
        const sources = await Promise.all(
            Object.values(grouped)
            .sort((a, b) => a.author.localeCompare(b.author)) // Sort alphabetically by author
            .map(async (group) => {
                // Get extra metadata
                const channel_uri = await getChannelUri(group.source);
                const icon_url = await getIconUrl(group.source);
                
                // Return new object with everything combined
                return {
                    source: group.source,
                    author: group.author,
                    channel_uri: channel_uri,
                    icon_url: icon_url,
                    topics: group.topics,
                    ids: group.ids,
                };
            })
        );

        return res.status(200).json({ sources });
    } catch (err) {
        console.error('[subscriptions] Unexpected error: ', err.message);
        return res.status(500).json({ error: 'Failed to fetch sources,' });
    }
})

// POST /api/subscribe
// Adds row in the subscription table for a given (user, source, topic)
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
// Deletes a row from the subscriptions table with the given subscription_id
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