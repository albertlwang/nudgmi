// Defines helper function to classify posts
// Calls OpenAI API

const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function classifyPost(item, topic) {
    // console.log(`Description: ${item.description}`);
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
    
    //console.log(`[aiServices] Prompt: ${prompt}`)


    // Extract yes/no and return
    console.log(`[aiServices] Response: ${response.choices[0].message.content}`)
    const answer = response.choices[0].message.content.trim().toLowerCase();
    return answer.startsWith("yes");
}

// Export helper function to be used elsewhere
module.exports = { classifyPost };
