import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authcontext';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const { user, API } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [API]);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/order');
      
      // ✅ Filter: Only show orders that are Confirmed and Paid
      const filteredOrders = res.data.filter(
        (order) => order.status === 'Confirmed' && order.paymentStatus === 'Paid'
      );
      
      // ✅ Sort: Newest orders first
      const sortedOrders = filteredOrders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setOrders(sortedOrders);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-200 text-green-800';
      case 'Delivered':
        return 'bg-blue-200 text-blue-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const getPaymentBadge = (status) => {
    return status === 'Paid'
      ? 'bg-green-100 text-green-700'
      : 'bg-red-100 text-red-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-gray-600">Loading your orders...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-red-500">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-grow max-w-6xl mx-auto p-6 w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h2>

        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow text-center">
            <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
            <Link
              to="/customer"
              className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Browse Tiffins
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                    <p className="text-sm text-gray-500">
                      Placed on: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  {/* ✅ Show only Confirmed and Paid badges */}
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentBadge(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="mt-4 border-t pt-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <h4 className="font-semibold text-lg">{order.tiffinId?.name}</h4>
                      <p className="text-sm text-gray-600">{order.tiffinId?.description}</p>
                      <p className="text-sm text-gray-500">
                        Provider: {order.providerId?.name} ({order.providerId?.contactInfo})
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {order.quantity} &nbsp;|&nbsp; Total: ₹{order.totalPrice}
                      </p>
                    </div>

                    {/* ✅ No action buttons – all orders are already confirmed and paid */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OrdersPage;