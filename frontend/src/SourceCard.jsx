import React, { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import TopicTag from './TopicTag';

function SourceCard({ source, topics, onClick }) {
    return (
        <div
            className='card poppy'
            onClick={onClick}
            style={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '1.5rem',
                marginRight: '1rem',
                padding: '1.5rem 2rem 0.5rem 2.5rem',
                width: '25rem'
            }}
        >
            <a
                href={source.channel_uri}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{ width: 'fit-content' }}
                >
                <img
                    className="profile-icon"
                    src={source.icon_url}
                    alt="Channel icon"
                    style={{ margin: '0', cursor: 'pointer' }}
                />
            </a>
            <div>
                <p className='title link' style={{ margin: '0.875rem 3rem 0.5rem 0', width: 'fit-content'}}>
                    <a
                        href={source.channel_uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        {source.author}
                    </a>
                    </p>
                <p style={{ fontSize: '0.75rem', margin: '0.5rem 0 1.5rem 0', color: '#797979' }}>Youtube Channel</p>
                <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#797979', display: 'flex', flexDirection: 'row' }}>
                    {source.topics?.length ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
                            {source.topics.map(topicName => {
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

export default SourceCard;