// Defines functions that interface with Youtube API

const axios = require('axios');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Helper function to extract channel_id from RSS feed link
function extractChannelId(rssUrl) {
    const match = rssUrl.match(/channel_id=([\w-]+)/);
    return match ? match[1] : null;
}

// Function to fetch profile icon for a Youtube channel based on RSS feed url (source)
// @param {string} rssUrl - YouTube RSS feed URL
// @returns {string|null} - Icon URL or null if not found
async function fetchIcon(source) {
    const channelId = extractChannelId(source);
    if (!channelId) {
        console.error('[YouTube] Failed to extract channel_id from RSS URL:', rssUrl);
        return null;
    }

    // Init Youtube API endpoint
    const endpoint = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${YOUTUBE_API_KEY}`;

    try {
        const res = await axios.get(endpoint);
        const item = res.data.items?.[0];

        if (!item || !item.snippet?.thumbnails) {
            console.error('[YouTube] Invalid API response for channel:', channelId);
            return null;
        }

        // Prefer high-quality images if available
        return (
            item.snippet.thumbnails.high?.url ||
            item.snippet.thumbnails.medium?.url ||
            item.snippet.thumbnails.default?.url ||
            null
        );
    } catch (err) {
        console.error('[YouTube] Error fetching icon:', err.message);
        return null;
    }
}

module.exports = { fetchIcon };
