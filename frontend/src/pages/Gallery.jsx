import React, { useState } from 'react';
import { Eye, X } from 'lucide-react';

export const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedImg, setSelectedImg] = useState(null);

  const galleryItems = [
    {
      id: 1,
      category: 'Food',
      title: 'Wagyu Ribeye Steak',
      url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      height: '380px'
    },
    {
      id: 2,
      category: 'Interior',
      title: 'Luxury Main Dining Room',
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      height: '280px'
    },
    {
      id: 3,
      category: 'Food',
      title: 'Handmade Lobster Agnolotti',
      url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
      height: '420px'
    },
    {
      id: 4,
      category: 'Chef',
      title: 'Artisanal Plating Service',
      url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80',
      height: '320px'
    },
    {
      id: 5,
      category: 'Food',
      title: 'Orange Spiced Soufflé',
      url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
      height: '350px'
    },
    {
      id: 6,
      category: 'Interior',
      title: 'Cozy Fireplace Booths',
      url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
      height: '400px'
    },
    {
      id: 7,
      category: 'Food',
      title: 'Crispy Cherrywood Pork Belly',
      url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
      height: '300px'
    },
    {
      id: 8,
      category: 'Interior',
      title: 'Cocktail Bar Lounge',
      url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
      height: '360px'
    }
  ];

  const filteredItems = activeFilter === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <div className="section-padding" style={{ animation: 'fadeIn 0.8s ease-out', paddingTop: '140px' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 800 }}>Visual Showcase</span>
          <h1 style={{ fontSize: 'calc(2rem + 1.5vw)', marginTop: '8px', marginBottom: '16px', fontFamily: 'var(--font-headline)' }}>
            The <span className="text-gradient">Gallery</span>
          </h1>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            A visual glance inside our dining halls, bar counters, and seared food creations.
          </p>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '40px',
          flexWrap: 'wrap'
        }}>
          {['All', 'Food', 'Interior', 'Chef'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="masonry-grid">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="masonry-item"
              onClick={() => setSelectedImg(item)}
              style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden', borderRadius: '12px' }}
            >
              <div style={{
                position: 'relative',
                height: item.height,
                width: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.05)'
              }} className="gallery-item-wrapper">
                
                <img
                  src={item.url}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'var(--transition-smooth)'
                  }}
                  className="gallery-img"
                />
                
                {/* Hover overlay */}
                <div style={{
                  position: 'absolute',
                  inset: '12px',
                  background: 'rgba(10, 10, 9, 0.82)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: '8px',
                  opacity: 0,
                  transition: 'var(--transition-smooth)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  boxShadow: 'inset 0 0 15px rgba(0,0,0,0.6)'
                }} className="gallery-overlay">
                  <Eye size={26} style={{ color: 'var(--color-accent-gold)', marginBottom: '8px' }} />
                  <h3 style={{ fontSize: '16px', color: '#FFF', textAlign: 'center', fontFamily: 'var(--font-headline)' }} className="overlay-title">{item.title}</h3>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '6px' }}>
                    {item.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImg && (
        <div
          onClick={() => setSelectedImg(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(5, 5, 4, 0.95)',
            backdropFilter: 'blur(10px)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '900px',
              maxHeight: '80vh',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: 'var(--glass-shadow)',
              border: '1px solid rgba(255, 215, 0, 0.2)'
            }}
          >
            <button
              onClick={() => setSelectedImg(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(10, 10, 9, 0.8)',
                border: 'none',
                color: '#FFF',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={20} />
            </button>
            <img
              src={selectedImg.url}
              alt={selectedImg.title}
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                display: 'block'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              background: 'linear-gradient(transparent, rgba(10, 10, 9, 0.9))',
              padding: '30px 24px 20px 24px',
              color: '#FFF'
            }}>
              <h3 style={{ fontSize: '20px' }}>{selectedImg.title}</h3>
              <span style={{ fontSize: '12px', color: 'var(--color-primary)' }}>Category: {selectedImg.category}</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes zoomIn {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .lightbox-content {
          animation: zoomIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .gallery-item-wrapper:hover .gallery-img {
          transform: scale(1.06);
        }
        .gallery-item-wrapper:hover .gallery-overlay {
          opacity: 1 !important;
        }
        .overlay-title {
          transform: translateY(12px);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .gallery-item-wrapper:hover .overlay-title {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};
export default Gallery;
