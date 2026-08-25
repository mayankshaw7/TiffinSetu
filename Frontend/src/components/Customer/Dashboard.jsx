import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authcontext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

// Top 50 Indian cities
const TOP_CITIES = [
  'New Delhi', 'Kolkata', 'Mumbai', 'Bengaluru', 'Chennai',
  'Hyderabad', 'Ahmedabad', 'Surat', 'Pune',
  'Lucknow', 'Kanpur', 'Jaipur', 'Varanasi',
  'Indore', 'Patna', 'Nagpur','Thane',
  'Bhopal', 'Visakhapatnam', 'Vadodara', 'Vijayawada', 'Nashik',
  'Rajkot', 'Ludhiana', 'Agra', 'Coimbatore',
  'Ranchi', 'Jabalpur', 'Amritsar', 'Allahabad (Prayagraj)', 'Dhanbad',
  'Ghaziabad', 'Faridabad', 'Meerut', 'Jamshedpur', 'Navi Mumbai',
  'Aurangabad','Tiruchirappalli','Gorakhpur',
  'Puri','Bhuneshwar', 'Kannur', 'Thiruvananthapuram'
];

const CustomerDashboard = () => {
  const { user, logout, API } = useAuth();
  const navigate = useNavigate();
  const [tiffins, setTiffins] = useState([]);
  const [filters, setFilters] = useState({ location: '', foodType: '', timing: '' });
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchTiffins();
  }, [filters]);

  const fetchTiffins = async () => {
    const params = new URLSearchParams(filters).toString();
    const res = await API.get(`/tiffin?${params}`);
    setTiffins(res.data);
    const initQty = {};
    res.data.forEach(t => { initQty[t._id] = 1; });
    setQuantities(initQty);
  };

  const handleQuantityChange = (tiffinId, value) => {
    const qty = Math.max(1, parseInt(value) || 1);
    setQuantities(prev => ({ ...prev, [tiffinId]: qty }));
  };

  // ✅ Existing: Order Now (direct checkout)
  const handlePlaceOrder = async (tiffinId) => {
    const quantity = quantities[tiffinId] || 1;
    try {
      const res = await API.post('/order', { tiffinId, quantity });
      const orderId = res.data.order._id;
      navigate(`/payment/${orderId}`);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error placing order');
    }
  };

  // ✅ NEW: Add to Cart
  const handleAddToCart = async (tiffinId) => {
    const quantity = quantities[tiffinId] || 1;
    try {
      await API.post('/cart/add', { tiffinId, quantity });
      alert('Added to cart!');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error adding to cart');
    }
  };

  // Helper to display food type label
  const getFoodTypeLabel = (type) => {
    switch(type) {
      case 'veg': return 'Veg (With Onion/Garlic)';
      case 'pure-veg': return 'Pure Veg (No Onion/Garlic)';
      case 'jain': return 'Jain';
      case 'non-veg': return 'Non-Veg';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-grow p-6">
        {/* Welcome Banner */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-green-700 to-emerald-600 p-6 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-green-100">Customer dashboard</p>
            <h2 className="mt-2 text-3xl font-bold">Welcome, {user?.name}</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/customer/orders"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
            >
              My Orders
            </Link>
            <Link
              to="/cart"
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition"
            >
              🛒 Cart
            </Link>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 bg-white p-4 rounded shadow hover:shadow2xl hover:shadow-indigo-500">
          <select
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="border p-2 rounded flex-1 min-w-[150px] bg-white"
          >
            <option value="">All Locations</option>
            {TOP_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <select
            value={filters.foodType}
            onChange={(e) => setFilters({ ...filters, foodType: e.target.value })}
            className="border p-2 rounded flex-1 min-w-[120px] bg-white"
          >
            <option value="">All Food</option>
            <option value="veg">Veg (With Onion/Garlic)</option>
            <option value="pure-veg">Pure Veg (No Onion/Garlic)</option>
            <option value="jain">Jain</option>
            <option value="non-veg">Non-Veg</option>
          </select>

          <select
            value={filters.timing}
            onChange={(e) => setFilters({ ...filters, timing: e.target.value })}
            className="border p-2 rounded flex-1 min-w-[120px] bg-white"
          >
            <option value="">Any Time</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>

          <button
            onClick={fetchTiffins}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
          >
            Search
          </button>
        </div>

        {/* Tiffin Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiffins.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg hover:shadow-indigo-500 transition">
              <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
              <div className="mt-2 space-y-1 text-sm">
                <p><span className="font-medium">Type:</span> {getFoodTypeLabel(item.foodType)}</p>
                <p><span className="font-medium">Timing:</span> {item.timing}</p>
                <p><span className="font-medium">Location:</span> {item.location}</p>
                <p><span className="font-medium">Price:</span> ₹{item.price}</p>
                <p><span className="font-medium">Provider:</span> {item.providerId?.name} ({item.providerId?.contactInfo})</p>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <label htmlFor={`qty-${item._id}`} className="text-sm font-medium">
                  Qty:
                </label>
                <input
                  id={`qty-${item._id}`}
                  type="number"
                  min="1"
                  value={quantities[item._id] || 1}
                  onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                  className="w-16 border p-1 rounded text-center"
                />
                {/* ✅ NEW: Add to Cart button */}
                <button
                  onClick={() => handleAddToCart(item._id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded flex-1 transition"
                >
                  Add to Cart
                </button>
                {/* Existing: Order Now */}
                <button
                  onClick={() => handlePlaceOrder(item._id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded flex-1 transition"
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {tiffins.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No tiffins found. Try adjusting your filters.</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CustomerDashboard;