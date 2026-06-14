import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Mail, Lock, ArrowRight, ShieldCheck, LockKeyhole } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.success) {
      // navigation is handled by useEffect when 'user' state updates
    }
  };

  return (
    <div className="section-padding" style={{
      animation: 'fadeIn 0.8s ease-out',
      paddingTop: '160px',
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, rgba(212,175,55,0.04) 0%, rgba(10,10,9,0) 70%)'
    }}>
      <div className="container" style={{ maxWidth: '460px' }}>
        
        {/* Card wrapper */}
        <div className="glass-card" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
          
          {/* Top subtle gold glow line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, transparent, var(--color-accent-gold), var(--color-primary), transparent)'
          }} />

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: 'var(--color-accent-gold)'
            }}>
              <LockKeyhole size={28} />
            </div>
            <h1 style={{ fontSize: '28px', fontFamily: 'var(--font-headline)', marginBottom: '8px', color: '#FFF' }}>
              Admin <span style={{ color: 'var(--color-accent-gold)' }}>Portal</span>
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', lineHeight: '1.5' }}>
              Access the FlavorNest secure management panel. Authorized administrative credentials required.
            </p>
          </div>

          {/* Warning badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.15)',
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '24px',
            fontSize: '12px',
            color: '#F87171'
          }}>
            <ShieldAlert size={16} style={{ flexShrink: 0 }} />
            <span>Unauthorized access attempts are monitored and recorded.</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label htmlFor="admin-email" style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Admin Email
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  id="admin-email"
                  required
                  placeholder="admin@flavornest.com"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '45px' }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  id="admin-password"
                  required
                  placeholder="••••••••"
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '45px' }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-gold"
              disabled={submitting}
              style={{ width: '100%', padding: '14px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {submitting ? 'Verifying Admin...' : 'Authenticate'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Footer Link */}
          <div style={{ textAlign: 'center', marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '20px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
            Are you a customer? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Customer Sign In</Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
