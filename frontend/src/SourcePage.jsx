import { useEffect, useState } from "react";
import TopicTag from './TopicTag';


function SourcePage({ source, topics, onDelete, onClose }) {
    
    const closeBtnStyle = {
    position: 'relative',
    top: '0.5rem',
    left: '0.75rem',
    background: 'none',
    border: 'none',
    fontSize: '2.5rem',
    cursor: 'pointer',
    marginBottom: '2rem'
    };  
    
    return (
        <div>
            <button onClick={onClose} style={closeBtnStyle}>‹</button>
            <br></br>
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
                    style={{ width: '100px', height: '100px', margin: '0', cursor: 'pointer' }}
                />
            </a>
            <h1 className="header" style={{ marginBottom: '0.5rem' }}>{source.author}</h1>
            <p style={{ fontSize: '0.9rem', margin: '0.5rem 0 0.2rem 0', color: '#797979' }}>Youtube Channel</p>
            <a
                        href={source.channel_uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{ fontSize: '0.8rem', margin: '0 0 0 0', color: '#797979'}}
                    >
                        {source.channel_uri}
            </a>
            <div className="card" style={{ margin: "2rem 5rem 2rem 0", padding: "2rem", minHeight: "6rem" }}>
                <h3 className="title" style={{ margin: "0 0 0 0"}}>Topics</h3>
                <p className="description" style={{ margin: "0.3rem 0 0 0"}}>Add topics to filter notifications from this source. Max 10 topics per source.</p>
                <div style={{ margin: '1rem 0 0 0', fontSize: '0.875rem', color: '#797979', display: 'flex', flexDirection: 'row' }}>
                    {source.topics?.length ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
                            {source.topics.map((topicName, i) => {
                            const match = topics.find(t => t.topic === topicName);
                            const color = match ? match.color : 'LIGHT_BLUE'; // fallback color
                            const subID = source.ids?.[i];

                            return (
                                <TopicTag 
                                    key={topicName} 
                                    topic={topicName} 
                                    subID={subID} 
                                    color={color} 
                                    editing={true} 
                                    onDelete={onDelete} 
                                    disabled={source.topics.length <= 1} 
                                />
                            );
                            })}
                        </div>
                        ) : (
                        <span style={{ marginLeft: '0.5rem' }}>None</span>
                        )}
                </div>
            </div>
            <hr></hr>
            <h3 className="title">Statistics</h3>
            <hr></hr>
            <h3 className="title">Manage Source</h3>
        </div>
    )
}

export default SourcePage;