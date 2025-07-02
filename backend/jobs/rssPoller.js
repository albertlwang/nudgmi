// A cron job that calls that function every few minutes.
// Defines the cron job.

// Import node-cron
const cron = require('node-cron');

// Import your function from rssService.js
const { fetchRSSItems } = require('../services/rssService');
const { postExists, getAllSubscriptions, savePost, saveUserPost } = require('../db/db');
const { classifyPost } = require('../services/aiServices');

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
                // If exists, skip (do nothing)
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
                    await saveUserPost(item, sub);

                    console.log(`[rssPoller] Relevant post saved for user ${sub.user_id}: ${item.title}`);
                }
            }
        }
        console.log(`[rssPoller] Job completed at ${new Date().toISOString()}`);
    } catch (err) {
        console.error('[rssPoller] Job failed: ', err.message);
    }
});






//     try {
//         const source = process.env.RSS_FEED_URL;
//         const feed_items = await fetchRSSItems(source);

//         let newPostCount = 0;

//         // For each RSS item
//         for (const item of feed_items) { // Check if its link exists in posts table
//             // If exists, skip (do nothing)
//             if (await postExists(item.link)) {
//                 console.log(`[rssPoller] Skipped seen post: ${item.title}`);
//                 continue;
//             }

//             // Check if post is relevant (OpenAI filtering)
//             const topic = "Trump";
//             const isRelevant = await classifyPost(item, topic);
//             if (!isRelevant) { // Skip irrelevant posts
//                 console.log(`[rssPoller] Skipped irrelevant post: ${item.title}`);
//                 continue;
//             }

//             // Otherwise, it doesn't exists AND is relevant and we process new post
//             await savePost(item, source); // Insert into table

//             // TODO: Process, filter, etc.
//             console.log(`[rssPoller] New post saved: ${item.title}`);
//             newPostCount++;
//         }

//         // Optionally log that the job ran, and how many items it found
//         console.log(`[rssPoller] Job ran. Fetched ${feed_items.length} (${newPostCount} new items)`);
//     } catch (err) {
//         console.log('[rssPoller] Job failed: ', err.message);
//     }  