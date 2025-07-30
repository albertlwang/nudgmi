import { useState, useEffect } from 'react';
import { Gauge, SatelliteDish } from 'lucide-react';
import axios from 'axios';

import PostCard from './PostCard';
import InputBox from './InputBox';
import SourceTag from './SourceTag';
import './App.css';
import Dashboard from './Dashboard';
import SourcesTab from './SourcesTab';


function App() {
  const [activeView, setActiveView] = useState('dashboard'); // or 'subscriptions'
  const [email, setEmail] = useState('test@example.com'); // Mock email
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [subs, setSubs] = useState([]);
  const [sources, setSources] = useState([]);
  const [topics, setTopics] = useState([]);
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
  };

  const fetchSources = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/sources', {
        params: { user_id: userId }
      });

      setSources(res.data.sources);
    } catch (err) {
      console.error('Error fetching sources:', err);
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/topics', {
        params: { user_id: userId }
      });

      setTopics(res.data.topics);
    } catch (err) {
      console.error('Error fetching topics:', err);
    }
  };

  // Fetch posts and subs once we have userId
  useEffect( () => {
    if (!userId) {
      console.error('userID not stored');
      return;
    }

    const run = async () => {
      await fetchPosts();
      await fetchSubs();
      await fetchSources();
      await fetchTopics();
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

  const sidebarBtnStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: active ? '#F1F1F1' : 'transparent',
    border: 'none',
    borderRadius: '0.875rem',
    color: '#363636',
    textAlign: 'left',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  });

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'inter' }}>
      {/* Sidebar */}
      <div className='sidebar'>
        <h2 className="header" style={{ marginBottom: '4rem', marginLeft: '1rem', textAlign: 'left', color: '#797979' }}>Nudgmi</h2>
        <button onClick={() => setActiveView('dashboard')} style={sidebarBtnStyle(activeView === 'dashboard')}>
          <Gauge size={24} style={{ margin: '0 1rem 0.2rem 0.2rem' }}/>
          Dashboard
        </button>
        <button onClick={() => setActiveView('sourcesTab')} style={sidebarBtnStyle(activeView === 'sourcesTab')}>
          <SatelliteDish size={24} style={{ margin: '0 1rem 0.2rem 0.2rem' }}/>
          Sources
        </button>
      </div>

      {/* Scrollable Content */}
      <div className='scrollable'>
        {activeView === 'dashboard' && (
          <Dashboard
            email={email}
            posts={posts}
            topics={topics}
            loading={loading}
            fetchPosts={fetchPosts}
          />
        )}
        {activeView === 'sourcesTab' && (
          <SourcesTab
            sources={sources}
            topics={topics}
            onDelete={deleteSubs}
            onSubmit={handleSubmit}
            validate={validateInput}
          />
        )}
      </div>
    </div>
  );
}

export default App;
