// A cron job that calls that function every few minutes.
// Defines the cron job.

// Import node-cron
const cron = require('node-cron');

// Import your function from rssService.js
const { fetchRSSItems } = require('../services/rssService');
const { postExists, savePost } = require('../db/db');
const { classifyPost } = require('../services/aiServices');

cron.schedule('* * * * *', async () => { // Runs this code [1] minute
    try {
        const source = process.env.RSS_FEED_URL;
        const feed_items = await fetchRSSItems(source);

        let newPostCount = 0;

        // For each RSS item
        for (const item of feed_items) { // Check if its link exists in posts table
            // If exists, skip (do nothing)
            if (await postExists(item.link)) {
                continue;
            }

            // Check if post is relevant (OpenAI filtering)
            const topic = "new song release";
            const isRelevant = await classifyPost(item, topic);
            if (!isRelevant) { // Skip irrelevant posts
                console.log(`[rssPoller] Skipped irrelevant post: ${item.title}`);
                continue;
            }

            // Otherwise, it doesn't exists AND is relevant and we process new post
            await savePost(item, source); // Insert into table

            // TODO: Process, filter, etc.
            console.log(`[rssPoller] New post saved: ${item.title}`);
            newPostCount++;
        }

        // Optionally log that the job ran, and how many items it found
        console.log(`[rssPoller] Job ran. Fetched ${feed_items.length} (${newPostCount} new items)`);
    } catch (err) {
        console.log('[rssPoller] Job failed: ', err.message);
    }  
});