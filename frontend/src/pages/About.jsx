import React from 'react';
import { Award, ShieldCheck, Heart, Coffee } from 'lucide-react';

export const About = () => {
  return (
    <div style={{ animation: 'fadeIn 0.8s ease-out' }}>
      
      {/* Hero Banner */}
      <section style={{
        position: 'relative',
        height: '45vh',
        minHeight: '350px',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(rgba(10, 10, 9, 0.75), rgba(10, 10, 9, 0.95)), url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80") no-repeat center center/cover',
        textAlign: 'center',
        paddingTop: '80px'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 800 }}>Our Story</span>
          <h1 style={{ fontSize: 'calc(2rem + 1.5vw)', marginTop: '10px', fontFamily: 'var(--font-headline)' }}>
            The Essence of <span className="text-gradient">FlavorNest</span>
          </h1>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-dark)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '50px',
            alignItems: 'center'
          }} className="about-narrative">
            <div>
              <h2 style={{ fontSize: '32px', marginBottom: '24px', lineHeight: '1.3' }}>A Heritage of Crafting <span style={{ color: 'var(--color-primary)' }}>Memorable Tables</span></h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '18px', lineHeight: '1.8' }}>
                Established in 2018, FlavorNest was born from a singular passion: to strip dining down to its most raw, artistic elements. We envisioned a sanctuary where food is not simply consumed, but experienced as a live, sensory narrative.
              </p>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '18px', lineHeight: '1.8' }}>
                Every single item in our kitchen is chosen with absolute intent. We work exclusively with certified organic heritage farms, small-scale artisanal fishermen, and local growers who respect the seasons. This ensures that every element on your plate has a clear lineage of quality.
              </p>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
                Whether you are celebrating a romantic wedding anniversary, conducting a high-level corporate dinner, or sharing Sunday lunch with family, FlavorNest designs atmospheres and plates that elevate the occasion.
              </p>
            </div>
            
            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: 'var(--glass-shadow)',
                border: '1px solid rgba(255,107,53,0.15)',
                height: '400px'
              }}>
                <img src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80" alt="Atmospheric room" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{
                position: 'absolute',
                bottom: '-25px',
                left: '-25px',
                background: 'var(--color-primary)',
                color: '#FFF',
                padding: '20px 30px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '18px',
                boxShadow: '0 10px 25px rgba(255,107,53,0.3)',
                display: 'none' // Hidden on smaller sizes handled in styles
              }} className="narrative-badge">
                Est. 2018
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chef Profile */}
      <section className="section-padding" style={{ backgroundColor: '#0C0C0B' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: '50px',
            alignItems: 'center'
          }} className="about-chef">
            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,107,53,0.15)', height: '420px' }}>
              <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80" alt="Executive Chef Gordon Sterling plating" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            <div>
              <span style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--color-accent-gold)', fontWeight: 700 }}>Culinary Leadership</span>
              <h2 style={{ fontSize: '32px', marginTop: '8px', marginBottom: '20px', fontFamily: 'var(--font-headline)' }}>Chef de Cuisine, <span style={{ color: 'var(--color-primary)' }}>Gordon Sterling</span></h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px', lineHeight: '1.8' }}>
                With over 18 years of experience leading Michelin-starred kitchens across Paris, London, and New York, Chef Sterling brings a bold, architectural philosophy to FlavorNest. His cuisine is a marriage of French classical reduction techniques with modern gastromorphy.
              </p>
              <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', marginBottom: '24px', lineHeight: '1.8', borderLeft: '3px solid var(--color-primary)', paddingLeft: '16px' }}>
                "We do not cook to feed. We cook to provoke memory, curiosity, and comfort. A plate should tell the story of the soil it came from and the hands that prepared it."
              </p>
              <div>
                <strong style={{ color: '#FFF', display: 'block', fontSize: '16px' }}>Gordon Sterling</strong>
                <span style={{ fontSize: '12px', color: 'var(--color-primary)' }}>Executive Chef & Partner</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values & Achievements */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-dark)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Our Core <span style={{ color: 'var(--color-primary)' }}>Values</span></h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto' }}>
              These foundational pillars govern our daily prep, kitchen culture, and guest service.
            </p>
          </div>

          <div className="grid-4">
            <div className="glass-card" style={{ padding: '30px' }}>
              <Award size={36} style={{ color: 'var(--color-accent-gold)', marginBottom: '15px' }} />
              <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#FFF' }}>Artistry</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
                Every plate is composed like a canvas, balancing colors, heights, and flavors for visual delight.
              </p>
            </div>
            
            <div className="glass-card" style={{ padding: '30px' }}>
              <ShieldCheck size={36} style={{ color: 'var(--color-primary)', marginBottom: '15px' }} />
              <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#FFF' }}>Pure Sourcing</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
                Zero shortcuts. 100% traceably sourced organic vegetables and hormone-free grass-fed meats.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '30px' }}>
              <Heart size={36} style={{ color: 'var(--color-accent-gold)', marginBottom: '15px' }} />
              <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#FFF' }}>Guest Devotion</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
                Creating intimate casual care tailored to couples, corporate clients, and family celebrations.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '30px' }}>
              <Coffee size={36} style={{ color: 'var(--color-primary)', marginBottom: '15px' }} />
              <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#FFF' }}>Achievements</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
                Nominated for Culinary Excellence 2024 and recipient of the Michelin Star of Culinary Craft.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .about-narrative, .about-chef {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
          .narrative-badge {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
export default About;
