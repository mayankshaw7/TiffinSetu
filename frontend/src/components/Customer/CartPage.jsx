import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authcontext';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useNavigate, Link } from 'react-router-dom';

const CartPaymentPage = () => {
  const { API } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await API.get('/cart');
      setCart(res.data);
    } catch (err) {
      console.error('Fetch cart error:', err);
      alert('Failed to load cart');
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Remove item from cart (re‑fetch after removal)
  const handleRemove = async (tiffinId) => {
    if (!confirm('Remove this item from cart?')) return;
    try {
      await API.delete(`/cart/remove/${tiffinId}`);
      alert('Item removed from cart');
      fetchCart(); // Refresh the cart
    } catch (err) {
      alert(err.response?.data?.msg || 'Error removing item');
    }
  };

  // const handlePay = async () => {
  //   setProcessing(true);
  //   try {
  //     const res = await API.post('/order/checkout');
  //     const orderIds = res.data.orderIds;
  //     navigate('/payment/success', { state: { orderIds, fromCart: true } });
  //   } catch (err) {
  //     console.error('Checkout error:', err.response?.data || err.message);
  //     alert(err.response?.data?.msg || 'Payment failed. Please try again.');
  //     setProcessing(false);
  //   }
  // };
  const handlePay = async () => {
  setProcessing(true);
  try {
    const res = await API.post('/order/checkout');
    const orderIds = res.data.orderIds;
    // ✅ Pass both orderIds and fromCart flag
    navigate('/payment/success', { state: { orderIds, fromCart: true } });
  } catch (err) {
    console.error('Checkout error:', err.response?.data || err.message);
    alert(err.response?.data?.msg || 'Payment failed. Please try again.');
    setProcessing(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700">Your cart is empty</h2>
            <Link to="/customer" className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded-lg">
              Browse Tiffins
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const total = cart.items.reduce((sum, item) => sum + item.tiffinId.price * item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-grow max-w-3xl mx-auto p-6 w-full">
        <h2 className="text-3xl font-bold mb-6">Checkout</h2>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          <div className="space-y-3">
            {cart.items.map((item) => (
              <div key={item.tiffinId._id} className="flex justify-between items-center border-b pb-2">
                <div className="flex-1">
                  <p className="font-medium">{item.tiffinId.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold mr-4">₹{item.tiffinId.price * item.quantity}</p>
                {/* ✅ Remove button added here */}
                <button
                  onClick={() => handleRemove(item.tiffinId._id)}
                  className="text-red-500 hover:text-red-700 text-xl font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-xl font-bold border-t pt-4">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-800 font-medium">💳 Simulated Payment</p>
            <p className="text-sm text-gray-600">Click "Pay Now" to complete your order.</p>
          </div>

          <button
            onClick={handlePay}
            disabled={processing}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-lg transition disabled:bg-gray-400"
          >
            {processing ? 'Processing...' : '💳 Pay Now'}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPaymentPage;