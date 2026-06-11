import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getColors = () => {
    switch (type) {
      case 'success': return { bg: 'rgba(16, 185, 129, 0.95)', border: '#10B981' };
      case 'error': return { bg: 'rgba(239, 68, 68, 0.95)', border: '#EF4444' };
      default: return { bg: 'rgba(255, 107, 53, 0.95)', border: '#FF6B35' };
    }
  };

  const { bg, border } = getColors();

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 3000,
      background: bg,
      borderLeft: `5px solid ${border}`,
      color: '#FFF',
      padding: '16px 20px',
      borderRadius: '8px',
      boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      minWidth: '320px',
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {type === 'success' && <CheckCircle size={18} />}
      {type === 'error' && <AlertCircle size={18} />}
      {type === 'info' && <Info size={18} />}
      
      <span style={{ fontSize: '14px', fontWeight: 500, flexGrow: 1 }}>{message}</span>
      
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', opacity: 0.7, display: 'inline-flex' }}>
        <X size={16} />
      </button>
    </div>
  );
};
export default Toast;
