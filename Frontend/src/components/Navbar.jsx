import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authcontext";

const Navbar = () => {
  const { user, logout, API } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Check current page
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isDashboardPage =
    location.pathname === "/customer" || location.pathname === "/provider";
  const isOrdersPage = location.pathname === "/customer/orders";
  const isCartPage = location.pathname === "/cart";

  // Fetch cart count when user is logged in and is a customer
  useEffect(() => {
    if (user && user.role === "customer") {
      API.get("/cart")
        .then((res) => {
          const total = res.data.items.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(total);
        })
        .catch(() => {});
    } else {
      setCartCount(0);
    }
  }, [user, API]);

  return (
    <nav className="bg-white shadow-lg px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Logo Section */}
      <div className="flex items-center space-x-2">
        <img src="/TiffinSetuLogo.png" alt="TiffinSetu" className="h-12 w-auto" />
        <span className="text-2xl font-bold text-green-700">TiffinSetu</span>
        <span className="hidden sm:inline text-sm text-gray-500 ml-2">
          Bridging Taste. Delivering Trust.
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-6">
        <Link
          to="/"
          className="text-gray-700 hover:text-green-600 font-medium transition"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="text-gray-700 hover:text-green-600 font-medium transition"
        >
          About
        </Link>

        {user ? (
          <>
            <Link
              to={user.role === "provider" ? "/provider" : "/customer"}
              className="text-gray-700 hover:text-green-600 font-medium transition"
            >
              Dashboard
            </Link>

            {/* ✅ Show "My Orders" only for customers */}
            {user.role === "customer" && (
              <Link
                to="/customer/orders"
                className={`font-medium transition ${
                  isOrdersPage
                    ? "text-green-700 font-bold"
                    : "text-gray-700 hover:text-green-600"
                }`}
              >
                My Orders
              </Link>
            )}

            {/* ✅ Show "Cart" only for customers */}
            {user.role === "customer" && (
              <Link
                to="/cart"
                className={`relative font-medium transition ${
                  isCartPage
                    ? "text-green-700 font-bold"
                    : "text-gray-700 hover:text-green-600"
                }`}
              >
                🛒 Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* ✅ Hide Logout button on Dashboard pages */}
            {!isDashboardPage && (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition"
              >
                Logout
              </button>
            )}
          </>
        ) : (
          <>
            {!isLoginPage && (
              <Link
                to="/login"
                className="text-gray-700 hover:text-green-600 font-medium transition"
              >
                Login
              </Link>
            )}
            {!isRegisterPage && (
              <Link
                to="/register"
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition"
              >
                Register
              </Link>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;