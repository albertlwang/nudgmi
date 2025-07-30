const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000, // ensure it's on top
};

const modalStyle = {
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  position: 'relative',
  width: '80vw',
  height: '80%'
};

const closeBtnStyle = {
  position: 'absolute',
  top: '0.5rem',
  right: '0.75rem',
  background: 'none',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
};

function Modal({ children, onClose }) {
    const handleOverlayClick = (e) => {
        // If the user clicks directly on the overlay (not the modal itself), close it
        if (e.target === e.currentTarget) {
        onClose();
        }
    };

    return (
        <div style={overlayStyle} onClick={handleOverlayClick}>
        <div style={modalStyle}>
            <button onClick={onClose} style={closeBtnStyle}>×</button>
            {children}
        </div>
        </div>
  );
}

export default Modal;