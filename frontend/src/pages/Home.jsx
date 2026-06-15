import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, Calendar, ShieldCheck, Tag } from 'lucide-react';
import { API_URL } from '../config';

export const Home = () => {
  const [featuredDishes, setFeaturedDishes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loadingDishes, setLoadingDishes] = useState(true);

  useEffect(() => {
    // Fetch featured/chef special dishes
    fetch(`${API_URL}/menu`)
      .then(res => res.json())
      .then(data => {
        const specials = data.filter(item => item.isChefSpecial).slice(0, 3);
        setFeaturedDishes(specials.length ? specials : data.slice(0, 3));
        setLoadingDishes(false);
      })
      .catch(() => setLoadingDishes(false));

    // Fetch approved reviews for testimonial section
    fetch(`${API_URL}/reviews?approvedOnly=true`)
      .then(res => res.json())
      .then(data => {
        setReviews(data.slice(0, 3));
      })
      .catch(err => console.log('Reviews fetch err', err));

    // Fetch offers
    fetch(`${API_URL}/offers?activeOnly=true`)

      .then(res => res.json())
      .then(data => {
        setOffers(data.slice(0, 2));
      })
      .catch(err => console.log('Offers fetch err', err));
  }, []);

  return (
    <div style={{ animation: 'fadeIn 1s ease-out' }}>
      
      {/* 1. Hero Section */}
      <section style={{
        position: 'relative',
        height: '100vh',
        minHeight: '700px',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(rgba(10, 10, 9, 0.6), rgba(10, 10, 9, 0.9)), url("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80") no-repeat center center/cover',
        textAlign: 'center',
        paddingTop: '80px'
      }}>
        <div className="container animate-slide" style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '5px',
            color: 'var(--color-primary)',
            fontWeight: 800,
            marginBottom: '20px',
            display: 'inline-block'
          }}>
            Welcome to FlavorNest
          </span>
          <h1 style={{
            fontSize: 'calc(2.5rem + 2vw)',
            lineHeight: 1.2,
            marginBottom: '24px',
            fontFamily: 'var(--font-headline)'
          }}>
            Culinary <span className="text-gradient">Artistry</span> In Every Dish
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'var(--color-text-muted)',
            marginBottom: '40px',
            maxWidth: '600px',
            lineHeight: 1.6
          }}>
            Savor premium, organic dining experiences meticulously crafted by award-winning chefs in an atmospheric sanctuary of taste.
          </p>
          <div style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <Link to="/reservation" className="btn btn-primary">
              Reserve Seating <Calendar size={18} />
            </Link>
            <Link to="/menu" className="btn btn-secondary">
              Explore Menu <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Brand Core / USP Section */}
      <section className="section-padding" style={{ backgroundColor: '#0C0C0B' }}>
        <div className="container">
          <div className="grid-3">
            <div className="glass-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
              <Clock size={40} style={{ color: 'var(--color-primary)', marginBottom: '20px' }} />
              <h3 style={{ marginBottom: '15px', fontSize: '20px' }}>Premium Dining</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                Slow-roasted and precisely crafted dishes served hot, respecting authentic flavors and chef techniques.
              </p>
            </div>
            <div className="glass-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
              <ShieldCheck size={40} style={{ color: 'var(--color-accent-gold)', marginBottom: '20px' }} />
              <h3 style={{ marginBottom: '15px', fontSize: '20px' }}>Organic Sources</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                We partner with direct family farms to source certified premium organic meats, herbs, and fresh vegetables daily.
              </p>
            </div>
            <div className="glass-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
              <Star size={40} style={{ color: 'var(--color-primary)', marginBottom: '20px' }} />
              <h3 style={{ marginBottom: '15px', fontSize: '20px' }}>High Hospitality</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                An elegant casual environment designed for couples, corporate diners, and families to celebrate milestones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Dishes / Carousel Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-dark)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Chef's Signature <span style={{ color: 'var(--color-primary)' }}>Creations</span></h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              A handpicked selection of our guest favorites, illustrating meticulous presentation and luxury flavoring.
            </p>
          </div>

          {loadingDishes ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>Loading culinary specials...</div>
          ) : (
            <div className="grid-3">
              {featuredDishes.map((dish) => (
                <div key={dish._id} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      loading="lazy"
                      decoding="async"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-smooth)' }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      background: 'rgba(10, 10, 9, 0.85)',
                      padding: '6px 12px',
                      borderRadius: '30px',
                      color: 'var(--color-accent-gold)',
                      fontWeight: 700,
                      fontSize: '14px',
                      border: '1px solid rgba(212, 175, 55, 0.3)'
                    }}>
                      ${dish.price}
                    </div>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#FFF' }}>{dish.name}</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '15px', minHeight: '66px' }}>
                      {dish.description}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {dish.allergens.map((tag, i) => (
                        <span key={i} style={{
                          fontSize: '11px',
                          background: 'rgba(255, 107, 53, 0.1)',
                          color: 'var(--color-primary)',
                          padding: '3px 8px',
                          borderRadius: '20px',
                          fontWeight: 600
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Link to="/menu" className="btn btn-gold">
              View Complete Menu
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Special Offers Banner */}
      {offers.length > 0 && (
        <section className="section-padding" style={{
          background: 'linear-gradient(rgba(10, 10, 9, 0.85), rgba(10, 10, 9, 0.85)), url("https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80") no-repeat center center/cover',
          borderTop: '1px solid rgba(255, 107, 53, 0.1)',
          borderBottom: '1px solid rgba(255, 107, 53, 0.1)'
        }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--color-accent-gold)', fontWeight: 700 }}>Exclusive Privileges</span>
              <h2 style={{ fontSize: '32px', marginTop: '8px' }}>Special Culinary Occasions</h2>
            </div>
            
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {offers.map(offer => (
                <div key={offer._id} className="glass-card" style={{
                  maxWidth: '500px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderLeft: '4px solid var(--color-primary)'
                }}>
                  <div>
                    <h3 style={{ fontSize: '20px', color: '#FFF', marginBottom: '10px' }}>{offer.title}</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '20px' }}>
                      {offer.description}
                    </p>
                  </div>
                  {offer.discountCode && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Tag size={16} style={{ color: 'var(--color-primary)' }} />
                      <span style={{ fontSize: '13px', color: '#FFF' }}>Use Code: <strong>{offer.discountCode}</strong> on booking</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Customer Testimonials */}
      <section className="section-padding" style={{ backgroundColor: '#0C0C0B' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Patron <span style={{ color: 'var(--color-primary)' }}>Testimonials</span></h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Read reviews and experiences shared by our valued guests who hosted couple dinners, corporate dinners, or family events.
            </p>
          </div>

          <div className="grid-3">
            {reviews.map((rev) => (
              <div key={rev._id} className="testimonial-card">
                <div style={{ display: 'flex', gap: '4px', marginBottom: '15px' }}>
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={16} fill={idx < rev.rating ? 'var(--color-accent-gold)' : 'none'} stroke={idx < rev.rating ? 'var(--color-accent-gold)' : 'rgba(255,255,255,0.2)'} />
                  ))}
                </div>
                <p style={{ fontStyle: 'italic', fontSize: '14px', color: 'var(--color-text-light)', marginBottom: '20px', lineHeight: '1.7' }}>
                  "{rev.comment}"
                </p>
                <div>
                  <h4 style={{ fontSize: '15px', color: '#FFF', fontWeight: 600 }}>{rev.name}</h4>
                  <span style={{ fontSize: '11px', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Verified Patron</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Gallery Preview Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-dark)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Sanctuary of <span style={{ color: 'var(--color-primary)' }}>Taste</span></h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              A preview inside our luxury kitchens and atmospheric seating spaces.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginBottom: '40px'
          }} className="home-gallery-preview">
            <div style={{ height: '220px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" alt="Interior 1" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ height: '220px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80" alt="Wagyu" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ height: '220px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80" alt="Kitchen plating" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ height: '220px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80" alt="Souffle" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <Link to="/gallery" className="btn btn-secondary">
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 992px) {
          .home-gallery-preview {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 576px) {
          .home-gallery-preview {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
export default Home;
