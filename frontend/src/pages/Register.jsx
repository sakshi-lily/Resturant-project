import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, ArrowRight } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user, register } = useAuth();
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
    if (!name || !email || !password) return;
    setSubmitting(true);
    const result = await register(name, email, password);
    setSubmitting(false);
    if (result.success) {
      navigate('/dashboard');
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
              <UserPlus size={28} />
            </div>
            <h1 style={{ fontSize: '28px', fontFamily: 'var(--font-headline)', marginBottom: '8px', color: '#FFF' }}>
              Create <span className="text-gradient">Account</span>
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', lineHeight: '1.5' }}>
              Sign up to unlock reservations status tracking and updates.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label htmlFor="reg-name" style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  id="reg-name"
                  required
                  placeholder="John Doe"
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '45px' }}
                />
                <User size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  id="reg-email"
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
              <label htmlFor="reg-password" style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  id="reg-password"
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
              className="btn btn-primary btn-md btn-block"
              disabled={submitting}
              style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {submitting ? 'Registering...' : 'Register Profile'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Footer Info */}
          <div style={{ textAlign: 'center', marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '20px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign In Instead</Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
