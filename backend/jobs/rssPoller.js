// A cron job that calls that function every few minutes.
// Defines the cron job.

// Import node-cron
const cron = require('node-cron');

// Import your function from rssService.js
const { fetchRSSItems } = require('../services/rssService');
const { postExists, getAllSubscriptions, savePost, saveUserPost } = require('../db/db');
const { classifyPost, summarizePost } = require('../services/aiServices');

// In memory cache of most recent post link per source
const latestSeenLinks = {};

cron.schedule('* * * * *', async () => { // Runs this code [1] minute
    try {
        // Fetch all subscriptions
        const subscriptions = await getAllSubscriptions();

        // Group subscriptions by feed source
        const subsBySource = {};
        for (const sub of subscriptions) {
            if (!subsBySource[sub.source]) {
                subsBySource[sub.source] = [];
            }
            subsBySource[sub.source].push(sub);
        }

        // Iterate over each unique source/feed
        for (const [source, subs] of Object.entries(subsBySource)) {
            const feed_items = await fetchRSSItems(source);

            let newPostCount = 0;

            // For each RSS item in this source, update posts table
            for (const item of feed_items) { // Check if its link exists in post table
                // Check in-memory cache for matches -> anything after match must already be seen
                if (latestSeenLinks[source] && item.link === latestSeenLinks[source]) {
                    console.log(`[rssPoller] Reached last seen post for ${source}, stopping early.`);
                    break;
                }
                
                // Fully check database: if exists, skip (do nothing)
                if (await postExists(item.link)) {
                    //console.log(`[rssPoller] Skipped seen post: ${item.title}`);
                    continue;
                }

                // Otherwise, this is a new post and we should insert into posts table
                await savePost(item, source);
                newPostCount++;

                // Classify this item based on topic, for every subscription on this source
                for (const sub of subs) {
                    const isRelevant = await classifyPost(item, sub.topic);

                    // Skip irrelevant posts
                    if (!isRelevant) { // Skip irrelevant posts
                        //console.log(`[rssPoller] Skipped irrelevant post: ${item.title}`);
                        continue;
                    }

                    // Otherwise, insert relevant and new post into user_posts table
                    const summary = await summarizePost(item);      // Get AI-generated summary
                    await saveUserPost(item, sub, summary);

                    console.log(`[rssPoller] Relevant post saved for user ${sub.user_id}: ${item.title}`);
                }
            }

            // Update the cache with the newest post (first in the list)
            if (feed_items.length > 0) {
                latestSeenLinks[source] = feed_items[0].link;
                console.log(`[rssPoller] Cached latest post for ${source}: ${latestSeenLinks[source]}`);
            }
        }
        console.log(`[rssPoller] Job completed at ${new Date().toISOString()}`);
    } catch (err) {
        console.error('[rssPoller] Job failed: ', err.message);
    }
});