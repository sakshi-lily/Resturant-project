import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { useToast } from '../context/ToastContext';

export const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart
  } = useCart();

  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Cart, 2: Checkout, 3: Success
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || prev.phone,
        address: user.address || prev.address
      }));
    }
  }, [user, step]);
  const [orderId, setOrderId] = useState('');
  const { showToast } = useToast();

  if (!isCartOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderPayload = {
      customerName: formData.name,
      email: formData.email,
      phone: formData.phone,
      deliveryAddress: formData.address,
      items: cartItems.map((item) => ({
        menuItem: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: getCartTotal()
    };

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (res.ok) {
        setOrderId(data._id);
        setStep(3);
        clearCart();
        showToast('Your order has been placed successfully!', 'success');
      } else {
        showToast(data.message || 'Failed to place order. Try again.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsCartOpen(false);
    // Reset state after drawer closes
    setTimeout(() => {
      setStep(1);
      setFormData({ name: '', email: '', phone: '', address: '' });
      setOrderId('');
    }, 300);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      zIndex: 2000,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      {/* Backdrop */}
      <div 
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(5, 5, 4, 0.7)',
          backdropFilter: 'blur(8px)'
        }} 
      />

      {/* Drawer Panel */}
      <div className="glass-card" style={{
        position: 'relative',
        zIndex: 2001,
        width: '100%',
        maxWidth: '460px',
        height: '100%',
        background: 'rgba(12, 12, 10, 0.95)',
        borderLeft: '1px solid rgba(255, 107, 53, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
        animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: '20px', fontFamily: 'var(--font-headline)', color: '#FFF', margin: 0 }}>
              {step === 1 && 'Shopping Cart'}
              {step === 2 && 'Checkout Details'}
              {step === 3 && 'Order Confirmed'}
            </h3>
          </div>
          <button 
            onClick={handleClose}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#FFF'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
          >
            <X size={16} />
          </button>
        </div>

        {/* STEP 1: CART LIST */}
        {step === 1 && (
          <>
            <div style={{ flexGrow: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cartItems.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '15px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  <ShoppingBag size={48} style={{ strokeWidth: 1.5, opacity: 0.5, color: 'var(--color-primary)' }} />
                  <div>
                    <h4 style={{ color: '#FFF', fontSize: '18px', marginBottom: '6px' }}>Your Cart is Empty</h4>
                    <p style={{ fontSize: '13px', maxWidth: '280px', lineHeight: '1.5' }}>Explore our menu and add premium dishes to your selection to place an order.</p>
                  </div>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item._id} style={{
                    display: 'flex',
                    gap: '15px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                    alignItems: 'center'
                  }}>
                    <div style={{ width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={item.imageUrl} alt={item.name} decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    
                    <div style={{ flexGrow: 1 }}>
                      <h4 style={{ color: '#FFF', fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{item.name}</h4>
                      <span style={{ color: 'var(--color-accent-gold)', fontWeight: 700, fontSize: '14px' }}>${item.price}</span>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '20px',
                          padding: '2px 8px',
                          gap: '10px'
                        }}>
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', padding: 0 }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ fontSize: '13px', color: '#FFF', fontWeight: 600 }}>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', padding: 0 }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item._id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-muted)',
                        cursor: 'pointer',
                        padding: '8px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div style={{
                padding: '24px',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                background: 'rgba(7,7,6,0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '15px' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
                  <strong style={{ color: '#FFF', fontSize: '18px', fontWeight: 700 }}>${getCartTotal()}</strong>
                </div>
                <button 
                  onClick={() => setStep(2)}
                  className="btn btn-primary btn-md btn-block"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: CHECKOUT FORM */}
        {step === 2 && (
          <form onSubmit={handleCheckoutSubmit} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <div style={{ flexGrow: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase' }}>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  placeholder="Enter your name" 
                  className="input-field" 
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase' }}>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  placeholder="patron@example.com" 
                  className="input-field" 
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase' }}>Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  required 
                  placeholder="Enter phone number" 
                  className="input-field" 
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase' }}>Delivery Address</label>
                <textarea 
                  name="address" 
                  required 
                  rows="3" 
                  placeholder="Enter complete drop-off street address" 
                  className="input-field" 
                  value={formData.address}
                  onChange={handleInputChange}
                  style={{ resize: 'none' }}
                />
              </div>

              <div className="glass-card" style={{ padding: '16px', marginTop: '10px', border: '1px dashed rgba(212,175,55,0.2)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h4 style={{ fontSize: '13px', color: 'var(--color-accent-gold)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CreditCard size={14} /> Cash on Delivery (COD) Enabled
                </h4>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0, lineHeight: '1.4' }}>
                  To guarantee absolute fresh delivery of our chef selections, orders are billed cash/card on arrival at your address.
                </p>
              </div>
            </div>

            <div style={{
              padding: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              background: 'rgba(7,7,6,0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Total Amount</span>
                <strong style={{ color: '#FFF', fontSize: '18px' }}>${getCartTotal()}</strong>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="btn btn-secondary btn-md"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-md"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Place COD Order'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 3: SUCCESS SCREEN */}
        {step === 3 && (
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '20px', textAlign: 'center' }}>
            <CheckCircle size={64} style={{ color: '#4ADE80' }} />
            <div>
              <h4 style={{ color: '#FFF', fontSize: '22px', fontFamily: 'var(--font-headline)', marginBottom: '8px' }}>Order Received!</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
                Thank you for choosing FlavorNest. Your culinary order has been received and is being prepared fresh.
              </p>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
              padding: '16px',
              width: '100%',
              fontSize: '13px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div><strong>Order Reference</strong>: <span style={{ color: 'var(--color-primary)' }}>{orderId}</span></div>
              <div><strong>Status</strong>: <span style={{ color: '#FBBF24' }}>Pending Preparation</span></div>
              <div><strong>Method</strong>: Cash/Card on Delivery</div>
            </div>

            <button 
              onClick={handleClose} 
              className="btn btn-primary btn-md btn-block"
              style={{ marginTop: '20px' }}
            >
              Close Cart
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default CartDrawer;
