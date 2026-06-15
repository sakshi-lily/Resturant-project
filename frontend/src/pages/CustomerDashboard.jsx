import React, { useState, useEffect } from 'react';
import { ShoppingBag, Calendar, Star, User, Lock, Edit2, CheckCircle, Clock, MapPin, Phone, MessageSquare } from 'lucide-react';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const CustomerDashboard = () => {
  const { user, token, setUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('orders'); // orders, reservations, review, profile
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Forms
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    password: '',
    confirmPassword: ''
  });

  const [reviewForm, setReviewForm] = useState({
    name: user?.name || '',
    rating: '5',
    comment: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (user) {
      setProfileForm(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      }));
      setReviewForm(prev => ({
        ...prev,
        name: user.name || ''
      }));
    }
  }, [user]);

  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setHasError(false);
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const [ordersRes, reservationsRes] = await Promise.all([
        fetch(`${API_URL}/orders/my-orders`, { headers }),
        fetch(`${API_URL}/reservations/my-reservations`, { headers })
      ]);

      if (!ordersRes.ok || !reservationsRes.ok) {
        throw new Error('Sync failed');
      }

      const [ordersData, reservationsData] = await Promise.all([
        ordersRes.json(),
        reservationsRes.json()
      ]);

      if (Array.isArray(ordersData)) {
        setOrders(ordersData);
      }
      if (Array.isArray(reservationsData)) {
        setReservations(reservationsData);
      }
    } catch (err) {
      console.error(err);
      showToast('Error syncing user dashboard records.', 'error');
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  // Update Profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (profileForm.password && profileForm.password !== profileForm.confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    setSubmittingProfile(true);
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profileForm.name,
          phone: profileForm.phone,
          address: profileForm.address,
          ...(profileForm.password && { password: profileForm.password })
        })
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data);
        showToast('Profile updated successfully!', 'success');
        setProfileForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
      } else {
        showToast(data.message || 'Profile update failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error updating profile.', 'error');
    } finally {
      setSubmittingProfile(false);
    }
  };

  // Submit Feedback Review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewForm)
      });

      if (res.ok) {
        showToast('Thank you! Your testimonial has been submitted for moderation.', 'success');
        setReviewForm({
          name: user?.name || '',
          rating: '5',
          comment: '',
          imageUrl: ''
        });
      } else {
        showToast('Failed to submit review.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error submitting review.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="section-padding" style={{ animation: 'fadeIn 0.8s ease-out', paddingTop: '140px', minHeight: '100vh' }}>
      <div className="container">
        
        {/* Banner header */}
        <div style={{ marginBottom: '40px' }}>
          <span style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 800 }}>Welcome Back</span>
          <h1 style={{ fontSize: '32px', marginTop: '6px', fontFamily: 'var(--font-headline)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={28} style={{ color: 'var(--color-primary)' }} />
            {user?.name}'s Dashboard
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Manage your premium table reservations, live delivery orders, and review settings.
          </p>
        </div>

        {/* Dashboard Tabs Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '40px',
          alignItems: 'start'
        }} className="dashboard-grid">
          
          {/* Side Tabs Navigation */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px' }}>
            <button 
              onClick={() => setActiveTab('orders')} 
              className={`filter-tab ${activeTab === 'orders' ? 'active' : ''}`}
              style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', padding: '12px' }}
            >
              <ShoppingBag size={16} />
              My Orders ({orders.length})
            </button>
            <button 
              onClick={() => setActiveTab('reservations')} 
              className={`filter-tab ${activeTab === 'reservations' ? 'active' : ''}`}
              style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', padding: '12px' }}
            >
              <Calendar size={16} />
              My Bookings ({reservations.length})
            </button>
            <button 
              onClick={() => setActiveTab('review')} 
              className={`filter-tab ${activeTab === 'review' ? 'active' : ''}`}
              style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', padding: '12px' }}
            >
              <Star size={16} />
              Write Review
            </button>
            <button 
              onClick={() => setActiveTab('profile')} 
              className={`filter-tab ${activeTab === 'profile' ? 'active' : ''}`}
              style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', padding: '12px' }}
            >
              <User size={16} />
              Profile Settings
            </button>
          </div>

          {/* Active Tab Panel Content */}
          <div className="glass-card" style={{ padding: '30px' }}>
            
            {loading && activeTab !== 'profile' && activeTab !== 'review' ? (
              <div className="loader-container">
                <div className="spinner-gold"></div>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Syncing order databases...</span>
              </div>
            ) : hasError && activeTab !== 'profile' && activeTab !== 'review' ? (
              <div className="error-state">
                <div className="error-state-icon">⚠️</div>
                <h3>Database Sync Failed</h3>
                <p>We could not sync your reservation or order history. Please check your connection.</p>
                <button onClick={fetchDashboardData} className="btn btn-primary btn-md" style={{ marginTop: '8px' }}>
                  Retry Sync
                </button>
              </div>
            ) : (
              <div>
                
                {/* 1. ORDERS TAB */}
                {activeTab === 'orders' && (
                  <div>
                    <h3 style={{ fontSize: '20px', color: '#FFF', marginBottom: '20px', fontFamily: 'var(--font-headline)' }}>Your Orders</h3>
                    {orders.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--color-text-muted)' }}>
                        <ShoppingBag size={40} style={{ opacity: 0.3, marginBottom: '15px', color: 'var(--color-primary)' }} />
                        <p style={{ margin: 0, fontSize: '14px' }}>You haven't placed any culinary orders yet.</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {orders.map(o => (
                          <div key={o._id} style={{
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            background: 'rgba(255, 255, 255, 0.01)',
                            borderRadius: '12px',
                            padding: '20px',
                            animation: 'fadeIn 0.4s ease-out'
                          }}>
                            
                            {/* Summary strip */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '15px' }}>
                              <div>
                                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>ORDER REF: {o._id.substring(o._id.length - 8).toUpperCase()}</span>
                                <div style={{ fontSize: '13px', color: 'var(--color-text-light)', marginTop: '2px' }}>
                                  Placed: {new Date(o.createdAt).toLocaleDateString()} at {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                              <span style={{
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontSize: '11px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                background: o.status === 'Delivered' ? 'rgba(74, 222, 128, 0.1)' : o.status === 'Cancelled' ? 'rgba(248, 113, 113, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                                color: o.status === 'Delivered' ? '#4ADE80' : o.status === 'Cancelled' ? '#F87171' : '#FBBF24'
                              }}>
                                {o.status}
                              </span>
                            </div>

                            {/* Details Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }} className="grid-2-form">
                              
                              {/* Items List */}
                              <div>
                                <h4 style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Dishes List</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  {o.items.map((item, idx) => (
                                    <li key={idx} style={{ fontSize: '13px', color: 'var(--color-text-light)', display: 'flex', justifyContent: 'space-between' }}>
                                      <span>{item.quantity}x {item.name}</span>
                                      <span style={{ color: 'var(--color-text-muted)' }}>${item.price * item.quantity}</span>
                                    </li>
                                  ))}
                                </ul>
                                <div style={{ borderTop: '1px dashed rgba(255,255,255,0.06)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '14px' }}>
                                  <span style={{ color: 'var(--color-text-light)' }}>Total Paid (COD)</span>
                                  <span style={{ color: 'var(--color-accent-gold)' }}>${o.totalAmount}</span>
                                </div>
                              </div>

                              {/* Delivery info */}
                              <div style={{ fontSize: '13px', borderLeft: '1px solid rgba(255,255,255,0.04)', paddingLeft: '20px' }} className="delivery-card-dash">
                                <h4 style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Delivery Address</h4>
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                                  <MapPin size={14} style={{ color: 'var(--color-primary)', marginTop: '2px', flexShrink: 0 }} />
                                  <p style={{ margin: 0, color: 'var(--color-text-light)', lineHeight: '1.4' }}>{o.deliveryAddress}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '8px' }}>
                                  <Phone size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                                  <span style={{ color: 'var(--color-text-muted)' }}>{o.phone}</span>
                                </div>
                              </div>

                            </div>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. RESERVATIONS TAB */}
                {activeTab === 'reservations' && (
                  <div>
                    <h3 style={{ fontSize: '20px', color: '#FFF', marginBottom: '20px', fontFamily: 'var(--font-headline)' }}>Your Table Reservations</h3>
                    {reservations.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--color-text-muted)' }}>
                        <Calendar size={40} style={{ opacity: 0.3, marginBottom: '15px', color: 'var(--color-primary)' }} />
                        <p style={{ margin: 0, fontSize: '14px' }}>You haven't made any dining room reservations yet.</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {reservations.map(b => (
                          <div key={b._id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            border: '1px solid rgba(255,255,255,0.05)',
                            background: 'rgba(255,255,255,0.01)',
                            padding: '20px',
                            borderRadius: '12px',
                            flexWrap: 'wrap',
                            gap: '15px',
                            animation: 'fadeIn 0.4s ease-out'
                          }}>
                            
                            <div>
                              <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {b.seatingArea}
                              </span>
                              <h4 style={{ fontSize: '17px', color: '#FFF', margin: '4px 0' }}>
                                {new Date(b.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })} at <span style={{ color: 'var(--color-accent-gold)' }}>{b.time}</span>
                              </h4>
                              <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                                Table booked for <strong>{b.guests} Pax</strong> | Guest name: {b.name}
                              </span>
                            </div>

                            <span style={{
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: 700,
                              background: b.status === 'Confirmed' ? 'rgba(74, 222, 128, 0.1)' : b.status === 'Cancelled' ? 'rgba(248, 113, 113, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                              color: b.status === 'Confirmed' ? '#4ADE80' : b.status === 'Cancelled' ? '#F87171' : '#FBBF24'
                            }}>
                              {b.status}
                            </span>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. WRITE REVIEW TAB */}
                {activeTab === 'review' && (
                  <div>
                    <h3 style={{ fontSize: '20px', color: '#FFF', marginBottom: '8px', fontFamily: 'var(--font-headline)' }}>Share Your Experience</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '25px' }}>
                      Publish your dining review. Verified reviews will instantly populate the public customer feedback page.
                    </p>

                    <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600 }}>Your Public Name</label>
                        <input 
                          type="text" 
                          required
                          className="input-field"
                          placeholder="e.g. Jane D."
                          value={reviewForm.name}
                          onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600 }}>Overall Rating</label>
                        <select
                          className="input-field"
                          value={reviewForm.rating}
                          onChange={(e) => setReviewForm(prev => ({ ...prev, rating: e.target.value }))}
                          style={{ appearance: 'none', cursor: 'pointer' }}
                        >
                          <option value="5" style={{ backgroundColor: '#141412' }}>5 Stars - Meticulous & Perfect</option>
                          <option value="4" style={{ backgroundColor: '#141412' }}>4 Stars - Highly Satisfying</option>
                          <option value="3" style={{ backgroundColor: '#141412' }}>3 Stars - Average Dining</option>
                          <option value="2" style={{ backgroundColor: '#141412' }}>2 Stars - Needs Improvement</option>
                          <option value="1" style={{ backgroundColor: '#141412' }}>1 Star - Disappointing Experience</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600 }}>Dining Experience Comment</label>
                        <textarea
                          required
                          rows="4"
                          className="input-field"
                          placeholder="Share highlights about our premium steaks, plating aesthetic, or table ambiance..."
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                          style={{ resize: 'none' }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="btn btn-primary btn-md"
                        style={{ width: 'fit-content', marginTop: '10px' }}
                      >
                        {submittingReview ? 'Submitting review...' : 'Submit Verified Testimonial'}
                      </button>
                    </form>
                  </div>
                )}

                {/* 4. PROFILE TAB */}
                {activeTab === 'profile' && (
                  <div>
                    <h3 style={{ fontSize: '20px', color: '#FFF', marginBottom: '8px', fontFamily: 'var(--font-headline)' }}>Profile Settings</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '25px' }}>
                      Update your account settings. Leave password fields empty if you do not want to alter credentials.
                    </p>

                    <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600 }}>Full Name</label>
                        <input 
                          type="text" 
                          required
                          className="input-field"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600 }}>Email Address (Read Only)</label>
                        <input 
                          type="email" 
                          disabled
                          className="input-field"
                          value={user?.email || ''}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600 }}>Phone Number</label>
                        <input 
                          type="tel" 
                          placeholder="e.g. +1 (555) 000-0000"
                          className="input-field"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600 }}>Delivery Address</label>
                        <textarea 
                          placeholder="e.g. 123 Culinary St, Suite 200, New York"
                          rows="2"
                          className="input-field"
                          value={profileForm.address}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                          style={{ resize: 'none' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="grid-2-form">
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600 }}>New Password</label>
                          <input 
                            type="password" 
                            className="input-field"
                            placeholder="••••••••"
                            value={profileForm.password}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, password: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600 }}>Confirm New Password</label>
                          <input 
                            type="password" 
                            className="input-field"
                            placeholder="••••••••"
                            value={profileForm.confirmPassword}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={submittingProfile}
                        className="btn btn-primary btn-md"
                        style={{ width: 'fit-content', marginTop: '10px' }}
                      >
                        {submittingProfile ? 'Saving updates...' : 'Save Settings'}
                      </button>
                    </form>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
            gap: 25px !important;
          }
          .grid-2-form {
            grid-template-columns: 1fr !important;
            gap: 15px !important;
          }
          .delivery-card-dash {
            border-left: none !important;
            padding-left: 0 !important;
            border-top: 1px solid rgba(255,255,255,0.05);
            padding-top: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomerDashboard;
