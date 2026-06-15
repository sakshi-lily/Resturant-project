import React, { useState, useEffect } from 'react';
import { Search, Flame, Sparkles, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { API_URL } from '../config';
import { useCart } from '../context/CartContext';



export const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const { showToast } = useToast();
  const { addToCart } = useCart();
  const categories = ['All', 'Appetizers', 'Mains', 'Desserts', 'Beverages'];


  useEffect(() => {
    fetch(`${API_URL}/menu`)

      .then((res) => res.json())
      .then((data) => {
        setMenuItems(data);
        setFilteredItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch menu items', err);
        showToast('Could not load menu items. Operating in offline fallback.', 'error');
        setLoading(false);
      });
  }, [showToast]);

  // Handle live filtering when category or search changes
  useEffect(() => {
    let result = menuItems;

    if (activeCategory !== 'All') {
      result = result.filter((item) => item.category === activeCategory);
    }

    if (searchQuery.trim() !== '') {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(result);
    setCurrentPage(1); // Reset page on filter
  }, [activeCategory, searchQuery, menuItems]);

  const popularItems = menuItems.filter((item) => item.isChefSpecial);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: document.querySelector('.menu-controls').offsetTop - 100,
      behavior: 'smooth'
    });
  };

  return (
    <div className="section-padding" style={{ animation: 'fadeIn 0.8s ease-out', paddingTop: '140px' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 800 }}>Explore Flavors</span>
          <h1 style={{ fontSize: 'calc(2rem + 1.5vw)', marginTop: '8px', marginBottom: '16px', fontFamily: 'var(--font-headline)' }}>
            The <span className="text-gradient">Menu</span>
          </h1>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            A symphony of organic components, culinary expertise, and fine presentations.
          </p>
        </div>

        {/* Popular Dishes Highlight */}
        {popularItems.length > 0 && searchQuery === '' && activeCategory === 'All' && (
          <div style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={20} style={{ color: 'var(--color-primary)' }} />
              <span>Chef's <span style={{ color: 'var(--color-primary)' }}>Popular Selection</span></span>
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '30px'
            }} className="popular-grid">
              {popularItems.slice(0, 2).map((item) => (
                <div key={item._id} className="glass-card" style={{
                  display: 'flex',
                  gap: '20px',
                  padding: '20px',
                  alignItems: 'center'
                }} className="popular-card">
                  <div style={{ width: '150px', height: '150px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={item.imageUrl} alt={item.name} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '18px', color: '#FFF' }}>{item.name}</h3>
                      <span style={{ color: 'var(--color-accent-gold)', fontWeight: 700 }}>${item.price}</span>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '12px', lineHeight: '1.5' }}>
                      {item.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px',
                        background: 'rgba(212, 175, 55, 0.1)',
                        color: 'var(--color-accent-gold)',
                        padding: '3px 8px',
                        borderRadius: '20px',
                        fontWeight: 600
                      }}>
                        <Sparkles size={10} />
                        Chef Special
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="btn btn-primary"
                        style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px' }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Filters & Search Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          marginBottom: '40px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          paddingBottom: '24px'
        }} className="menu-controls">
          
          {/* Categories */}
          <div className="filter-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '280px' }} className="search-box">
            <input
              type="text"
              placeholder="Search dishes..."
              className="input-field"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '45px', paddingRight: '15px', height: '46px' }}
            />
            <Search size={18} style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)'
            }} />
          </div>
        </div>

        {/* Menu Content */}
        {loading ? (
          /* Premium Loading State */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '20px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '15px', fontWeight: 500 }}>Syncing the FlavorNest culinary catalog...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          /* Premium Empty State */
          <div className="glass-card" style={{ textAlign: 'center', padding: '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <Inbox size={48} style={{ color: 'var(--color-primary)', opacity: 0.8 }} />
            <div>
              <h3 style={{ fontSize: '20px', color: '#FFF', marginBottom: '8px' }}>No Dishes Found</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
                We couldn't locate any menu items matching "<strong>{searchQuery}</strong>". Try clearing your search query or selecting a different category.
              </p>
            </div>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="btn btn-secondary"
              style={{ fontSize: '13px', padding: '10px 20px' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid-3">
              {currentItems.map((item) => (
                <div key={item._id} className="glass-card animate-slide" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ height: '230px', overflow: 'hidden', position: 'relative' }}>
                    <img src={item.imageUrl} alt={item.name} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      background: 'rgba(10, 10, 9, 0.9)',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      color: 'var(--color-accent-gold)',
                      fontWeight: 700,
                      fontSize: '14px',
                      border: '1px solid rgba(212, 175, 55, 0.2)'
                    }}>
                      ${item.price}
                    </div>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '19px', marginBottom: '8px', color: '#FFF' }}>{item.name}</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '16px', minHeight: '60px', lineHeight: '1.6' }}>
                      {item.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {item.allergens && item.allergens.slice(0, 2).map((alg, index) => (
                          <span key={index} style={{
                            fontSize: '10px',
                            background: 'rgba(255, 107, 53, 0.08)',
                            color: 'var(--color-primary)',
                            padding: '3px 8px',
                            borderRadius: '20px',
                            fontWeight: 600
                          }}>
                            {alg}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => addToCart(item)}
                        className="btn btn-primary"
                        style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px' }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>


            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '15px',
                marginTop: '50px'
              }}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '8px',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: currentPage === 1 ? 'var(--color-text-muted)' : '#FFF',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      style={{
                        background: currentPage === i + 1 ? 'var(--color-primary)' : 'rgba(255,255,255,0.02)',
                        border: currentPage === i + 1 ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '8px',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFF',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'var(--transition-smooth)'
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '8px',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: currentPage === totalPages ? 'var(--color-text-muted)' : '#FFF',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .popular-grid {
            grid-template-columns: 1fr !important;
          }
          .popular-card {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .popular-card div:first-child {
            width: 100% !important;
            height: 200px !important;
          }
          .menu-controls {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .search-box {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};
export default Menu;
