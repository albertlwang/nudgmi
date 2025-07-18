import { useEffect, useState } from "react";


function SourceTag({ subscription, onDelete }) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                borderRadius: '9999px',
                backgroundColor: 'rgba(121, 121, 121, 0.1)',
                position: 'relative',
                width: 'fit-content',
                whiteSpace: 'nowrap',
                margin: '1rem'
            }}
        >
            <p
                onClick={() => onDelete(subscription.ids)}
                style={{ 
                    padding: '0.5rem', 
                    margin: '0 0 0 1rem', 
                    color: 'rgba(121, 121, 121, 1)',
                    cursor: 'pointer',
                    userSelect: 'none'
                }}
            >
                x
            </p>
            <p 
                style={{ 
                    padding: '0.5rem', 
                    margin: '0 1rem 0 0', 
                    color: 'rgba(121, 121, 121, 1)'
                }}
            >
                {subscription.author}
            </p>
        </div>
    )
}

export default SourceTag;