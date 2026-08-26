import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return { success: true, user: res.data.user }; // ✅ Return user
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Registration failed';
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      const user = res.data.user;
      setUser(user);
      return { success: true, user }; // ✅ Return user
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Login failed';
      console.error('Login API error:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

//added for API base URL from environment variable(DOCKER)
  const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});
  // Attach token to every request
  API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers['x-auth-token'] = token;
    return config;
  });

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, API }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);