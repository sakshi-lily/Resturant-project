import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState('idle'); // idle, loading, success

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    setFormStatus('loading');
    
    // Simulate sending message
    setTimeout(() => {
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="section-padding" style={{ animation: 'fadeIn 0.8s ease-out', paddingTop: '140px' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 800 }}>Get In Touch</span>
          <h1 style={{ fontSize: 'calc(2rem + 1.5vw)', marginTop: '8px', marginBottom: '16px', fontFamily: 'var(--font-headline)' }}>
            Contact <span className="text-gradient">Us</span>
          </h1>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Have a question about group bookings, corporate partnerships, or custom menu inquiries? Leave us a note.
          </p>
        </div>

        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '40px',
          alignItems: 'start'
        }} className="contact-grid">
          
          {/* Info Panel Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '20px', borderBottom: '1px solid rgba(255,107,53,0.1)', paddingBottom: '10px' }}>FlavorNest Details</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 215, 0, 0.08)',
                  boxShadow: '0 0 10px rgba(255, 215, 0, 0.15)',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-accent-gold)'
                }}>
                  <Phone size={18} />
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)' }}>Reservations Hotline</span>
                  <strong style={{ color: '#FFF' }}>+1 (555) 389-4389</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 215, 0, 0.08)',
                  boxShadow: '0 0 10px rgba(255, 215, 0, 0.15)',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-accent-gold)'
                }}>
                  <Mail size={18} />
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)' }}>General Inquiries</span>
                  <strong style={{ color: '#FFF' }}>hello@flavornest.com</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 215, 0, 0.08)',
                  boxShadow: '0 0 10px rgba(255, 215, 0, 0.15)',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-accent-gold)'
                }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)' }}>Address Location</span>
                  <strong style={{ color: '#FFF' }}>742 Culinary Lane, Suite 100, New York</strong>
                </div>
              </div>
            </div>

            {/* Operating hours */}
            <div className="glass-card" style={{ background: '#0F0F0E', border: '1px solid rgba(212,175,55,0.1)' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--color-accent-gold)', marginBottom: '15px' }}>Operating Hours</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                  <span>Monday - Thursday</span>
                  <strong style={{ color: '#FFF' }}>5:00 PM - 10:00 PM</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                  <span>Friday - Saturday</span>
                  <strong style={{ color: '#FFF' }}>4:00 PM - 11:00 PM</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
                  <span>Sunday</span>
                  <strong style={{ color: '#FFF' }}>11:00 AM - 9:00 PM</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Form Panel Right */}
          <div className="glass-card">
            <h3 style={{ fontSize: '20px', marginBottom: '24px', borderBottom: '1px solid rgba(255,107,53,0.1)', paddingBottom: '12px' }}>Send Message</h3>
            
            {formStatus === 'success' ? (
              <div style={{ textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                <CheckCircle2 size={48} style={{ color: '#4ADE80' }} />
                <h4 style={{ color: '#FFF', fontSize: '18px' }}>Message Sent Successfully</h4>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
                  Thank you for reaching out. A FlavorNest guest relationship representative will respond back within 24 hours.
                </p>
                <button onClick={() => setFormStatus('idle')} className="btn btn-secondary" style={{ marginTop: '15px' }}>Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label htmlFor="contact-name" style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Your Name</label>
                  <input
                    type="text"
                    name="name"
                    id="contact-name"
                    required
                    placeholder="Enter full name"
                    className="input-field"
                    value={formData.name}
                    onChange={handleInputChange}
                    aria-required="true"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    id="contact-email"
                    required
                    placeholder="Enter email address"
                    className="input-field"
                    value={formData.email}
                    onChange={handleInputChange}
                    aria-required="true"
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    id="contact-subject"
                    required
                    placeholder="Message subject"
                    className="input-field"
                    value={formData.subject}
                    onChange={handleInputChange}
                    aria-required="true"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Message Content</label>
                  <textarea
                    name="message"
                    id="contact-message"
                    required
                    rows="5"
                    placeholder="Detail your corporate events, diet requests, or inquiries..."
                    className="input-field"
                    value={formData.message}
                    onChange={handleInputChange}
                    style={{ resize: 'none' }}
                    aria-required="true"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-md btn-block"
                  style={{ marginTop: '10px' }}
                  disabled={formStatus === 'loading'}
                >
                  {formStatus === 'loading' ? 'Transmitting message...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 3. Dark Map Mockup */}
        <div style={{ marginTop: '60px' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>Our Location</h3>
          <div style={{
            height: '380px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(255,107,53,0.15)',
            background: 'linear-gradient(rgba(10, 10, 9, 0.4), rgba(10, 10, 9, 0.8)), url("https://images.unsplash.com/photo-1522083165195-3427502977a1?auto=format&fit=crop&w=1600&q=80") no-repeat center center/cover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }} className="dark-map-wrapper">
            <div className="glass-card animate-fade" style={{
              maxWidth: '320px',
              textAlign: 'center',
              background: 'rgba(10, 10, 9, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 215, 0, 0.25)',
              boxShadow: '0 15px 35px rgba(0,0,0,0.8), 0 0 15px rgba(255, 122, 0, 0.1)'
            }}>
              <MapPin size={24} style={{ color: 'var(--color-accent-gold)', marginBottom: '8px', margin: '0 auto' }} />
              <h4 style={{ fontSize: '16px', color: '#FFF', marginBottom: '5px', fontFamily: 'var(--font-headline)' }}>FlavorNest Manhattan</h4>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>742 Culinary Lane, Suite 100, New York</p>
              <a
                href="https://google.com/maps"
                target="_blank"
                rel="noreferrer"
                className="btn btn-gold"
                style={{ marginTop: '15px', padding: '8px 16px', fontSize: '11px', width: '100%' }}
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
        }
      `}</style>
    </div>
  );
};
export default Contact;
