import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

export const Login = () => {
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
      if (result.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
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
      background: 'radial-gradient(circle at center, rgba(255,107,53,0.03) 0%, rgba(10,10,9,0) 70%)'
    }}>
      <div className="container" style={{ maxWidth: '460px' }}>
        
        {/* Card wrapper */}
        <div className="glass-card" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
          
          {/* Top subtle glow line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--color-primary), var(--color-accent-gold), transparent)'
          }} />

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(255, 107, 53, 0.1)',
              border: '1px solid rgba(255, 107, 53, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: 'var(--color-primary)'
            }}>
              <User size={28} />
            </div>
            <h1 style={{ fontSize: '28px', fontFamily: 'var(--font-headline)', marginBottom: '8px', color: '#FFF' }}>
              Guest <span className="text-gradient">Sign In</span>
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', lineHeight: '1.5' }}>
              Sign in to manage your orders, track reservations, and write verified reviews.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label htmlFor="login-email" style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  id="login-email"
                  required
                  placeholder="patron@example.com"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '45px' }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  id="login-password"
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
              className="btn btn-primary"
              disabled={submitting}
              style={{ width: '100%', padding: '14px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {submitting ? 'Verifying profile...' : 'Sign In Now'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Footer Info */}
          <div style={{ textAlign: 'center', marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '20px', fontSize: '13px', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              Need an account? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Create User Account</Link>
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              Are you staff? <Link to="/admin-login" style={{ color: 'var(--color-accent-gold)', fontWeight: 600 }}>Admin Portal Sign In</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
