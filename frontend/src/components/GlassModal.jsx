import React from 'react';
import { X } from 'lucide-react';

export const GlassModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(5, 5, 4, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div className="glass-card animate-slide" style={{
        width: '90%',
        maxWidth: '540px',
        padding: '32px',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '20px',
            top: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            padding: '4px',
            transition: 'var(--transition-smooth)'
          }}
          onMouseEnter={(e) => e.target.style.color = '#FFF'}
          onMouseLeave={(e) => e.target.style.color = 'var(--color-text-muted)'}
        >
          <X size={20} />
        </button>

        {title && (
          <h3 style={{
            fontSize: '24px',
            fontFamily: 'var(--font-headline)',
            marginBottom: '20px',
            borderBottom: '1px solid rgba(255, 107, 53, 0.15)',
            paddingBottom: '12px',
            color: '#FFF'
          }}>
            {title}
          </h3>
        )}

        <div style={{ marginTop: '10px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};
export default GlassModal;
