import React, { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

function PostCard({ title, summary, link, published_at, topics }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [height, setHeight] = useState('0px');
  const summaryRef = useRef(null);

  // Handle height & opacity transitions
  useEffect(() => {
    if (!summaryRef.current) return;
    const contentHeight = summaryRef.current.scrollHeight;

    if (isExpanded) {
      setHeight(`${contentHeight}px`);
      setTimeout(() => setFadeIn(true), 50); // Start fade just after height starts
    } else {
      setFadeIn(false);
      setTimeout(() => setHeight('0px'), 10);
    }
  }, [isExpanded, summary]);

  // Toggle expand/collapse
  const toggleExpand = () => setIsExpanded(prev => !prev);

  return (
    <div
      onClick={toggleExpand}
      style={{
        cursor: 'pointer',
        width: '100%',
        maxWidth: '800px',
        marginBottom: '1rem',
        padding: '1.5rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')}
    >
      <h2 style={{ marginBottom: '0.5rem' }}>{title}</h2>
      <small style={{ color: '#666' }}>
        Posted {formatDistanceToNow(new Date(published_at), { addSuffix: true })}
      </small>

      {/* Expandable summary wrapper */}
      <div
        style={{
          position: 'relative',
          height,
          transition: 'height 0.6s ease',
          overflow: 'hidden',
          marginTop: '1rem',
        }}
      >
        <div
          ref={summaryRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            opacity: fadeIn ? 1 : 0,
            transition: 'opacity 0.6s ease',
            pointerEvents: fadeIn ? 'auto' : 'none',
            paddingRight: '1rem',
          }}
        >
          <p style={{ marginBottom: '1rem', color: '#444' }}>{summary}</p>
        </div>
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        <strong>Link: </strong>
        <a href={link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
          {link}
        </a>
      </div>

      <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
        <strong>Topics: </strong>{topics?.length ? topics.join(', ') : 'None'}
      </div>
    </div>
  );
}

export default PostCard;
