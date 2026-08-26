import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authcontext'; // ✅ Fixed path
import Navbar from '../Navbar'; // Navbar is in src/components/
import Footer from '../Footer'; // Footer is in src/components/

const LandingPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    // <div className="min-h-screen bg-gray-50">
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Bridging Taste. Delivering Trust.
          </h1>
          <div className="flex justify-center space-x-8 text-2xl font-semibold mb-6">
            <span>🍳 BREAKFAST</span>
            <span>🥗 LUNCH</span>
            <span>🍛 DINNER</span>
          </div>
          <p className="text-xl mb-4 font-light">THREE MEALS. ONE PROMISE.</p>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Find pure vegetarian, Jain, or non‑veg tiffin services across India. 
            Order home‑style meals with confidence.
          </p>

          {!user ? (
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to={user.role === 'provider' ? '/provider' : '/customer'}
                className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-indigo-500 transition text-center">
            <div className="text-5xl mb-4">🍽️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Pure Veg & Jain</h3>
            <p className="text-gray-600">
              Filter tiffins that suit your dietary preferences – no onion/garlic, strict Jain options.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-indigo-500 transition text-center">
            <div className="text-5xl mb-4">📍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Location‑Based</h3>
            <p className="text-gray-600">
              Search tiffin services in your city or area. Travel‑friendly and easy to discover.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-indigo-500 transition text-center">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Order & Track</h3>
            <p className="text-gray-600">
              Order lunch/dinner with quantity control. Get confirmed deliveries with ease.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;