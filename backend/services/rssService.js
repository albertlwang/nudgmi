// A function to fetch and parse a feed URL using rss-parser.
// Handles fetching from RSS.

// Import rss parser package
const RSSParser = require('rss-parser');

// Define an async function to fetch RSS items
async function fetchRSSItems(url = process.env.RSS_FEED_URL) {
     // Create rss parser
    const parser = new RSSParser({
        customFields: {
            item: ['media:group', 'media:description'], // [parentKey, nestedKey]
        },
    });

    // Use rssParser.parseURL(url) to fetch and parse the feed
    const feed = await parser.parseURL(url);

    // Map custom field to standard 'description' field
    for (const item of feed.items) {
        item.description = item['media:description'] || 'none';
    }
    
    // Return or log the items from the feed
    console.log(`[rssService] Fetched ${feed.items.length} items from RSS feed.`);
    return feed.items;
}

// Export the async function so it can be used elsewhere
module.exports = { fetchRSSItems };