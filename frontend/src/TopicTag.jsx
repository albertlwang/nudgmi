import { useEffect, useState } from "react";
import { TAG_COLORS } from "./ColorMap";

function onDelete() {
    return;
}

function TopicTag({ topic, color, editing = false }) {
    const baseColor = TAG_COLORS[color] || 'rgb(0, 141, 242)';
    const backgroundColor = `rgba(${baseColor.replace('rgb(', '').replace(')', '')}, 0.1)`; // 10% opacity

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                borderRadius: '9999px',
                color: baseColor,
                backgroundColor: backgroundColor,
                position: 'relative',
                width: 'fit-content',
                whiteSpace: 'nowrap',
                margin: '0',
                gap: '1rem',
                padding: '0.3rem 1.2rem 0.3rem 1.2rem',
                fontSize: '0.75rem'
            }}
        >
            <p
                onClick={() => onDelete()}
                style={{ 
                    padding: '0 0 0 0', 
                    margin: '0 0 0 0', 
                    cursor: 'pointer',
                    userSelect: 'none',
                    display: editing ? 'inline-block' : 'none',
                }}
            >
                x
            </p>
            <p 
                style={{ 
                    padding: '0 0 0 0', 
                    margin: '0 0 0 0',
                    fontWeight: 'medium',
                }}
            >
                {topic}
            </p>
        </div>
    )
}

export default TopicTag;