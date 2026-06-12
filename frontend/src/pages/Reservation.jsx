import React, { useState } from 'react';
import { Calendar, Users, Clock, Compass, CheckCircle } from 'lucide-react';
import GlassModal from '../components/GlassModal';
import { useToast } from '../context/ToastContext';
import { API_URL } from '../config';


export const Reservation = () => {
  const getTomorrowDateString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: getTomorrowDateString(),
    time: '',
    guests: '2',
    seatingArea: 'Indoor Main Room'
  });

  const [bookingStatus, setBookingStatus] = useState('idle'); // idle, loading, success, error
  const [confirmedData, setConfirmedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const { showToast } = useToast();
  const timeSlots = ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'];

  const seatingAreas = [
    {
      name: 'Indoor Main Room',
      description: 'Elegant ambient lights, warm dining tables.',
      img: 'https://lh3.googleusercontent.com/aida/AP1WRLu5tg4HFBvcuCvNzJykLKF48XbfLY4H_HL1K3zjjTViSV2x_jOEoNt8Dun-hIyRAaX_rN1JJ_-frDw_NQQ7eKM8QLhzca0OWK2IrB09Gnv6ir34CGA_i7FwGuXmgQs5bSiI7kwWMF2W8-dbPUyBr-BA_wwZJXbRwgQBVoeDAV0DCH5qUd2NrsijZ-6Rc-gegGsSGD3MEyEw8dyP5NX3D8wHoVk1qihWH7Rk_tyQmedYnx8gWxH954QOtgw'
    },
    {
      name: 'Outdoor Garden Patio',
      description: 'Lush greenery, romantic starlight seating.',
      img: 'https://lh3.googleusercontent.com/aida/AP1WRLuIimpTFXpS8yHUX1RyqhNBaKDtDmS1rvMOW2n6nuQNWzyeTAE-odZKpCuMUZ_cieX0ro5Lv6fkv_m4UGjAKlWU4zeZK697TGj_4tj5hAa_G3ovBPqZgV4x5QkDMgxQdPzfWZd2f4NLSJXU1uTOH6Nyb86y9GAFeS8YM0AneZr0tpBmh_AcEQPIpU5532DIkG1wrN3AygHtd-l03XBCbD7Pbz9C1sEDpZBkPEKK3MxJ08VGC_i2NKypzDrj'
    },
    {
      name: 'Chef\'s Table',
      description: 'Front row seats to live plating, complimentary bubbly.',
      img: 'https://lh3.googleusercontent.com/aida/AP1WRLvyS5TOznW_SNp06M5Vb7jwMIBLQAVw24EXi2Zvy8dwzOW0iCqBqrYRKCfzouTuqRbVgj622FN87t57-u2xHY7gKYht7cqknuq-azBynAvoLSokQI8lxunrT8bRl1ZOxks-MrPpm-jYB7_63zFmeDCgp5-zOauzDHnFQ9tsLiX76ziV7SM2XioZQQ5sbXeXAYKPEAQCGK2D4z31j-TlQaaqd_4Hu1_l-XgY4y6d2b0EqUwJyT16Rfy0oa0'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectTime = (time) => {
    setFormData(prev => ({ ...prev, time }));
  };

  const selectSeating = (area) => {
    setFormData(prev => ({ ...prev, seatingArea: area }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.time) {
      setErrorMessage('Please choose a dining time slot.');
      showToast('Please select a dining time slot.', 'error');
      return;
    }
    setErrorMessage('');
    setBookingStatus('loading');

    try {
      const response = await fetch(`${API_URL}/reservations`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setConfirmedData(data);
        setBookingStatus('success');
        showToast('Table reservation request sent successfully!', 'success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          guests: '2',
          seatingArea: 'Indoor Main Room'
        });
      } else {
        setBookingStatus('error');
        const err = data.message || 'Seating reservation failed. Try another time or date.';
        setErrorMessage(err);
        showToast(err, 'error');
      }
    } catch (error) {
      setBookingStatus('error');
      setErrorMessage('Network connection error. Please try again.');
      showToast('Connection error. Please try again.', 'error');
    }
  };

  return (
    <div className="section-padding" style={{ animation: 'fadeIn 0.8s ease-out', paddingTop: '140px' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 800 }}>Online Reservations</span>
          <h1 style={{ fontSize: 'calc(2rem + 1.5vw)', marginTop: '8px', marginBottom: '16px', fontFamily: 'var(--font-headline)' }}>
            Book a <span className="text-gradient">Table</span>
          </h1>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Secure your culinary table preference at FlavorNest. Special dining spaces are subject to seating caps.
          </p>
        </div>

        {/* Main Grid: Form Left, Area Select Right */}
        <form onSubmit={handleSubmit} style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '40px',
          alignItems: 'start'
        }} className="reservation-grid">
          
          {/* Inputs Panel */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,107,53,0.1)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '20px', margin: 0 }}>Dinner Details</h3>
              <span style={{ fontSize: '11px', color: 'var(--color-primary)', background: 'rgba(255, 107, 53, 0.12)', padding: '4px 10px', borderRadius: '20px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                🔥 3 tables left
              </span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="grid-2-form">
              <div>
                <label htmlFor="res-name" style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Your Name</label>
                <input
                  type="text"
                  name="name"
                  id="res-name"
                  required
                  placeholder="Enter full name"
                  className="input-field"
                  value={formData.name}
                  onChange={handleInputChange}
                  aria-required="true"
                />
              </div>
              
              <div>
                <label htmlFor="res-phone" style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  id="res-phone"
                  required
                  placeholder="Enter phone number"
                  className="input-field"
                  value={formData.phone}
                  onChange={handleInputChange}
                  aria-required="true"
                />
              </div>
            </div>

            <div>
              <label htmlFor="res-email" style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Email Address</label>
              <input
                type="email"
                name="email"
                id="res-email"
                required
                placeholder="Enter email address"
                className="input-field"
                value={formData.email}
                onChange={handleInputChange}
                aria-required="true"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }} className="grid-2-form">
              <div>
                <label htmlFor="res-date" style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Choose Date</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="date"
                    name="date"
                    id="res-date"
                    required
                    className="input-field"
                    value={formData.date}
                    onChange={handleInputChange}
                    style={{ paddingLeft: '40px' }}
                    min={new Date().toISOString().split('T')[0]}
                    aria-required="true"
                  />
                  <Calendar size={16} style={{ position: 'absolute', left: '14px', top: '16px', color: 'var(--color-primary)' }} aria-hidden="true" />
                </div>
              </div>

              <div>
                <label htmlFor="res-guests" style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Guests</label>
                <div style={{ position: 'relative' }}>
                  <select
                    name="guests"
                    id="res-guests"
                    className="input-field"
                    value={formData.guests}
                    onChange={handleInputChange}
                    style={{ paddingLeft: '40px', appearance: 'none', cursor: 'pointer' }}
                    aria-required="true"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1} style={{ backgroundColor: '#141412' }}>{i + 1} Guest{i > 0 ? 's' : ''}</option>
                    ))}
                    <option value="12" style={{ backgroundColor: '#141412' }}>10+ Guests (Group Event)</option>
                  </select>
                  <Users size={16} style={{ position: 'absolute', left: '14px', top: '16px', color: 'var(--color-primary)' }} aria-hidden="true" />
                </div>
                {/* Fast Guest Quick Select */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                  {['2', '4', '6', '8'].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, guests: num }))}
                      style={{
                        padding: '4px 10px',
                        fontSize: '11px',
                        borderRadius: '20px',
                        border: formData.guests === num ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.08)',
                        background: formData.guests === num ? 'rgba(255, 107, 53, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: formData.guests === num ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        transition: 'var(--transition-smooth)'
                      }}
                      aria-label={`${num} guests shortcut`}
                    >
                      {num} Pax
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Time Slot Picker */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
                  <span>Select Preferred Seating Time</span>
                </span>
              </label>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '10px'
              }} className="time-slots-grid">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => selectTime(slot)}
                    style={{
                      padding: '10px',
                      background: formData.time === slot ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.02)',
                      border: formData.time === slot ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '6px',
                      color: formData.time === slot ? '#FFF' : 'var(--color-text-light)',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'var(--transition-smooth)'
                    }}
                    aria-pressed={formData.time === slot}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {errorMessage && (
              <div style={{ color: '#F87171', fontSize: '14px', background: 'rgba(248,113,113,0.1)', padding: '12px', borderRadius: '6px' }} role="alert">
                {errorMessage}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '16px' }}
                disabled={bookingStatus === 'loading'}
              >
                {bookingStatus === 'loading' ? 'Verifying table availability...' : 'Confirm Reservation Request'}
              </button>
              {/* Trust Guarantees */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '12px', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                <span>✓ Instant Confirmation</span>
                <span>✓ Zero Deposit Required</span>
                <span>✓ 100% Flexible</span>
              </div>
            </div>
          </div>

          {/* Seating Preference Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={20} style={{ color: 'var(--color-accent-gold)' }} />
              <span>Select Seating Zone</span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {seatingAreas.map((area) => (
                <div
                  key={area.name}
                  onClick={() => selectSeating(area.name)}
                  style={{
                    display: 'flex',
                    gap: '15px',
                    padding: '12px',
                    background: formData.seatingArea === area.name ? 'rgba(255, 107, 53, 0.05)' : 'var(--glass-bg)',
                    border: formData.seatingArea === area.name ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    alignItems: 'center',
                    transition: 'var(--transition-smooth)'
                  }}
                  className="seating-option-card"
                >
                  <div style={{ width: '100px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={area.img} alt={area.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', color: formData.seatingArea === area.name ? 'var(--color-primary)' : '#FFF' }}>{area.name}</h4>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '12px', marginTop: '2px', lineHeight: '1.4' }}>{area.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Policies */}
            <div className="glass-card" style={{ background: '#0F0F0E', padding: '24px', border: '1px solid rgba(212,175,55,0.1)' }}>
              <h4 style={{ fontSize: '15px', color: 'var(--color-accent-gold)', marginBottom: '8px', fontWeight: 600 }}>FlavorNest Seating Rules</h4>
              <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                <li>Seating areas are held for maximum 15 minutes past booking time.</li>
                <li><strong>Dress Code</strong>: Smart elegant casual (no sportswear).</li>
                <li>For tables larger than 10, contact our events team at events@flavornest.com.</li>
              </ul>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(212,175,55,0.04)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.12)', marginTop: '16px' }}>
                <span style={{ color: 'var(--color-accent-gold)', fontSize: '18px', lineHeight: 1 }}>★</span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontStyle: 'italic', lineHeight: '1.4' }}>
                  "The Outdoor Garden seating was completely magical. Flawless service!" - TripAdvisor
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <GlassModal
        isOpen={bookingStatus === 'success'}
        onClose={() => setBookingStatus('idle')}
        title="Reservation Confirmed"
      >
        {confirmedData && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <CheckCircle size={52} style={{ color: '#4ADE80' }} />
            <h4 style={{ fontSize: '20px', color: '#FFF', marginTop: '10px' }}>Your table has been requested!</h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
              Thank you, <strong style={{ color: '#FFF' }}>{confirmedData.name}</strong>. A confirmation email has been forwarded to <strong style={{ color: '#FFF' }}>{confirmedData.email}</strong>.
            </p>
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
              padding: '16px',
              width: '100%',
              textAlign: 'left',
              marginTop: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '14px'
            }}>
              <div><strong>Dining Space</strong>: {confirmedData.seatingArea}</div>
              <div><strong>Guests</strong>: {confirmedData.guests} Person(s)</div>
              <div><strong>Date</strong>: {new Date(confirmedData.date).toLocaleDateString()}</div>
              <div><strong>Time</strong>: {confirmedData.time}</div>
              <div><strong>Booking Reference</strong>: {confirmedData._id}</div>
            </div>
            <button
              onClick={() => setBookingStatus('idle')}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '20px' }}
            >
              Close Summary
            </button>
          </div>
        )}
      </GlassModal>

      <style>{`
        @media (max-width: 992px) {
          .reservation-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
        }
        @media (max-width: 500px) {
          .grid-2-form {
            grid-template-columns: 1fr !important;
            gap: 15px !important;
          }
          .time-slots-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};
export default Reservation;
