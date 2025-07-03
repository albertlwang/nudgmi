// Defines helper function to classify posts
// Calls OpenAI API

const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function classifyPost(item, topic) {
    const prompt = `
        You are a relevance classifier.

        Given a post and a user-defined topic, determine whether the post is clearly related to that topic.

        Post title: ${item.title}
        Post description: ${item.description}
        
        Is this post relevant to the topic: "${topic}"?
        Answer only "yes" or "no".
        `;
    
    // Send prompt through OpenAI
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: 0,
        messages: [
            { role: "system", content: "You are a helpful assistant that classifies relevance of content." },
            { role: "user", content: prompt }
        ],
    });

    // Extract yes/no and return
    // console.log(`[aiServices] Response: ${response.choices[0].message.content}`)
    const answer = response.choices[0].message.content.trim().toLowerCase();
    return answer.startsWith("yes");
}

async function summarizePost(item) {
    const prompt = `
        Write a concise summary (1-2 sentences) of the following post for a user notification or dashboard:

        Title: ${item.title}
        Description: ${item.description || "None"}

        Focus on what's new, important, or interesting. Omit any extra tokens (e.g. hashtags).
        `;

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: 0.5,
        messages: [
            { role: "system", content: "You are a helpful assistant that summarizes RSS/Youtube posts for users." },
            { role: "user", content: prompt }
        ],
    });

    const summary = response.choices[0].message.content.trim();
    return summary;
}

// Export helper function to be used elsewhere
module.exports = { 
    classifyPost,
    summarizePost,
};
