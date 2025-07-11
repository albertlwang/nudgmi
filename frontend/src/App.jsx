// src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

import PostCard from './PostCard';


function App() {
  const [email, setEmail] = useState('test@example.com'); // Mock email
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user ID once on load
  useEffect(() => {
    async function fetchUserId() {
      try {
        const res = await axios.post('http://localhost:3000/api/register', { email });
        console.log('User ID received:', res.data.user_id);
        setUserId(res.data.user_id);
      } catch (err) {
        console.error('Error fetching user ID:', err);
      }
    }

    fetchUserId();
  }, [email]);

  // Fetch posts once we have userId
  useEffect(() => {
    if (!userId) {
      console.error('userID not stored');
      return;
    }

    async function fetchPosts() {
      try {
        console.log('made it');
        const res = await axios.get('http://localhost:3000/api/feed', {
          params: { user_id: userId }
        });
        setPosts(res.data.posts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    }

    fetchPosts();

    // Optional: Poll every 10 seconds to check for new posts
    // const interval = setInterval(fetchPosts, 10000);
    // return () => clearInterval(interval); // Cleanup on unmount
  }, [userId]);

  return (
    <div style={{ padding: '0.5rem', fontFamily: 'sans-serif' }}>
      <h1>Nudgmi Proto Dashboard</h1>
      <p>Logged in as: <strong>{email}</strong></p>

      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <ul style={{paddingInlineStart: '0px'}}>
          {posts.map(post => (
            <PostCard
              key={post.link}
              title={post.title}
              summary={post.summary}
              link={post.link}
              published_at={post.published_at}
              topics={post.topics}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
