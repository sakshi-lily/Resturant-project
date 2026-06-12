import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, UtensilsCrossed, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on page change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About Us', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Reservations', path: '/reservation' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Contact', path: '/contact' }
  ];

  const activeLinkStyle = (path) => {
    return location.pathname === path
      ? { color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary)' }
      : {};
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      padding: scrolled ? '12px 0' : '20px 0',
      background: scrolled ? 'rgba(10, 10, 9, 0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255, 107, 53, 0.1)' : '1px solid transparent',
      transition: 'var(--transition-smooth)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 800,
          fontSize: '22px',
          fontFamily: 'var(--font-headline)',
          color: '#FFF'
        }}>
          <UtensilsCrossed size={24} style={{ color: 'var(--color-primary)' }} />
          <span>Flavor<span style={{ color: 'var(--color-primary)' }}>Nest</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-desktop-links" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '30px'
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--color-text-light)',
                padding: '6px 0',
                ...activeLinkStyle(link.path)
              }}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }} className="nav-desktop-actions">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldAlert size={14} style={{ color: 'var(--color-primary)' }} />
                  <span>Admin</span>
                </Link>
              )}
              <button onClick={logout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px', cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF' }}>
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
              Sign In
            </Link>
          )}
          <Link to="/reservation" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '13px' }}>
            Book a Table
          </Link>
        </div>


        {/* Hamburger Toggler */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: '#FFF',
            cursor: 'pointer',
            display: 'none' // Handled by media query in App.css or index.css
          }}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          width: '100%',
          height: 'calc(100vh - 60px)',
          background: 'rgba(10, 10, 9, 0.98)',
          backdropFilter: 'blur(20px)',
          padding: '40px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          zIndex: 999,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              style={{
                fontSize: '20px',
                fontWeight: 600,
                color: 'var(--color-text-light)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                paddingBottom: '12px'
              }}
            >
              {link.name}
            </Link>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="btn btn-secondary" style={{ width: '100%' }}>
                    Admin Panel
                  </Link>
                )}
                <button onClick={() => { logout(); setIsOpen(false); }} className="btn btn-secondary" style={{ width: '100%', cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', padding: '10px' }}>
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="btn btn-secondary" style={{ width: '100%' }}>
                Sign In
              </Link>
            )}
            <Link to="/reservation" onClick={() => setIsOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>
              Book a Table
            </Link>
          </div>

        </div>
      )}

      {/* Embedded CSS for responsive navbar toggle */}
      <style>{`
        @media (max-width: 992px) {
          .nav-desktop-links, .nav-desktop-actions {
            display: none !important;
          }
          .nav-mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};
export default Navbar;
