import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, UtensilsCrossed, ShieldAlert, ShoppingCart, Clock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';



export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { getCartCount, setIsCartOpen } = useCart();



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
          <UtensilsCrossed size={24} style={{ color: 'var(--color-accent-gold)' }} />
          <span>Flavor<span style={{ color: 'var(--color-accent-gold)' }}>Nest</span></span>
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
              className="sliding-link"
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
          {/* Cart Icon Trigger */}
          <button 
            onClick={() => setIsCartOpen(true)}
            style={{
              background: 'rgba(255, 107, 53, 0.08)',
              border: '1px solid rgba(255, 107, 53, 0.2)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              cursor: 'pointer',
              position: 'relative',
              transition: 'var(--transition-smooth)',
              padding: 0
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 107, 53, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 107, 53, 0.08)'}
          >
            <ShoppingCart size={18} style={{ color: 'var(--color-primary)' }} />
            {getCartCount() > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--color-accent-gold)',
                color: '#000',
                fontSize: '10px',
                fontWeight: 800,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                border: '1.5px solid #000'
              }}>
                {getCartCount()}
              </span>
            )}
          </button>

          {user ? (
            <>
              {user.role === 'admin' ? (
                <>
                  <Link to="/admin" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldAlert size={14} style={{ color: 'var(--color-primary)' }} />
                    <span>Admin Panel</span>
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={14} style={{ color: 'var(--color-primary)' }} />
                  <span>My Dashboard</span>
                </Link>
              )}
              <button onClick={logout} className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF' }}>
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-secondary btn-sm">
              Sign In
            </Link>
          )}
          <Link to="/reservation" className="btn btn-primary btn-md">
            Book a Table
          </Link>
        </div>



        {/* Hamburger Toggler Container */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Mobile Cart Toggler */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="nav-mobile-cart"
            style={{
              background: 'none',
              border: 'none',
              color: '#FFF',
              cursor: 'pointer',
              position: 'relative',
              marginRight: '20px',
              display: 'none',
              padding: 0
            }}
          >
            <ShoppingCart size={22} style={{ color: 'var(--color-primary)' }} />
            {getCartCount() > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: 'var(--color-accent-gold)',
                color: '#000',
                fontSize: '9px',
                fontWeight: 800,
                width: '15px',
                height: '15px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #000'
              }}>
                {getCartCount()}
              </span>
            )}
          </button>

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

      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: scrolled ? '64px' : '80px',
          left: 0,
          width: '100%',
          height: scrolled ? 'calc(100vh - 64px)' : 'calc(100vh - 80px)',
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
                {user.role === 'admin' ? (
                  <>
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="btn btn-secondary btn-md btn-block">
                      Admin Panel
                    </Link>
                  </>
                ) : (
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="btn btn-secondary btn-md btn-block">
                    My Dashboard
                  </Link>
                )}
                <button onClick={() => { logout(); setIsOpen(false); }} className="btn btn-secondary btn-md btn-block" style={{ cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF' }}>
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="btn btn-secondary btn-md btn-block">
                Sign In
              </Link>
            )}
            <Link to="/reservation" onClick={() => setIsOpen(false)} className="btn btn-primary btn-md btn-block">
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
          .nav-mobile-toggle, .nav-mobile-cart {
            display: block !important;
          }
        }
      `}</style>

    </nav>
  );
};
export default Navbar;
