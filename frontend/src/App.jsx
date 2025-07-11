// src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';


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
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Nudgmi Proto Dashboard</h1>
      <p>Logged in as: <strong>{email}</strong></p>

      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post.id} style={{ marginBottom: '1.5rem' }}>
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
              <small>
                <strong>Link:</strong>{' '}
                <a href={post.link} target="_blank" rel="noopener noreferrer">{post.link}</a>
                {' '}| <strong>Topic(s):</strong> {post.topics.join(', ')}
                {' '}| <strong>Posted:</strong> {formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
