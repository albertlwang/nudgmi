// A function to fetch and parse a feed URL using rss-parser.
// Handles fetching from RSS.

// Import rss parser package
const RSSParser = require('rss-parser');

// Define an async function to fetch RSS items
async function fetchRSSItems(url = process.env.RSS_FEED_URL) {
     // Create rss parser
    const parser = new RSSParser({
        customFields: {
            item: [
                ['media:group', 'media:description'], // [parentKey, nestedKey]
            ],
        },
    });

    // Use rssParser.parseURL(url) to fetch and parse the feed
    const feed = await parser.parseURL(url);

    // Map custom field to standard 'description' field
    for (const item of feed.items) {
        try {
            const raw = item['media:description'];

            if (
                raw &&
                typeof raw === 'object' &&
                'media:description' in raw &&
                Array.isArray(raw['media:description'])
            ) {
                item.description = raw['media:description'][0];
            } else {
                item.description = 'none';
            }
        } catch (e) {
            item.description = 'none';
        }
    }
    
    // Return or log the items from the feed
    console.log(`[rssService] Fetched ${feed.items.length} items from RSS feed.`);
    return feed.items;
}

async function fetchRSSAuthor(url) {
    const parser = new RSSParser();

    const feed = await parser.parseURL(url);
    return feed.title;
}

// Export the async function so it can be used elsewhere
module.exports = { fetchRSSItems, fetchRSSAuthor };