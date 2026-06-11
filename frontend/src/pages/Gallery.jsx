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
      url: 'https://lh3.googleusercontent.com/aida/AP1WRLuIimpTFXpS8yHUX1RyqhNBaKDtDmS1rvMOW2n6nuQNWzyeTAE-odZKpCuMUZ_cieX0ro5Lv6fkv_m4UGjAKlWU4zeZK697TGj_4tj5hAa_G3ovBPqZgV4x5QkDMgxQdPzfWZd2f4NLSJXU1uTOH6Nyb86y9GAFeS8YM0AneZr0tpBmh_AcEQPIpU5532DIkG1wrN3AygHtd-l03XBCbD7Pbz9C1sEDpZBkPEKK3MxJ08VGC_i2NKypzDrj',
      height: '380px'
    },
    {
      id: 2,
      category: 'Interior',
      title: 'Luxury Main Dining Room',
      url: 'https://lh3.googleusercontent.com/aida/AP1WRLu5tg4HFBvcuCvNzJykLKF48XbfLY4H_HL1K3zjjTViSV2x_jOEoNt8Dun-hIyRAaX_rN1JJ_-frDw_NQQ7eKM8QLhzca0OWK2IrB09Gnv6ir34CGA_i7FwGuXmgQs5bSiI7kwWMF2W8-dbPUyBr-BA_wwZJXbRwgQBVoeDAV0DCH5qUd2NrsijZ-6Rc-gegGsSGD3MEyEw8dyP5NX3D8wHoVk1qihWH7Rk_tyQmedYnx8gWxH954QOtgw',
      height: '280px'
    },
    {
      id: 3,
      category: 'Food',
      title: 'Handmade Lobster Agnolotti',
      url: 'https://lh3.googleusercontent.com/aida/AP1WRLsRg_5gVHQ5c3a1wNveX9dlMZbPHjv6OLexZIr_WRs3_7apBu8L9Al5_1kDf5VQXECWEn8gmN0k-P8qwnd8EAqDDFwJzfXl7eCCHwEAoh_uXWoh1KBsuHWxrlEOwxmmthK4Sj2NLz9ezTkRfBpjlFara9PRZ-Raq0nVnFaXTWazX0Lpuy3b5aSufZXUP8_CXPDEhzuIsQOIje8s_vWWkHYACn7v7wsJcywVE4SUn2lwEWHlIUVyfci7nBtq',
      height: '420px'
    },
    {
      id: 4,
      category: 'Chef',
      title: 'Artisanal Plating Service',
      url: 'https://lh3.googleusercontent.com/aida/AP1WRLvyS5TOznW_SNp06M5Vb7jwMIBLQAVw24EXi2Zvy8dwzOW0iCqBqrYRKCfzouTuqRbVgj622FN87t57-u2xHY7gKYht7cqknuq-azBynAvoLSokQI8lxunrT8bRl1ZOxks-MrPpm-jYB7_63zFmeDCgp5-zOauzDHnFQ9tsLiX76ziV7SM2XioZQQ5sbXeXAYKPEAQCGK2D4z31j-TlQaaqd_4Hu1_l-XgY4y6d2b0EqUwJyT16Rfy0oa0',
      height: '320px'
    },
    {
      id: 5,
      category: 'Food',
      title: 'Orange Spiced Soufflé',
      url: 'https://lh3.googleusercontent.com/aida/AP1WRLv3mgwolov7v19ybw1WuOM8jUQJShyjDXlYznmdVhhs_pUMVefGrPnnFCW3Q0oWdAWPVuUxagILINVVBQehlHXfO15pxDVjh4vEiEK0hrkvE5Rh0R7vMcFOOnuzyw9XSdIEPWgU35XykbBmIJVEWAwQYJsLrxOd-odpMdenWXsyFUe183o_2U1DQ5M7RYkDgqKp4nvf1AqtZCV5oELQi2xwSz8-n_xVQzR6nGPwrWiI1HjtRE0pbo2JiWA',
      height: '350px'
    },
    {
      id: 6,
      category: 'Interior',
      title: 'Cozy Fireplace Booths',
      url: 'https://lh3.googleusercontent.com/aida/AP1WRLu5tg4HFBvcuCvNzJykLKF48XbfLY4H_HL1K3zjjTViSV2x_jOEoNt8Dun-hIyRAaX_rN1JJ_-frDw_NQQ7eKM8QLhzca0OWK2IrB09Gnv6ir34CGA_i7FwGuXmgQs5bSiI7kwWMF2W8-dbPUyBr-BA_wwZJXbRwgQBVoeDAV0DCH5qUd2NrsijZ-6Rc-gegGsSGD3MEyEw8dyP5NX3D8wHoVk1qihWH7Rk_tyQmedYnx8gWxH954QOtgw',
      height: '400px'
    },
    {
      id: 7,
      category: 'Food',
      title: 'Crispy Cherrywood Pork Belly',
      url: 'https://lh3.googleusercontent.com/aida/AP1WRLvyS5TOznW_SNp06M5Vb7jwMIBLQAVw24EXi2Zvy8dwzOW0iCqBqrYRKCfzouTuqRbVgj622FN87t57-u2xHY7gKYht7cqknuq-azBynAvoLSokQI8lxunrT8bRl1ZOxks-MrPpm-jYB7_63zFmeDCgp5-zOauzDHnFQ9tsLiX76ziV7SM2XioZQQ5sbXeXAYKPEAQCGK2D4z31j-TlQaaqd_4Hu1_l-XgY4y6d2b0EqUwJyT16Rfy0oa0',
      height: '300px'
    },
    {
      id: 8,
      category: 'Interior',
      title: 'Cocktail Bar Lounge',
      url: 'https://lh3.googleusercontent.com/aida/AP1WRLu5tg4HFBvcuCvNzJykLKF48XbfLY4H_HL1K3zjjTViSV2x_jOEoNt8Dun-hIyRAaX_rN1JJ_-frDw_NQQ7eKM8QLhzca0OWK2IrB09Gnv6ir34CGA_i7FwGuXmgQs5bSiI7kwWMF2W8-dbPUyBr-BA_wwZJXbRwgQBVoeDAV0DCH5qUd2NrsijZ-6Rc-gegGsSGD3MEyEw8dyP5NX3D8wHoVk1qihWH7Rk_tyQmedYnx8gWxH954QOtgw',
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
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'rgba(10, 10, 9, 0.7)',
                  opacity: 0,
                  transition: 'var(--transition-smooth)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px'
                }} className="gallery-overlay">
                  <Eye size={30} style={{ color: 'var(--color-primary)', marginBottom: '10px' }} />
                  <h3 style={{ fontSize: '18px', color: '#FFF', textAlign: 'center' }}>{item.title}</h3>
                  <span style={{ fontSize: '11px', color: 'var(--color-accent-gold)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
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
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '900px',
              maxHeight: '80vh',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: 'var(--glass-shadow)',
              border: '1px solid rgba(255,107,53,0.2)'
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
        .gallery-item-wrapper:hover .gallery-img {
          transform: scale(1.06);
        }
        .gallery-item-wrapper:hover .gallery-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};
export default Gallery;
