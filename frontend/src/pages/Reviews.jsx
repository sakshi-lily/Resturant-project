import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Plus, CheckCircle } from 'lucide-react';
import GlassModal from '../components/GlassModal';
import { API_URL } from '../config';


export const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [reviewForm, setReviewForm] = useState({
    name: '',
    rating: '5',
    comment: '',
    imageUrl: ''
  });
  
  const [formStatus, setFormStatus] = useState('idle'); // idle, loading, success, error

  const fetchReviews = () => {
    fetch(`${API_URL}/reviews?approvedOnly=true`)

      .then(res => res.json())
      .then(data => {
        setReviews(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setFormStatus('loading');
    
    try {
      const response = await fetch(`${API_URL}/reviews`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewForm),
      });

      if (response.ok) {
        setFormStatus('success');
        setReviewForm({
          name: '',
          rating: '5',
          comment: '',
          imageUrl: ''
        });
        // Reload reviews list
        fetchReviews();
        // Close modal after a short delay
        setTimeout(() => {
          setIsModalOpen(false);
          setFormStatus('idle');
        }, 2000);
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus('error');
    }
  };

  // Calculations for average star ratings
  const totalReviewsCount = reviews.length;
  const averageRating = totalReviewsCount > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviewsCount).toFixed(1)
    : '5.0';

  const ratingsDistribution = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length;
    const percentage = totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0;
    return { star, count, percentage };
  });

  return (
    <div className="section-padding" style={{ animation: 'fadeIn 0.8s ease-out', paddingTop: '140px' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 800 }}>Patron Feedback</span>
          <h1 style={{ fontSize: 'calc(2rem + 1.5vw)', marginTop: '8px', marginBottom: '16px', fontFamily: 'var(--font-headline)' }}>
            Reviews & <span className="text-gradient">Testimonials</span>
          </h1>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            We take immense pride in creating memorable occasions. Read opinions from our verified guests.
          </p>
        </div>

        {/* Analytics & Summary Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr',
          gap: '40px',
          marginBottom: '60px',
          alignItems: 'center'
        }} className="reviews-summary-grid">
          
          {/* Average Display */}
          <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
            <h3 style={{ fontSize: '64px', color: 'var(--color-primary)', fontFamily: 'var(--font-headline)', marginBottom: '5px' }}>{averageRating}</h3>
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '10px' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill={i < Math.round(Number(averageRating)) ? 'var(--color-accent-gold)' : 'none'} stroke={i < Math.round(Number(averageRating)) ? 'var(--color-accent-gold)' : 'rgba(255,255,255,0.2)'} />
              ))}
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '24px' }}>
              Average score based on {totalReviewsCount} guest reviews.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus size={16} /> Share Your Experience
            </button>
          </div>

          {/* Bar Chart distribution */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h4 style={{ fontSize: '18px', color: '#FFF', fontWeight: 600 }}>Rating Distribution</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {ratingsDistribution.map(dist => (
                <div key={dist.star} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                  <span style={{ width: '40px', color: 'var(--color-text-muted)', fontWeight: 600 }}>{dist.star} Stars</span>
                  <div style={{
                    flexGrow: 1,
                    height: '8px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <div style={{
                      width: `${dist.percentage}%`,
                      height: '100%',
                      background: 'var(--color-primary)',
                      borderRadius: '4px'
                    }}></div>
                  </div>
                  <span style={{ width: '30px', color: '#FFF', textAlign: 'right', fontWeight: 600 }}>{dist.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading guest feedback portal...</div>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '40px' }}>
            No reviews published yet. Be the first to share your dining review!
          </div>
        ) : (
          <div className="masonry-grid">
            {reviews.map(rev => (
              <div key={rev._id} className="masonry-item testimonial-card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill={i < rev.rating ? 'var(--color-accent-gold)' : 'none'} stroke={i < rev.rating ? 'var(--color-accent-gold)' : 'rgba(255,255,255,0.2)'} />
                  ))}
                </div>
                <p style={{ fontStyle: 'italic', fontSize: '14px', lineHeight: '1.7', color: 'var(--color-text-light)', marginBottom: '15px' }}>
                  "{rev.comment}"
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', color: '#FFF', fontWeight: 600 }}>{rev.name}</h4>
                    <span style={{ fontSize: '10px', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Verified Patron
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Share Review Modal */}
      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Share Your FlavorNest Experience"
      >
        {formStatus === 'success' ? (
          <div style={{ textAlign: 'center', padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <CheckCircle size={48} style={{ color: '#4ADE80' }} />
            <h4 style={{ color: '#FFF', fontSize: '18px' }}>Review Submitted</h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Thank you! Your feedback has been submitted for moderation.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label htmlFor="rev-name" style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Your Name</label>
              <input
                type="text"
                name="name"
                id="rev-name"
                required
                className="input-field"
                placeholder="Enter your name"
                value={reviewForm.name}
                onChange={handleInputChange}
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="rev-rating" style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Star Rating</label>
              <select
                name="rating"
                id="rev-rating"
                className="input-field"
                value={reviewForm.rating}
                onChange={handleInputChange}
                style={{ appearance: 'none', cursor: 'pointer' }}
                aria-required="true"
              >
                <option value="5" style={{ backgroundColor: '#141412' }}>5 Stars - Meticulous & Perfect</option>
                <option value="4" style={{ backgroundColor: '#141412' }}>4 Stars - Highly Satisfying</option>
                <option value="3" style={{ backgroundColor: '#141412' }}>3 Stars - Average Dining</option>
                <option value="2" style={{ backgroundColor: '#141412' }}>2 Stars - Needs Improvement</option>
                <option value="1" style={{ backgroundColor: '#141412' }}>1 Star - Disappointing Experience</option>
              </select>
            </div>

            <div>
              <label htmlFor="rev-comment" style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Comments / Review</label>
              <textarea
                name="comment"
                id="rev-comment"
                required
                rows="4"
                className="input-field"
                placeholder="Describe your dining experience, seared food dishes, or service..."
                value={reviewForm.comment}
                onChange={handleInputChange}
                style={{ resize: 'none' }}
                aria-required="true"
              />
            </div>

            {formStatus === 'error' && (
              <div style={{ color: '#F87171', fontSize: '13px', textAlign: 'center' }} role="alert">
                Review submission failed. Please try again.
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '10px' }}
              disabled={formStatus === 'loading'}
            >
              {formStatus === 'loading' ? 'Publishing experience...' : 'Publish Experience'}
            </button>
          </form>
        )}
      </GlassModal>

      <style>{`
        @media (max-width: 768px) {
          .reviews-summary-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </div>
  );
};
export default Reviews;
