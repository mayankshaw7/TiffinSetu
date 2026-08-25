import React, { useState } from 'react';
import { useAuth } from '../../context/authcontext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginRole, setLoginRole] = useState('customer');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      const userRole = String(res.user?.role || '').toLowerCase();
      const selectedRole = String(loginRole || '').toLowerCase();

      if (selectedRole && userRole !== selectedRole) {
        alert(`❌ This email is registered as a "${userRole}".\nPlease switch to the "${userRole}" login tab above.`);
        return;
      }

      const redirectPath = userRole === 'provider' ? '/provider' : '/customer';
      navigate(redirectPath);
    } else {
      alert(res.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-emerald-100">
      {/* Navbar - login link will be hidden automatically */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-green-100 bg-green p-8 shadow-xl shadow-green-100">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl">
                🍱
              </div>
              <h2 className="text-3xl font-bold text-green-800">Welcome back</h2>
              <p className="mt-2 text-sm text-gray-600">Login to continue your TiffinSetu journey</p>
            </div>

            <div className="mb-6 grid grid-cols-2 overflow-hidden rounded-xl border border-green-200 bg-green-50">
              <button
                type="button"
                onClick={() => setLoginRole('customer')}
                className={`py-3 font-semibold transition ${
                  loginRole === 'customer'
                    ? 'bg-green-600 text-white'
                    : 'bg-transparent text-green-700'
                }`}
              >
                🧑‍🍳 Customer
              </button>
              <button
                type="button"
                onClick={() => setLoginRole('provider')}
                className={`py-3 font-semibold transition ${
                  loginRole === 'provider'
                    ? 'bg-green-600 text-white'
                    : 'bg-transparent text-green-700'
                }`}
              >
                🏪 Provider
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-green-200 bg-white px-4 py-3 text-base outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-green-200 bg-white px-4 py-3 text-base outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-green-600 px-4 py-3 text-base font-bold text-white shadow-md transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
              >
                {isLoading ? 'Logging in...' : `Login as ${loginRole === 'customer' ? 'Customer' : 'Provider'}`}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-semibold text-green-700 hover:text-green-800">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Login;