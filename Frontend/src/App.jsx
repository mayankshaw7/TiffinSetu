import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authcontext';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import CustomerDashboard from './components/Customer/Dashboard';
import ProviderDashboard from './components/Provider/Dashboard';
import LandingPage from './components/Landing/LandingPage';
import AboutPage from './components/About/AboutPage';
import PaymentPage from './components/Payment/PaymentPage';
import SuccessPage from './components/Payment/SuccessPage';
import OrdersPage from './components/Customer/OrdersPage';
import CartPage from './components/Customer/CartPage'; // ✅ Import CartPage

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/payment/:orderId" element={<ProtectedRoute allowedRole="customer"><PaymentPage /></ProtectedRoute>} />
          <Route path="/payment/success" element={<ProtectedRoute allowedRole="customer"><SuccessPage /></ProtectedRoute>} />
          
          <Route
            path="/customer"
            element={
              <ProtectedRoute allowedRole="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/orders"
            element={
              <ProtectedRoute allowedRole="customer">
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/provider"
            element={
              <ProtectedRoute allowedRole="provider">
                <ProviderDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* ✅ Cart Route - INSIDE Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRole="customer">
                <CartPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;