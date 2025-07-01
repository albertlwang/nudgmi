// Connects to Supabase with supabaseClient
// Exposes helper functions to query and insert data.

// Initialize client
const supabase = require('../supabaseClient');

// Define helper function that checks if incoming post already exists in (seen by) post table
async function postExists(link) {
    // const query = 'SELECT 1 FROM posts WHERE link = $1 LIMIT 1';
    // const values = [link];

    // const { rowCount } = await pool.query(query, values);
    // return rowCount > 0;

    const { data, error } = await supabase
        .from('posts')
        .select('id')
        .eq('link', link)
        .limit(1)
        .single();
    
    if(error && error.code !== 'PGRST116') {
        console.error('[db.js -> postExists] Error:', error.message);
        throw error;
    }

    return !!data;
}

// Define helper function that takes a full RSS item (from rss-parser), extracts fields, and inserts into posts table
async function savePost(item, source) {
    // const query = `
    //     INSERT INTO posts (link, title, published_at, source)
    //     VALUES ($1, $2, $3, $4)
    //     ON CONFLICT (link) DO NOTHING
    // `;

    // const values = [
    //     item.link,
    //     item.title || '', 
    //     item.pubDate ? new Date(item.pubDate) : new Date(),
    //     source
    // ];

    // await pool.query(query, values);

    const { error } = await supabase
        .from('posts')
        .insert([
            {
                link: item.link,
                title: item.title || '',
                published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                source: source,
            },
        ]
    );
    
    if(error) {
        console.error('[db.js -> savePost] Error:', error.message);
        throw error;
    }
}

// Export async helper functions to expose
module.exports = { postExists, savePost};