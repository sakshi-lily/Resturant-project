import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, Calendar, Utensils, MessageSquare, Mail, Check, X, Trash2, 
  Plus, Edit3, Image, ShieldAlert, DollarSign, ShoppingBag, Clock, 
  Compass, Users, CheckCircle, RefreshCw, AlertCircle 
} from 'lucide-react';
import GlassModal from '../components/GlassModal';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';




export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders'); // orders, reservations, menu, offers, reviews, subscribers
  const { token } = useAuth();
  const { showToast } = useToast();
  const [showAllOrders, setShowAllOrders] = useState(false);
  const fileInputRef = useRef(null);
  const [imageInputMode, setImageInputMode] = useState('upload'); // 'upload' or 'url'
  
  // Data States
  const [bookings, setBookings] = useState([]);

  const [menuItems, setMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [offers, setOffers] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Modal / Form States
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Mains',
    imageUrl: '',
    isChefSpecial: false,
    allergens: ''
  });

  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    discountCode: '',
    isActive: true
  });

  const [loading, setLoading] = useState(true);

  // Fetch all backend data
  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const [bookingsRes, menuRes, reviewsRes, offersRes, subsRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}/reservations`, { headers }),
        fetch(`${API_URL}/menu`, { headers }),
        fetch(`${API_URL}/reviews`, { headers }),
        fetch(`${API_URL}/offers`, { headers }),
        fetch(`${API_URL}/subscribers`, { headers }),
        fetch(`${API_URL}/orders`, { headers })
      ]);



      const [bookingsData, menuData, reviewsData, offersData, subsData, ordersData] = await Promise.all([
        bookingsRes.json(),
        menuRes.json(),
        reviewsRes.json(),
        offersRes.json(),
        subsRes.json(),
        ordersRes.json()
      ]);

      setBookings(bookingsData);
      setMenuItems(menuData);
      setReviews(reviewsData);
      setOffers(offersData);
      setSubscribers(subsData);
      setOrders(ordersData);
      setLoading(false);
      if (silent) {
        showToast('Administrative dashboard synchronized with live databases.', 'success');
      }
    } catch (error) {
      console.error('Failed to load admin panel data', error);
      setLoading(false);
      showToast('Error syncing administrative data feeds.', 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update Reservation Status
  const handleUpdateBookingStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/reservations/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });


      if (res.ok) {
        setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
        showToast(`Reservation request ${status.toLowerCase()}ed successfully.`, 'success');
      } else {
        showToast('Failed to update reservation status.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error updating reservation status.', 'error');
    }
  };

  // Delete Reservation
  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Delete this reservation?')) return;
    try {
      const res = await fetch(`${API_URL}/reservations/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });


      if (res.ok) {
        setBookings(prev => prev.filter(b => b._id !== id));
        showToast('Reservation deleted successfully.', 'success');
      } else {
        showToast('Failed to delete reservation.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error deleting reservation.', 'error');
    }
  };

  // Delete Subscriber
  const handleDeleteSubscriber = async (id) => {
    if (!window.confirm('Remove subscriber?')) return;
    try {
      const res = await fetch(`${API_URL}/subscribers/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });


      if (res.ok) {
        setSubscribers(prev => prev.filter(s => s._id !== id));
        showToast('Subscriber removed successfully.', 'success');
      } else {
        showToast('Failed to remove subscriber.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error removing subscriber.', 'error');
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
        showToast(`Order status updated to "${status}"`, 'success');
      } else {
        showToast('Failed to update order status.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error updating order status.', 'error');
    }
  };

  // Delete Order Record
  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Permanently delete this order record?')) return;
    try {
      const res = await fetch(`${API_URL}/orders/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o._id !== id));
        showToast('Order record deleted successfully.', 'success');
      } else {
        showToast('Failed to delete order record.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error deleting order record.', 'error');
    }
  };


  // Toggle review moderation status
  const handleToggleReviewApproval = async (id, currentStatus) => {
    try {
      const res = await fetch(`${API_URL}/reviews/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isApproved: !currentStatus })
      });


      if (res.ok) {
        setReviews(prev => prev.map(r => r._id === id ? { ...r, isApproved: !currentStatus } : r));
        showToast(!currentStatus ? 'Review approved for public display.' : 'Review suspended from public display.', 'success');
      } else {
        showToast('Failed to update review moderation status.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error updating review moderation.', 'error');
    }
  };

  // Delete Review
  const handleDeleteReview = async (id) => {
    if (!window.confirm('Permanently delete review?')) return;
    try {
      const res = await fetch(`${API_URL}/reviews/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });


      if (res.ok) {
        setReviews(prev => prev.filter(r => r._id !== id));
        showToast('Review permanently deleted.', 'success');
      } else {
        showToast('Failed to delete review.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error deleting review.', 'error');
    }
  };

  // Toggle Offer Activation
  const handleToggleOffer = async (id, currentStatus) => {
    try {
      const res = await fetch(`${API_URL}/offers/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });


      if (res.ok) {
        setOffers(prev => prev.map(o => o._id === id ? { ...o, isActive: !currentStatus } : o));
        showToast(!currentStatus ? 'Offer activated.' : 'Offer deactivated.', 'success');
      } else {
        showToast('Failed to update offer status.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error toggling offer activation.', 'error');
    }
  };

  // Delete Offer
  const handleDeleteOffer = async (id) => {
    if (!window.confirm('Delete offer banner?')) return;
    try {
      const res = await fetch(`${API_URL}/offers/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });


      if (res.ok) {
        setOffers(prev => prev.filter(o => o._id !== id));
        showToast('Promo campaign deleted.', 'success');
      } else {
        showToast('Failed to delete offer.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error deleting offer.', 'error');
    }
  };

  // Submit Menu Item (Create / Edit)
  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    const url = editingItem 
      ? `${API_URL}/menu/${editingItem._id}` 
      : `${API_URL}/menu`;

    const method = editingItem ? 'PUT' : 'POST';

    const formattedForm = {
      ...menuForm,
      price: Number(menuForm.price),
      allergens: menuForm.allergens.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedForm)
      });

      if (res.ok) {
        fetchData(true);
        setIsMenuModalOpen(false);
        setEditingItem(null);
        setMenuForm({
          name: '',
          description: '',
          price: '',
          category: 'Mains',
          imageUrl: '',
          isChefSpecial: false,
          allergens: ''
        });
        showToast(editingItem ? 'Dish updated successfully.' : 'New dish cataloged successfully.', 'success');
      } else {
        showToast('Failed to save dish menu item.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error saving menu item.', 'error');
    }
  };

  // Submit Offer
  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/offers`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(offerForm)
      });


      if (res.ok) {
        fetchData(true);
        setIsOfferModalOpen(false);
        setOfferForm({
          title: '',
          description: '',
          discountCode: '',
          isActive: true
        });
        showToast('Promo banner published successfully.', 'success');
      } else {
        showToast('Failed to publish promo banner.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error publishing offer banner.', 'error');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('Image file size must be less than 10MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setMenuForm(prev => ({ ...prev, imageUrl: reader.result }));
    };
    reader.onerror = () => {
      showToast('Failed to read file.', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleEditMenuClick = (item) => {
    setEditingItem(item);
    setMenuForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      imageUrl: item.imageUrl,
      isChefSpecial: item.isChefSpecial,
      allergens: item.allergens ? item.allergens.join(', ') : ''
    });
    setImageInputMode(item.imageUrl && item.imageUrl.startsWith('http') ? 'url' : 'upload');
    setIsMenuModalOpen(true);
  };

  const handleDeleteMenuItem = async (id) => {
    if (!window.confirm('Permanently delete this dish from menu list?')) return;
    try {
      const res = await fetch(`${API_URL}/menu/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });


      if (res.ok) {
        setMenuItems(prev => prev.filter(m => m._id !== id));
        showToast('Dish item removed from menu list.', 'success');
      } else {
        showToast('Failed to delete dish menu item.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error deleting menu item.', 'error');
    }
  };

  // Dashboard Stats Calculations
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending');
  const totalSubscribers = subscribers.length;
  const activeOffersCount = offers.filter(o => o.isActive).length;

  const totalRevenue = orders
    .filter(o => o.status === 'Delivered')
    .reduce((acc, o) => acc + o.totalAmount, 0);
  const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const activeOrdersCount = activeOrders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const displayedOrders = showAllOrders ? orders : activeOrders;


  // Seating Zone Stats
  const zoneStats = bookings.reduce((acc, curr) => {
    const area = curr.seatingArea || 'Indoor';
    if (area.includes('Indoor')) acc.indoor++;
    else if (area.includes('Patio') || area.includes('Outdoor')) acc.patio++;
    else if (area.includes("Chef's") || area.includes('Table')) acc.chef++;
    else acc.indoor++;
    return acc;
  }, { indoor: 0, patio: 0, chef: 0 });

  const maxZoneVal = Math.max(zoneStats.indoor, zoneStats.patio, zoneStats.chef, 1);
  const getBarHeight = (val) => (val / maxZoneVal) * 120; // Max height of 120px

  // Menu Category Stats
  const categoryStats = menuItems.reduce((acc, curr) => {
    const cat = curr.category || 'Mains';
    if (acc[cat] !== undefined) acc[cat]++;
    return acc;
  }, { Appetizers: 0, Mains: 0, Desserts: 0, Beverages: 0 });

  const totalMenuItems = menuItems.length || 1;
  const getPercent = (val) => Math.round((val / totalMenuItems) * 100);

  return (
    <div className="section-padding" style={{ animation: 'fadeIn 0.8s ease-out', paddingTop: '140px' }}>
      <div className="container">
        
        {/* Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 800 }}>Control Panel</span>
            <h1 style={{ fontSize: '32px', marginTop: '6px', fontFamily: 'var(--font-headline)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert size={28} style={{ color: 'var(--color-primary)' }} />
              Management Console
            </h1>
          </div>
          <button onClick={fetchData} className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '13px' }}>
            Sync Live Feed
          </button>
        </div>

        {/* 1. Analytics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '40px'
        }} className="grid-4">
          <div className="glass-card" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <DollarSign size={32} style={{ color: '#4ADE80' }} />
            <div>
              <span style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)' }}>Total Revenue</span>
              <strong style={{ fontSize: '22px', color: '#FFF' }}>${totalRevenue}</strong>
              <span style={{ display: 'block', fontSize: '10px', color: '#4ADE80' }}>From delivered orders</span>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <ShoppingBag size={32} style={{ color: 'var(--color-primary)' }} />
            <div>
              <span style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)' }}>Active Orders</span>
              <strong style={{ fontSize: '22px', color: '#FFF' }}>{activeOrdersCount}</strong>
              <span style={{ display: 'block', fontSize: '10px', color: 'var(--color-accent-gold)' }}>{pendingOrdersCount} pending approval</span>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Calendar size={32} style={{ color: 'var(--color-accent-gold)' }} />
            <div>
              <span style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)' }}>Reservations</span>
              <strong style={{ fontSize: '22px', color: '#FFF' }}>{totalBookings}</strong>
              <span style={{ display: 'block', fontSize: '10px', color: 'var(--color-accent-gold)' }}>{pendingBookings.length} pending approval</span>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Utensils size={32} style={{ color: 'var(--color-primary)' }} />
            <div>
              <span style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)' }}>Menu Catalog</span>
              <strong style={{ fontSize: '22px', color: '#FFF' }}>{menuItems.length}</strong>
              <span style={{ display: 'block', fontSize: '10px', color: 'var(--color-primary)' }}>{reviews.length} reviews moderated</span>
            </div>
          </div>
        </div>


        {/* 1.5 Analytics Charts Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '40px'
        }} className="grid-2">
          {/* Chart 1: Seating Zone Analytics */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', color: '#FFF', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <BarChart3 size={18} style={{ color: 'var(--color-primary)' }} />
                Seating Zone Analytics
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Reservations by Area</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '150px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {/* Indoor Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '70px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>{zoneStats.indoor}</span>
                  <div style={{
                    width: '32px',
                    height: `${getBarHeight(zoneStats.indoor)}px`,
                    background: 'linear-gradient(to top, rgba(255, 107, 53, 0.2), var(--color-primary))',
                    borderRadius: '6px 6px 0 0',
                    border: '1px solid rgba(255, 107, 53, 0.4)',
                    boxShadow: '0 0 15px rgba(255, 107, 53, 0.2)',
                    transition: 'height 0.5s ease-out',
                    minHeight: '4px'
                  }} />
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'center', whiteSpace: 'nowrap' }}>Indoor</span>
                </div>

                {/* Patio Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '70px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-accent-gold)' }}>{zoneStats.patio}</span>
                  <div style={{
                    width: '32px',
                    height: `${getBarHeight(zoneStats.patio)}px`,
                    background: 'linear-gradient(to top, rgba(212, 175, 55, 0.2), var(--color-accent-gold))',
                    borderRadius: '6px 6px 0 0',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    boxShadow: '0 0 15px rgba(212, 175, 55, 0.2)',
                    transition: 'height 0.5s ease-out',
                    minHeight: '4px'
                  }} />
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'center', whiteSpace: 'nowrap' }}>Outdoor Patio</span>
                </div>

                {/* Chef's Table Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '70px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#4ADE80' }}>{zoneStats.chef}</span>
                  <div style={{
                    width: '32px',
                    height: `${getBarHeight(zoneStats.chef)}px`,
                    background: 'linear-gradient(to top, rgba(74, 222, 128, 0.2), #4ADE80)',
                    borderRadius: '6px 6px 0 0',
                    border: '1px solid rgba(74, 222, 128, 0.4)',
                    boxShadow: '0 0 15px rgba(74, 222, 128, 0.2)',
                    transition: 'height 0.5s ease-out',
                    minHeight: '4px'
                  }} />
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'center', whiteSpace: 'nowrap' }}>Chef's Table</span>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                Distribution based on {totalBookings} active reservation slots.
              </div>
            </div>
          </div>

          {/* Chart 2: Menu Category Distribution */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', color: '#FFF', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Utensils size={18} style={{ color: 'var(--color-accent-gold)' }} />
                Menu Category Distribution
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Dishes count by Course</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'Appetizers', count: categoryStats.Appetizers, color: 'var(--color-primary)' },
                { name: 'Mains', count: categoryStats.Mains, color: 'var(--color-accent-gold)' },
                { name: 'Desserts', count: categoryStats.Desserts, color: '#A78BFA' },
                { name: 'Beverages', count: categoryStats.Beverages, color: '#3B82F6' }
              ].map((cat, idx) => {
                const pct = getPercent(cat.count);
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                      <span style={{ color: 'var(--color-text-light)', fontWeight: 500 }}>{cat.name}</span>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
                        <strong>{cat.count}</strong> items ({pct}%)
                      </span>
                    </div>
                    <div style={{
                      height: '8px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255,255,255,0.02)'
                    }}>
                      <div style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: cat.color,
                        borderRadius: '4px',
                        transition: 'width 0.5s ease-out'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. Sub-navigation tabs */}
        <div className="filter-tabs" style={{ marginBottom: '30px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {[
            { id: 'orders', name: `Orders Queue (${activeOrdersCount})` },
            { id: 'reservations', name: `Table Bookings (${pendingBookings.length} pending)` },
            { id: 'menu', name: 'Menu Editor (CRUD)' },
            { id: 'offers', name: 'Offers & Banners' },
            { id: 'reviews', name: 'Review Moderator' },
            { id: 'subscribers', name: 'Subscribers List' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`filter-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* 3. Tab contents */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>Syncing secure dashboard channels...</div>
        ) : (
          <div className="glass-card" style={{ padding: '24px', overflow: activeTab === 'orders' ? 'visible' : 'auto' }}>

            {/* TAB A: ORDERS DISPATCH QUEUE */}
            {activeTab === 'orders' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', color: '#FFF', margin: 0 }}>Orders Queue</h3>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
                      {showAllOrders ? 'Showing all order history' : `Showing active orders awaiting preparation/dispatch`}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => setShowAllOrders(!showAllOrders)} 
                      className={`btn ${showAllOrders ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '8px 16px', fontSize: '12px' }}
                    >
                      {showAllOrders ? 'Show Active Only' : 'Show All Orders'}
                    </button>
                    <button 
                      onClick={() => fetchData(true)} 
                      className="btn btn-secondary" 
                      style={{ padding: '8px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <RefreshCw size={12} /> Sync Feeds
                    </button>
                  </div>
                </div>

                {displayedOrders.length === 0 ? (
                  <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <CheckCircle size={48} style={{ color: '#4ADE80', marginBottom: '15px', strokeWidth: 1.5 }} />
                    <h4 style={{ color: '#FFF', fontSize: '18px', marginBottom: '8px' }}>Orders Dispatch Clear</h4>
                    <p style={{ fontSize: '13px' }}>No active orders in dispatch station at the moment.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px' }} className="grid-2">
                    {displayedOrders.map(o => (
                      <div key={o._id} className="glass-card" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '24px',
                        border: o.status === 'Pending' ? '1px solid rgba(251, 191, 36, 0.25)' : '1px solid rgba(255,255,255,0.06)',
                        boxShadow: o.status === 'Pending' ? '0 0 20px rgba(251,191,36,0.05)' : 'none',
                        animation: 'fadeIn 0.5s ease-out',
                        position: 'relative'
                      }}>
                        
                        {/* Status Stamp */}
                        <span style={{
                          position: 'absolute',
                          top: '24px',
                          right: '24px',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          background: o.status === 'Preparing' ? 'rgba(59, 130, 246, 0.12)' : o.status === 'Out for Delivery' ? 'rgba(167, 139, 250, 0.12)' : o.status === 'Delivered' ? 'rgba(16, 185, 129, 0.12)' : o.status === 'Cancelled' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(251, 191, 36, 0.12)',
                          color: o.status === 'Preparing' ? '#3B82F6' : o.status === 'Out for Delivery' ? '#A78BFA' : o.status === 'Delivered' ? '#10B981' : o.status === 'Cancelled' ? '#EF4444' : '#FBBF24'
                        }}>
                          {o.status}
                        </span>

                        {/* Customer & Time Info */}
                        <div style={{ marginBottom: '15px' }}>
                          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>
                            Order Ref: {o._id.substring(o._id.length - 8).toUpperCase()}
                          </span>
                          <h4 style={{ fontSize: '18px', color: '#FFF', margin: '4px 0 2px 0' }}>{o.customerName}</h4>
                          <span style={{ fontSize: '12px', color: 'var(--color-primary)' }}>
                            Placed {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Order Items list */}
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.04)',
                          borderRadius: '8px',
                          padding: '16px',
                          margin: '10px 0 20px 0',
                          flexGrow: 1
                        }}>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {o.items.map((item, idx) => (
                              <li key={idx} style={{ display: 'flex', justifyBetween: 'space-between', fontSize: '13px' }}>
                                <span style={{ color: 'var(--color-text-light)', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                  <span><strong style={{ color: 'var(--color-primary)' }}>{item.quantity}x</strong> {item.name}</span>
                                  <span style={{ color: 'var(--color-text-muted)' }}>${item.price * item.quantity}</span>
                                </span>
                              </li>
                            ))}
                          </ul>
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '10px', marginTop: '10px', fontWeight: 700, fontSize: '14px' }}>
                            <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
                            <span style={{ color: 'var(--color-accent-gold)' }}>${o.totalAmount}</span>
                          </div>
                        </div>

                        {/* Dropoff Address */}
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '25px', display: 'flex', gap: '8px' }}>
                          <Compass size={14} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <strong>Delivery Address:</strong>
                            <p style={{ margin: '2px 0 0 0', color: 'var(--color-text-light)', lineHeight: '1.4' }}>{o.deliveryAddress}</p>
                            <p style={{ margin: '2px 0 0 0', color: 'var(--color-text-muted)', fontSize: '11px' }}>Ph: {o.phone}</p>
                          </div>
                        </div>

                        {/* Dispatch Actions */}
                        <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.04)', paddingTop: '16px' }}>
                          {o.status === 'Pending' && (
                            <>
                              <button 
                                onClick={() => handleUpdateOrderStatus(o._id, 'Preparing')}
                                className="btn btn-primary"
                                style={{ flexGrow: 1, padding: '10px', fontSize: '12px' }}
                              >
                                Accept & Prepare
                              </button>
                              <button 
                                onClick={() => handleUpdateOrderStatus(o._id, 'Cancelled')}
                                className="btn btn-secondary"
                                style={{ padding: '10px 15px', color: '#F87171', border: '1px solid rgba(248,113,113,0.2)' }}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {o.status === 'Preparing' && (
                            <button 
                              onClick={() => handleUpdateOrderStatus(o._id, 'Out for Delivery')}
                              className="btn btn-primary"
                              style={{ flexGrow: 1, padding: '10px', fontSize: '12px', background: 'linear-gradient(to right, #8B5CF6, #A78BFA)', border: 'none' }}
                            >
                              Dispatch Order for Delivery
                            </button>
                          )}
                          {o.status === 'Out for Delivery' && (
                            <button 
                              onClick={() => handleUpdateOrderStatus(o._id, 'Delivered')}
                              className="btn btn-primary"
                              style={{ flexGrow: 1, padding: '10px', fontSize: '12px', background: 'linear-gradient(to right, #10B981, #34D399)', border: 'none' }}
                            >
                              Confirm Delivered
                            </button>
                          )}
                          {(o.status === 'Delivered' || o.status === 'Cancelled') && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                Order Archived
                              </span>
                              <button 
                                onClick={() => handleDeleteOrder(o._id)}
                                className="btn btn-secondary"
                                style={{ padding: '6px 12px', fontSize: '11px', color: '#F87171', border: '1px solid rgba(248,113,113,0.2)' }}
                              >
                                Delete Record
                              </button>
                            </div>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB A2: RESERVATIONS SEATING */}
            {activeTab === 'reservations' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', color: '#FFF', margin: 0 }}>Seating Bookings</h3>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
                      Review table reservation requests, seat availability, and confirmation statuses.
                    </p>
                  </div>
                  <button onClick={() => fetchData(true)} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '12px' }}>
                    Sync Reservations
                  </button>
                </div>

                {bookings.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No seating reservations recorded.
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }} className="admin-table">
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: 'var(--color-accent-gold)' }}>
                        <th style={{ padding: '12px' }}>Patron</th>
                        <th style={{ padding: '12px' }}>Time & Date</th>
                        <th style={{ padding: '12px' }}>Guests count</th>
                        <th style={{ padding: '12px' }}>Zone</th>
                        <th style={{ padding: '12px' }}>Booking Status</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => (
                        <tr key={b._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', background: b.status === 'Pending' ? 'rgba(251,191,36,0.01)' : 'transparent' }}>
                          <td style={{ padding: '12px' }}>
                            <div style={{ fontWeight: 600, color: '#FFF' }}>{b.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{b.phone} | {b.email}</div>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <div>{new Date(b.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                            <div style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 600 }}>{b.time}</div>
                          </td>
                          <td style={{ padding: '12px', fontWeight: 600 }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <Users size={14} style={{ color: 'var(--color-primary)' }} />
                              {b.guests} Guests
                            </span>
                          </td>
                          <td style={{ padding: '12px', color: 'var(--color-text-light)' }}>
                            {b.seatingArea}
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '20px',
                              fontSize: '11px',
                              fontWeight: 600,
                              background: b.status === 'Confirmed' ? 'rgba(74, 222, 128, 0.1)' : b.status === 'Cancelled' ? 'rgba(248, 113, 113, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                              color: b.status === 'Confirmed' ? '#4ADE80' : b.status === 'Cancelled' ? '#F87171' : '#FBBF24'
                            }}>
                              {b.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                              {b.status === 'Pending' ? (
                                <>
                                  <button 
                                    onClick={() => handleUpdateBookingStatus(b._id, 'Confirmed')} 
                                    title="Confirm Booking" 
                                    style={{ background: '#10B981', border: 'none', width: '28px', height: '28px', borderRadius: '4px', color: '#FFF', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                  >
                                    <Check size={14} />
                                  </button>
                                  <button 
                                    onClick={() => handleUpdateBookingStatus(b._id, 'Cancelled')} 
                                    title="Reject Reservation" 
                                    style={{ background: '#EF4444', border: 'none', width: '28px', height: '28px', borderRadius: '4px', color: '#FFF', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                  >
                                    <X size={14} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontStyle: 'italic', marginRight: '5px' }}>
                                    Resolved
                                  </span>
                                  <button 
                                    onClick={() => handleDeleteBooking(b._id)} 
                                    title="Delete Reservation" 
                                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', width: '28px', height: '28px', borderRadius: '4px', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'} 
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* TAB B: MENU MANAGER */}
            {activeTab === 'menu' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '20px', color: '#FFF' }}>Dishes catalog</h3>
                  <button onClick={() => { setEditingItem(null); setImageInputMode('upload'); setIsMenuModalOpen(true); }} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Plus size={14} /> Add Menu Item
                  </button>
                </div>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }} className="admin-table">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: 'var(--color-accent-gold)' }}>
                      <th style={{ padding: '12px' }}>Preview</th>
                      <th style={{ padding: '12px' }}>Dish Name</th>
                      <th style={{ padding: '12px' }}>Category</th>
                      <th style={{ padding: '12px' }}>Price</th>
                      <th style={{ padding: '12px' }}>Specials</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map(item => (
                      <tr key={item._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                        <td style={{ padding: '12px' }}>
                          <img src={item.imageUrl} alt={item.name} style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                        </td>
                        <td style={{ padding: '12px', fontWeight: 600, color: '#FFF' }}>{item.name}</td>
                        <td style={{ padding: '12px' }}>{item.category}</td>
                        <td style={{ padding: '12px', fontWeight: 700, color: 'var(--color-accent-gold)' }}>${item.price}</td>
                        <td style={{ padding: '12px' }}>
                          {item.isChefSpecial ? (
                            <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>Chef Special</span>
                          ) : (
                            <span style={{ color: 'var(--color-text-muted)' }}>Standard</span>
                          )}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button onClick={() => handleEditMenuClick(item)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', width: '28px', height: '28px', borderRadius: '4px', color: 'var(--color-accent-gold)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Edit3 size={14} />
                            </button>
                            <button onClick={() => handleDeleteMenuItem(item._id)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', width: '28px', height: '28px', borderRadius: '4px', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={(e) => e.target.style.color = '#EF4444'} onMouseLeave={(e) => e.target.style.color = 'var(--color-text-muted)'}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB C: OFFERS */}
            {activeTab === 'offers' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '20px', color: '#FFF' }}>Offers & Promos Banners</h3>
                  <button onClick={() => setIsOfferModalOpen(true)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Plus size={14} /> Create Offer
                  </button>
                </div>

                <div className="grid-2" style={{ gap: '20px' }}>
                  {offers.map(off => (
                    <div key={off._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', padding: '20px', borderLeft: off.isActive ? '4px solid #4ADE80' : '4px solid #EF4444' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 style={{ fontSize: '18px', color: '#FFF' }}>{off.title}</h4>
                          <button onClick={() => handleDeleteOffer(off._id)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.color = '#F87171'} onMouseLeave={(e) => e.target.style.color = 'var(--color-text-muted)'}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', margin: '10px 0' }}>{off.description}</p>
                        {off.discountCode && (
                          <div style={{ fontSize: '12px', color: '#FFF' }}>Promo Code: <strong>{off.discountCode}</strong></div>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                        <span style={{ fontSize: '12px', color: off.isActive ? '#4ADE80' : '#F87171', fontWeight: 600 }}>
                          {off.isActive ? 'Banner Active' : 'Banner Inactive'}
                        </span>
                        <button
                          onClick={() => handleToggleOffer(off._id, off.isActive)}
                          className={`btn ${off.isActive ? 'btn-secondary' : 'btn-primary'}`}
                          style={{ padding: '6px 12px', fontSize: '11px' }}
                        >
                          {off.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB D: REVIEWS MODERATION */}
            {activeTab === 'reviews' && (
              <div>
                <h3 style={{ fontSize: '20px', color: '#FFF', marginBottom: '20px' }}>Moderation Feed</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }} className="admin-table">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: 'var(--color-accent-gold)' }}>
                      <th style={{ padding: '12px' }}>Guest</th>
                      <th style={{ padding: '12px' }}>Review Comment</th>
                      <th style={{ padding: '12px' }}>Stars</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map(rev => (
                      <tr key={rev._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                        <td style={{ padding: '12px', fontWeight: 600, color: '#FFF' }}>{rev.name}</td>
                        <td style={{ padding: '12px', color: 'var(--color-text-muted)', maxWidth: '350px' }}>"{rev.comment}"</td>
                        <td style={{ padding: '12px', color: 'var(--color-accent-gold)', fontWeight: 700 }}>{rev.rating} ★</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            background: rev.isApproved ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                            color: rev.isApproved ? '#4ADE80' : '#F87171',
                            fontWeight: 600
                          }}>
                            {rev.isApproved ? 'Approved' : 'Suspended'}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              onClick={() => handleToggleReviewApproval(rev._id, rev.isApproved)}
                              className={`btn ${rev.isApproved ? 'btn-secondary' : 'btn-primary'}`}
                              style={{ padding: '6px 12px', fontSize: '11px' }}
                            >
                              {rev.isApproved ? 'Suspend' : 'Approve'}
                            </button>
                            <button onClick={() => handleDeleteReview(rev._id)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', width: '28px', height: '28px', borderRadius: '4px', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={(e) => e.target.style.color = '#EF4444'} onMouseLeave={(e) => e.target.style.color = 'var(--color-text-muted)'}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB E: SUBSCRIBERS */}
            {activeTab === 'subscribers' && (
              <div>
                <h3 style={{ fontSize: '20px', color: '#FFF', marginBottom: '20px' }}>Newsletter Inner Circle</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }} className="admin-table">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: 'var(--color-accent-gold)' }}>
                      <th style={{ padding: '12px' }}>Email Address</th>
                      <th style={{ padding: '12px' }}>Subscribed Date</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map(s => (
                      <tr key={s._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                        <td style={{ padding: '12px', fontWeight: 600, color: '#FFF' }}>{s.email}</td>
                        <td style={{ padding: '12px' }}>{new Date(s.subscribedAt).toLocaleDateString()}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <button onClick={() => handleDeleteSubscriber(s._id)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', width: '28px', height: '28px', borderRadius: '4px', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={(e) => e.target.style.color = '#EF4444'} onMouseLeave={(e) => e.target.style.color = 'var(--color-text-muted)'}>
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Add / Edit Menu Modal */}
      <GlassModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        title={editingItem ? 'Edit Dish Profile' : 'Add New Dish'}
      >
        <form onSubmit={handleMenuSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '5px' }}>Dish Name</label>
            <input
              type="text"
              name="name"
              required
              className="input-field"
              value={menuForm.name}
              onChange={(e) => setMenuForm(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '5px' }}>Price ($)</label>
              <input
                type="number"
                name="price"
                required
                className="input-field"
                value={menuForm.price}
                onChange={(e) => setMenuForm(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '5px' }}>Category</label>
              <select
                name="category"
                className="input-field"
                value={menuForm.category}
                onChange={(e) => setMenuForm(prev => ({ ...prev, category: e.target.value }))}
                style={{ appearance: 'none', cursor: 'pointer' }}
              >
                <option value="Appetizers" style={{ backgroundColor: '#141412' }}>Appetizers</option>
                <option value="Mains" style={{ backgroundColor: '#141412' }}>Mains</option>
                <option value="Desserts" style={{ backgroundColor: '#141412' }}>Desserts</option>
                <option value="Beverages" style={{ backgroundColor: '#141412' }}>Beverages</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Dish Image</label>
            
            {menuForm.imageUrl ? (
              <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)', marginBottom: '10px', background: 'rgba(0,0,0,0.2)' }}>
                <img src={menuForm.imageUrl} alt="Dish Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => setMenuForm(prev => ({ ...prev, imageUrl: '' }))}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(15, 15, 15, 0.85)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <button
                    type="button"
                    className={`filter-tab ${imageInputMode === 'upload' ? 'active' : ''}`}
                    onClick={() => setImageInputMode('upload')}
                    style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '20px', border: 'none', cursor: 'pointer' }}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    className={`filter-tab ${imageInputMode === 'url' ? 'active' : ''}`}
                    onClick={() => setImageInputMode('url')}
                    style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '20px', border: 'none', cursor: 'pointer' }}
                  >
                    Image URL
                  </button>
                </div>

                {imageInputMode === 'upload' ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed var(--glass-border)',
                      borderRadius: '8px',
                      padding: '30px 20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: 'rgba(255, 255, 255, 0.01)',
                      transition: 'var(--transition-smooth)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => { 
                      e.currentTarget.style.borderColor = 'var(--color-primary)'; 
                      e.currentTarget.style.background = 'rgba(255, 122, 0, 0.02)'; 
                    }}
                    onMouseLeave={(e) => { 
                      e.currentTarget.style.borderColor = 'var(--glass-border)'; 
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)'; 
                    }}
                  >
                    <Image size={28} style={{ color: 'var(--color-primary)' }} />
                    <div style={{ fontSize: '13px', color: '#FFF', fontWeight: 500 }}>Click to browse image file</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Supports PNG, JPG, JPEG, WEBP up to 10MB</div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    name="imageUrl"
                    required
                    className="input-field"
                    placeholder="Paste high-res image link"
                    value={menuForm.imageUrl}
                    onChange={(e) => setMenuForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                  />
                )}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '5px' }}>Allergens (Comma separated)</label>
            <input
              type="text"
              name="allergens"
              className="input-field"
              placeholder="e.g. Gluten-Free, Nuts, Vegetarian"
              value={menuForm.allergens}
              onChange={(e) => setMenuForm(prev => ({ ...prev, allergens: e.target.value }))}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '5px' }}>Description</label>
            <textarea
              name="description"
              required
              rows="3"
              className="input-field"
              value={menuForm.description}
              onChange={(e) => setMenuForm(prev => ({ ...prev, description: e.target.value }))}
              style={{ resize: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
            <input
              type="checkbox"
              id="isChefSpecial"
              checked={menuForm.isChefSpecial}
              onChange={(e) => setMenuForm(prev => ({ ...prev, isChefSpecial: e.target.checked }))}
              style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
            />
            <label htmlFor="isChefSpecial" style={{ fontSize: '13px', color: 'var(--color-text-light)', cursor: 'pointer' }}>Highlight as Chef's Special</label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            {editingItem ? 'Save Updates' : 'Add Dish'}
          </button>
        </form>
      </GlassModal>

      {/* Add Offer Modal */}
      <GlassModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        title="Create Campaign Banner"
      >
        <form onSubmit={handleOfferSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '5px' }}>Offer Title</label>
            <input
              type="text"
              required
              className="input-field"
              value={offerForm.title}
              onChange={(e) => setOfferForm(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '5px' }}>Discount Code (Optional)</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. BRUNCH50"
              value={offerForm.discountCode}
              onChange={(e) => setOfferForm(prev => ({ ...prev, discountCode: e.target.value }))}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '5px' }}>Description</label>
            <textarea
              required
              rows="3"
              className="input-field"
              value={offerForm.description}
              onChange={(e) => setOfferForm(prev => ({ ...prev, description: e.target.value }))}
              style={{ resize: 'none' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            Publish Banner
          </button>
        </form>
      </GlassModal>

    </div>
  );
};
export default AdminDashboard;
