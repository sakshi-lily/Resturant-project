import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const response = await fetch('http://localhost:5000/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setStatus('success');
        setMessage('Thank you for subscribing to our Inner Circle!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again later.');
    }
  };

  return (
    <footer style={{
      backgroundColor: '#070706',
      borderTop: '1px solid rgba(255, 107, 53, 0.1)',
      paddingTop: '80px',
      paddingBottom: '40px',
      color: 'var(--color-text-muted)',
      fontSize: '14px'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr',
          gap: '40px',
          marginBottom: '60px'
        }} className="footer-grid">
          
          {/* Brand Info */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-headline)',
              color: '#FFF',
              fontSize: '24px',
              marginBottom: '20px'
            }}>
              Flavor<span style={{ color: 'var(--color-primary)' }}>Nest</span>
            </h3>
            <p style={{ marginBottom: '24px', lineHeight: '1.7' }}>
              Experience the pinnacle of culinary artistry, where fresh organic ingredients are sculpted into memorable culinary masterpieces.
            </p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-light)'
              }} className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-light)'
              }} className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0 -5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1 -1h3z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#FFF', fontSize: '16px', marginBottom: '20px', fontWeight: 600 }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><Link to="/" style={{ hover: 'color: #FFF' }}>Home</Link></li>
              <li><Link to="/menu">Our Menu</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/reservation">Book Seating</Link></li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h4 style={{ color: '#FFF', fontSize: '16px', marginBottom: '20px', fontWeight: 600 }}>Business Hours</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <strong style={{ color: 'var(--color-text-light)' }}>Monday - Thursday</strong>
                <div style={{ fontSize: '13px', marginTop: '2px' }}>5:00 PM - 10:00 PM</div>
              </li>
              <li>
                <strong style={{ color: 'var(--color-text-light)' }}>Friday - Saturday</strong>
                <div style={{ fontSize: '13px', marginTop: '2px' }}>4:00 PM - 11:00 PM</div>
              </li>
              <li>
                <strong style={{ color: 'var(--color-text-light)' }}>Sunday</strong>
                <div style={{ fontSize: '13px', marginTop: '2px' }}>11:00 AM - 9:00 PM</div>
              </li>
            </ul>
          </div>

          {/* Newsletter / Inner Circle */}
          <div>
            <h4 style={{ color: '#FFF', fontSize: '16px', marginBottom: '20px', fontWeight: 600 }}>Join the Inner Circle</h4>
            <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
              Subscribe to receive updates on seasonal menus, exclusive wine tastings, and chef creations.
            </p>
            <form onSubmit={handleSubscribe} style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="Enter your email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
                style={{ paddingRight: '50px' }}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  position: 'absolute',
                  right: '5px',
                  top: '5px',
                  width: '38px',
                  height: '38px',
                  borderRadius: '6px',
                  background: 'var(--color-primary)',
                  border: 'none',
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <Send size={16} />
              </button>
            </form>
            
            {/* Subscription Message feedback */}
            {status === 'success' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ADE80', marginTop: '12px', fontSize: '13px' }}>
                <CheckCircle2 size={16} />
                <span>{message}</span>
              </div>
            )}
            {status === 'error' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F87171', marginTop: '12px', fontSize: '13px' }}>
                <AlertCircle size={16} />
                <span>{message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Divider & Copyright */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }} className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} FlavorNest. All rights reserved. Crafted for premium experiences.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/about">Privacy Policy</Link>
            <Link to="/contact">Terms of Service</Link>
          </div>
        </div>
      </div>

      <style>{`
        .social-icon:hover {
          background: var(--color-primary) !important;
          border-color: var(--color-primary) !important;
          transform: translateY(-3px);
        }
        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 576px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};
export default Footer;
