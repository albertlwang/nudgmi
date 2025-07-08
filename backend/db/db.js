// Connects to Supabase with supabaseClient
// Exposes helper functions to query and insert data.

// Initialize client
const supabase = require('../supabaseClient');

// CRON JOB FUNCTIONS ////////////////////////////////////////////////////////////////////////////////

// Define helper function that checks if incoming post already exists in (seen by) post table
async function postExists(link) {
    const { data: existingPost, error } = await supabase
        .from('posts')
        .select('id')
        .eq('link', link)
        .limit(1)
        .single();
    
    if (error && error.code !== 'PGRST116') {
        console.error('[db.js -> postExists] Error:', error.message);
        throw error;
    }

    return existingPost;
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
async function saveUserPost(item, subscription, summary) {
    const { error } = await supabase
        .from('user_posts')
        .insert([
            {
                user_id: subscription.user_id,
                subscription_id: subscription.id,
                link: item.link,
                title: item.title || '',
                source: item.source || subscription.source,
                summary: summary,
                published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
            }
        ]);

    if (error) {
        console.error('[db -> saveUserPost] Error:', error.message);
        throw error;
    }
}

// API ROUTE FUNCTIONS ////////////////////////////////////////////////////////////////////////////////

// Create or find a user by email
async function getOrCreateUser(email) {
    const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('[db.js -> getOrCreateUser] Fetch error:', fetchError.message);
        throw fetchError;
    }

    if (existingUser) {
        return { id: existingUser.id, created: false };
    }

    const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{ email }])
        .select('id')
        .single();
    
    if (insertError) {
        console.error('[db -> getOrCreateUser] Insert error:', insertError.message);
        throw insertError;
    }

    return { id: newUser.id, created: true };
}

// Given a user_id, return their own feed.
// Support pagination and filtering
async function getUserFeed(user_id, { source = null, topic = null, after = null, limit = 20 } = {}) {
    let query = supabase
        .from('user_posts')
        .select('*')
        .eq('user_id', user_id)
        .order('published_at', { ascending: false})
        .limit(limit);

    // Apply relevant filters to query
    if (source) query = query.eq('source', source);
    if (topic) query = query.eq('topic', topic);
    if (after) query = query.gte('published_at', after);

    const { data, error } = await query;

    if (error) {
        console.error('[db -> getUserFeed] Error:', error.message);
        throw error;
    }

    return data;
}

// Given a user, fetch all their subscriptions
async function getUserSubs(user_id) {
    const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user_id);
    
    if (error) {
        console.error('[db -> getUserSubs] Error:', error.message);
        throw error;
    }

    return data;
}

// Create a subscription entry given a user, source, and topic
// Returns the new subscription entry
async function createUserSub(user_id, source, topic) {
    const { data, error } = await supabase
        .from('subscriptions')
        .insert([{ user_id, source, topic }])
        .select('*')
        .single();
    
    if (error) {
        console.error('[db -> createUserSub Error:', error.message);
        throw error;
    }

    return data;
}

// Delete a subscription given its ID
async function deleteSub(subscription_id) {
    const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', subscription_id);

    if (error) {
        console.error('[db -> deleteSub] Error:', error.message);
        throw error;
    }
}

// Export async helper functions to expose
module.exports = {
    postExists, 
    savePost,
    getAllSubscriptions,
    saveUserPost,
    getOrCreateUser,
    getUserFeed,
    getUserSubs,
    createUserSub,
    deleteSub,
};