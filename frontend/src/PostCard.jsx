import React from 'react';
import { formatDistanceToNow } from 'date-fns';

function PostCard({ title, summary, link, published_at, topics }) {
  return (
    <div style={{
      maxWidth: '90%',
      margin: '1rem',
      padding: '1.5rem',
      borderRadius: '1rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      backgroundColor: 'white',
      fontFamily: 'Inter'
    }}>
      <h2 style={{ marginBottom: '0.5rem' }}>{title}</h2>
      <small style={{ color: '#666' }}>
        Posted {formatDistanceToNow(new Date(published_at), { addSuffix: true })}
      </small>
      <p style={{ marginTop: '1rem', marginBottom: '1rem' }}>{summary}</p>
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>Link: </strong>
        <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
      </div>
      <div>
        <strong>Topics:</strong>{' '}
        {topics && topics.length > 0 ? topics.join(', ') : 'None'}
      </div>
    </div>
  );
}

export default PostCard;
