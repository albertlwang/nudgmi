import { CircleFadingPlus } from 'lucide-react';

function NewSourceCard({ onClick }) {
    return (
        <div
            className='card poppy'
            onClick={onClick}
            style={{
                backgroundColor: '#EDEDED',
                color: '#C8C8C8',
                boxShadow: 'inset 0px 0px 10px 5px rgba(0, 0, 0, 0.02)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                marginRight: '1rem',
                padding: '1.5rem 2rem 2rem 2.5rem',
                width: '25rem',
                cursor: 'pointer',
            }}
        >
            <CircleFadingPlus size={48} strokeWidth={1.5} style={{ marginBottom: '0.875rem' }} />
            Add new source
        </div>
    );
}

export default NewSourceCard;