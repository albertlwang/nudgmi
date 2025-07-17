// src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

import PostCard from './PostCard';
import InputBox from './InputBox';
import SourceTag from './SourceTag';
import './App.css';


function App() {
  const [email, setEmail] = useState('test@example.com'); // Mock email
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [subs, setSubs] = useState([]);
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

  const fetchPosts = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/feed', {
          params: { user_id: userId }
        });
        setPosts(res.data.posts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
  };

  const fetchSubs = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/subscriptions', {
          params: { user_id: userId }
        });

        // Dedupe subs and aggregate topics
        const rawSubs = res.data.subscriptions;

        const groupedSubs = Object.values(
          rawSubs.reduce((acc, sub) => {
            const {source, topic, author, id } = sub;

            if(!acc[source]) {
              acc[source] = { source, topics: [topic], author, ids: [id] };
            } else {
              acc[source].topics.push(topic);
              acc[source].ids.push(id);
            }

            return acc;
          }, {})
        );
        groupedSubs.sort((a, b) => a.author.localeCompare(b.author));

        setSubs(groupedSubs);
      } catch (err) {
        console.error('Error fetching subscriptions:', err);
      }
  }

  // Fetch posts and subs once we have userId
  useEffect( () => {
    if (!userId) {
      console.error('userID not stored');
      return;
    }

    const run = async () => {
      await fetchPosts();
      await fetchSubs();
    }

    run();

    // Optional: Poll every 10 seconds to check for new posts
    // const interval = setInterval(fetchPosts, 10000);
    // return () => clearInterval(interval); // Cleanup on unmount
  }, [userId]);



  const handleSubmit = async (source, topic) => {
    try {
      console.log(`Request:
                      user_id: ${userId} \n
                      source: ${source} \n
                      topic: ${topic}`);
      const res = await axios.post('http://localhost:3000/api/subscribe', { user_id: userId, source, topic });
      console.log('Subscription created:', res.data.subscription);
      await fetchSubs();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        throw new Error(err.response.data.error); // e.g. "Duplicate subscription"
      } else {
        throw new Error('Submission failed'); // fallback
      }
    }
  };

  const validateInput = (input1, input2) => {
    if (input1.trim() === '' || input2.trim() === '') return 'Input cannot be empty';
    if (input1.length < 3 || input2.length < 3) return 'Input must be at least 3 characters';
    return null; // valid
  };

  const deleteSubs = async (subscription_ids) => {
    try {
      for (const id of subscription_ids) {
        await axios.delete(`http://localhost:3000/api/subscriptions/${id}`);
        console.log(`Deleted subscription ${id}`);
      }
      await fetchSubs();
    } catch (err) {
      console.error(`Error deleting subscriptions ${subscription_ids}:`, err.message);
      throw err; // rethrow if you want the caller to handle it
    }
  };

  return (
    <div style={{ padding: '0.5rem', fontFamily: 'inter', backgroundColor: '#F7F7F7', display: 'flex', flexDirection: 'row' }}>
      <div style={{ width: '70%' }}>
        <h1 className='header'>Nudgmi Proto Dashboard</h1>
        <p>Logged in as: <strong>{email}</strong></p>

        {loading ? (<p>Loading posts...</p>) : (
          <ul style={{ paddingInlineStart: '0px' }}>
            {posts.map(post => (
              <li key={post.link} style={{ listStyle: 'none' }}>
                <PostCard
                  title={post.title}
                  summary={post.summary}
                  link={post.link}
                  published_at={post.published_at}
                  topics={post.topics}
                  icon_url={post.icon_url}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ width: '30%' }}>
        <div className='card' style={{ width: '90%', padding: '1rem'}}>
          <h3 className='header'>Subscriptions</h3>
          <InputBox onSubmit={handleSubmit} validate={validateInput}></InputBox>
          <ul style={{ paddingInlineStart: '0px' }}>
            {subs.map(sub => (
              <li key={sub.source} style={{ listStyle: 'none' }}>
                  <SourceTag
                    subscription={sub}
                    onDelete={deleteSubs}
                  />
                </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}

export default App;
