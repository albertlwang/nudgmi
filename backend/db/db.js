// Connects to Supabase with supabaseClient
// Exposes helper functions to query and insert data.

// Initialize client
const supabase = require('../supabaseClient');
const { fetchIcon } = require('../services/youtube');

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

// Define helper function that checks if source already exists in sources table. Call when creating a new subscription.
async function sourceExists(source) {
    const { data: existingSource, error } = await supabase
        .from('sources')
        .select('source')
        .eq('source', source)
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('[db.js -> sourceExists] Error:', error.message);
        throw error;
    }

    return existingSource;
}

// Define helper function that fetches all subscriptions. Use to loop over all subscribed sources.
async function getAllSubscriptions() {
    const { data, error } = await supabase
        .from('subscriptions')
        .select('user_id, source, topic');
    
    if (error) {
        console.error('[db -> getAllSubscriptions] Error:', error.message);
        throw error;
    }

    return data;
}

// Define helper function that takes a full RSS item (from rss-parser), extracts fields, and inserts into posts table
async function savePost(item, source) {
    const { data, error } = await supabase
        .from('posts')
        .insert([
            {
                link: item.link,
                title: item.title || '',
                description: item.description || '',
                published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                source: source,
            },
        ])
        .select('id'); // return id of inserted row
    
    if (error) {
        console.error('[db.js -> savePost] Error:', error.message);
        throw error;
    }

    return data[0].id; // return id of inserted row
}

// Define helper function to fetch icon_url for a given source
async function getIconUrl(source) {
    const { data, error } = await supabase
        .from('sources')
        .select('icon_url')
        .eq('source', source)
        .limit(1)
        .single();
    
    if (error) {
        console.error('[db -> getIconUrl] Error:', error.message);
        throw error;
    }

    return data.icon_url;
}

// Define helper function that inserts new entry into user_posts table
async function saveUserPost(item, subscription, post_id, summary, icon_url) {
    // Try inserting
    const { error: insertError } = await supabase
        .from('user_posts')
        .insert([
            {
                user_id: subscription.user_id,
                post_id: post_id,
                link: item.link,
                title: item.title || '',
                source: item.source || subscription.source,
                summary: summary,
                published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                icon_url: icon_url,
                topics: [subscription.topic]
            }
        ]);

    if (!insertError) return; // inserted successfully

    // If insert failed due to conflict (existing user_id, post_id), update the row
    if (insertError.message.includes('duplicate key')) {
        // Fetch the old row
        const { data, error: selectError } = await supabase
            .from('user_posts')
            .select('topics')
            .eq('user_id', subscription.user_id)
            .eq('post_id', post_id)
            .single();
        
        if (selectError) {
            console.error('[db -> saveUserPost] Failed to fetch existing topics:', selectError.message);
            throw selectError;
        }

        // Concat the new topic to array
        const existingTopics = data.topics || [];
        const newTopics = [...existingTopics, subscription.topic];

        // Insert new topic array
        const { error: updateError } = await supabase
            .from('user_posts')
            .update({ topics: newTopics })
            .eq('user_id', subscription.user_id)
            .eq('post_id', post_id);

        if (updateError) {
            console.error('[db -> saveUserPost] Failed to update topics:', updateError.message);
            throw updateError;
        }
    } else {
        // Some other unexpected error
        console.error('[db -> saveUserPost] Insert error:', insertError.message);
        throw insertError;
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
    // First check if source exists in sources table. If not, fetch icon_url and insert
    if (!await sourceExists(source)) {
        const iconURL = await fetchIcon(source);
        const { error } = await supabase
            .from('sources')
            .insert([
                {
                    source: source,
                    icon_url: iconURL,
                }
            ]);
        
        if (error) {
            console.error('[db -> createUserSub] Error inserting into sources:', error.message);
            throw error;
        }
    }
    
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
    getIconUrl,
    saveUserPost,
    getOrCreateUser,
    getUserFeed,
    getUserSubs,
    createUserSub,
    deleteSub,
};