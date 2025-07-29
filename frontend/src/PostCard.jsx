import React, { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import TopicTag from './TopicTag';

function PostCard({ post, topics}) {
    return (
        <div
            className='card'
            style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: '2rem',
                maxWidth: '95%'
            }}
        >
            <img
                className='profile-icon'
                src={post.icon_url}
                style={{ marginLeft: '0.75rem', marginRight: '1.5rem', marginTop: '1rem' }}
            />
            <div>
                <p className='header link' style={{ marginBottom: '0.2rem', marginRight: '3rem' }}>
                    <a
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        {post.title}
                    </a>
                    </p>
                <p style={{ fontSize: '0.75rem', margin: '0.5rem 0 1.5rem 0', color: '#797979' }}>Posted {formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}</p>
                <p className='description' style={{ marginBottom: '1.5rem', marginRight: '3rem', maxWidth: '40rem' }}>{post.summary}</p>
                <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#797979', display: 'flex', flexDirection: 'row' }}>
                    {/* <strong>Topics:</strong> {post.topics?.length ? post.topics.join(', ') : 'None'} */}
                    {post.topics?.length ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
                            {post.topics.map(topicName => {
                            const match = topics.find(t => t.topic === topicName);
                            const color = match ? match.color : 'LIGHT_BLUE'; // fallback color

                            return (
                                <TopicTag key={topicName} topic={topicName} color={color} />
                            );
                            })}
                        </div>
                        ) : (
                        <span style={{ marginLeft: '0.5rem' }}>None</span>
                        )}
                </div>
            </div>

        </div>
    );
}

export default PostCard;