// Connects to Supabase with supabaseClient
// Exposes helper functions to query and insert data.

// Initialize client
const supabase = require('../supabaseClient');

// Define helper function that checks if incoming post already exists in (seen by) post table
async function postExists(link) {
    const { data, error } = await supabase
        .from('posts')
        .select('id')
        .eq('link', link)
        .limit(1)
        .single();
    
    if (error && error.code !== 'PGRST116') {
        console.error('[db.js -> postExists] Error:', error.message);
        throw error;
    }

    return !!data;
}

// Define helper function that fetches all subscriptions. Use to loop over all subscribed sources.
async function getAllSubscriptions() {
    const { data, error } = await supabase
        .from('subscriptions')
        .select('id, user_id, source, topic');
    
    if (error) {
        console.error('[db -> getAllSubscriptions] Error:', error.message);
        throw error;
    }

    return data;
}

// Define helper function that takes a full RSS item (from rss-parser), extracts fields, and inserts into posts table
async function savePost(item, source) {
    const { error } = await supabase
        .from('posts')
        .insert([
            {
                link: item.link,
                title: item.title || '',
                description: item.description || '',
                published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                source: source,
            },
        ]);
    
    if (error) {
        console.error('[db.js -> savePost] Error:', error.message);
        throw error;
    }
}

// Define helper function that inserts new entry into user_posts table
async function saveUserPost(item, subscription) {
    const { error } = await supabase
        .from('user_posts')
        .insert([
            {
                user_id: subscription.user_id,
                subscription_id: subscription.id,
                link: item.link,
                title: item.title || '',
                source: item.source || subscription.source,
                summary: null,      // TO DO
                published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
            }
        ]);

    if (error) {
        console.error('[db -> saveUserPost] Error:', error.message);
        throw error;
    }
}

// Export async helper functions to expose
module.exports = {
    postExists, 
    savePost,
    getAllSubscriptions,
    saveUserPost,
};