import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

// Providers
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';


// Reusable Layouts
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Reservation from './pages/Reservation';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminLogin from './pages/AdminLogin';

// Route Guards
import ProtectedRoute from './components/ProtectedRoute';

// Cart UI
import CartDrawer from './components/CartDrawer';



// Scroll To Top on page navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Sticky Floating CTA button on mobile
const StickyMobileCTA = () => {
  const [show, setShow] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300 && window.innerWidth < 768 && location.pathname !== '/reservation') {
        setShow(true);
      } else {
        setShow(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  if (!show) return null;

  return (
    <Link
      to="/reservation"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 998,
        background: 'var(--color-primary)',
        color: '#FFF',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(255, 107, 53, 0.4)',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <Calendar size={22} />
    </Link>
  );
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            
            {/* Shared Navigation Header */}
            <Navbar />
            
            {/* Route Switcher */}
            <main style={{ minHeight: 'calc(100vh - 120px)' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/about" element={<About />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/reservation" element={<Reservation />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/dashboard" element={
                  <ProtectedRoute adminOnly={false}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            
            {/* Shared Footer */}
            <Footer />
            
            {/* Floating CTA */}
            <StickyMobileCTA />

            {/* Slide-out Cart Panel */}
            <CartDrawer />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}



export default App;
