import React, { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

function PostCard({ title, summary, link, published_at, topics, icon_url }) {
    return (
        <div 
            style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: '2rem',
                maxWidth: '60%',
                boxShadow: '1px 4px 36px -9px rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                backgroundColor: 'white'
            }}
        >
            <img
                className='profile-icon'
                src={icon_url}
                style={{ marginLeft: '0.75rem', marginRight: '1.5rem', marginTop: '1rem' }}
            />
            <div>
                <h3 className='header' style={{ marginBottom: '0.2rem', marginRight: '3rem' }}>{title}</h3>
                <small style={{ color: '#797979' }}>Posted {formatDistanceToNow(new Date(published_at), { addSuffix: true })}</small>
                <p style={{ marginBottom: '1.5rem', marginRight: '3rem' }}>{summary}</p>
                <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    <strong>Link: </strong>
                    <a href={link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>{link}</a>
                </div>
                <div style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: '#797979' }}>
                    <strong>Topics: </strong>
                    {topics?.length ? topics.join(', ') : 'None'}
                </div>
            </div>

        </div>
    );
}

export default PostCard;