import React from 'react';
import { useApp } from '../../context/AppContext';

export default function ConfirmModal() {
  const { confirm } = useApp();

  if (!confirm.show) return null;

  const handleOverlayClick = () => {
    if (confirm.resolve) confirm.resolve(false);
  };

  const handleCancelClick = () => {
    if (confirm.resolve) confirm.resolve(false);
  };

  const handleConfirmClick = () => {
    if (confirm.resolve) confirm.resolve(true);
  };

  return (
    <div 
      className="overlay open" 
      id="confirm-modal" 
      onClick={handleOverlayClick} 
      style={{ zIndex: 10000 }}
    >
      <div 
        className="modal" 
        style={{ maxWidth: '320px', borderColor: '#000' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-handle" style={{ background: 'var(--rose)' }}></div>
        <div className="modal-title" style={{ color: 'var(--rose)' }}>{confirm.title}</div>
        <p 
          style={{ 
            fontSize: '0.95rem', 
            margin: '1rem 0', 
            lineHeight: 1.4, 
            color: '#000', 
            textAlign: 'center', 
            fontWeight: 700 
          }} 
          dangerouslySetInnerHTML={{ __html: confirm.message }}
        ></p>
        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', marginTop: '1.2rem' }}>
          <button 
            className="flt" 
            onClick={handleCancelClick} 
            style={{ 
              background: '#FFF', 
              borderColor: '#000', 
              padding: '0.4rem 0.9rem', 
              fontWeight: 700, 
              fontSize: '0.85rem' 
            }}
          >
            Cancel
          </button>
          <button 
            className="flt" 
            onClick={handleConfirmClick} 
            style={{ 
              background: 'var(--rose)', 
              color: 'white', 
              borderColor: '#000', 
              padding: '0.4rem 0.9rem', 
              fontWeight: 700, 
              fontSize: '0.85rem' 
            }}
          >
            Yes, Go! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
