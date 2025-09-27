import { useEffect, useState } from "react";


function SourcePage({ source, topics, onClose }) {
    
    const closeBtnStyle = {
    position: 'absolute',
    top: '0.5rem',
    right: '0.75rem',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    };  
    
    return (
        <div>
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
                    style={{ width: '80px', height: '80px', margin: '0', cursor: 'pointer' }}
                />
            </a>
            <h1 className="header" style={{ marginBottom: '0.5rem' }}>{source.author}</h1>
            <p style={{ fontSize: '0.75rem', margin: '0.5rem 0 0.2rem 0', color: '#797979' }}>Youtube Channel</p>
            <a
                        href={source.channel_uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{ fontSize: '0.65rem', margin: '0 0 0 0', color: '#797979'}}
                    >
                        {source.channel_uri}
                    </a>
            <button onClick={onClose} style={closeBtnStyle}>×</button>
        </div>
    )
}

export default SourcePage;