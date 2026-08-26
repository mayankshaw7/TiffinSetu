import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authcontext';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

const PaymentPage = () => {
  const { API } = useAuth();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/order/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        alert(err.response?.data?.msg || 'Failed to load order');
        navigate('/customer');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, API, navigate]);

  const handlePay = async () => {
    setProcessing(true);
    try {
      const res = await API.post(`/order/confirm-payment/${orderId}`);
      alert(res.data.msg);
      navigate('/payment/success', { state: { orderId } });
    } catch (err) {
      alert(err.response?.data?.msg || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-gray-600">Loading order details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-red-500">Order not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-grow max-w-3xl mx-auto p-6 w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Payment Confirmation</h2>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="border-b pb-4">
            <p className="text-sm text-gray-500">Order ID: {order._id}</p>
            <p className="text-sm text-gray-500">Status: <span className="font-semibold text-yellow-600">{order.status}</span></p>
          </div>

          <div className="py-4">
            <h3 className="text-xl font-semibold">{order.tiffinId.name}</h3>
            <p className="text-gray-600">{order.tiffinId.description}</p>
            <div className="mt-2 space-y-1">
              <p><span className="font-medium">Quantity:</span> {order.quantity}</p>
              <p><span className="font-medium">Total Price:</span> ₹{order.totalPrice}</p>
              <p><span className="font-medium">Provider:</span> {order.providerId?.name} ({order.providerId?.contactInfo})</p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-800 font-medium">💳 Simulated Payment</p>
            <p className="text-sm text-gray-600">For testing, click "Pay Now" to confirm.</p>
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

export default PaymentPage;