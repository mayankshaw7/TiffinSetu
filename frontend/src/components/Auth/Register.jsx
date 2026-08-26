import React, { useState } from 'react';
import { useAuth } from '../../context/authcontext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('customer');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    foodPreference: 'veg',
    foodTypesOffered: [],
    contactInfo: '',
    businessName: ''
  });

  // 👇 NEW: Error state for validation messages
  const [errors, setErrors] = useState({});

  // Helper to toggle a food type in the provider's offered list
  const toggleFoodType = (type) => {
    setForm((prev) => ({
      ...prev,
      foodTypesOffered: prev.foodTypesOffered.includes(type)
        ? prev.foodTypesOffered.filter((t) => t !== type)
        : [...prev.foodTypesOffered, type]
    }));
  };

  // 👇 NEW: Validation function (matches your backend regex)
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation (same as backend)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (same as backend: 10 digits, starts with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(form.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 👇 RUN VALIDATION before calling the API
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    const data = { ...form, role };
    const res = await register(data);
    if (res.success) {
      navigate(role === 'customer' ? '/customer' : '/provider');
    } else {
      alert(res.error);
    }
  };

  // 👇 NEW: Clear specific error when user types
  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-green-100 bg-white p-8 shadow-xl shadow-green-100">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl">✨</div>
            <h2 className="text-3xl font-bold text-green-800">Create your account</h2>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-gray-700">I am a:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-green-200 bg-white px-4 py-3 text-base outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="customer">Customer</option>
              <option value="provider">Tiffin Provider</option>
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Common fields */}
            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              className="w-full rounded-xl border border-green-200 bg-white px-4 py-3 md:col-span-2"
            />
            
            {/* Email Field with Error Display */}
            <div className="md:col-span-2">
              <input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className={`w-full rounded-xl border bg-white px-4 py-3 ${
                  errors.email ? 'border-red-500' : 'border-green-200'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              className="w-full rounded-xl border border-green-200 bg-white px-4 py-3 md:col-span-2"
            />

            {/* Phone Field with Error Display */}
            <div className="md:col-span-2">
              <input
                placeholder="Phone Number"
                type="tel"
                value={form.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
                className={`w-full rounded-xl border bg-white px-4 py-3 ${
                  errors.phone ? 'border-red-500' : 'border-green-200'
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <input
              placeholder="Location (City/Area)"
              value={form.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              required
              className="w-full rounded-xl border border-green-200 bg-white px-4 py-3 md:col-span-2"
            />

            {/* Customer specific */}
            {role === 'customer' && (
              <select
                value={form.foodPreference}
                onChange={(e) => setForm({ ...form, foodPreference: e.target.value })}
                className="w-full rounded-xl border border-green-200 bg-white px-4 py-3 md:col-span-2"
              >
                <option value="veg">Veg</option>
                <option value="pure-veg">Pure Veg (No Onion/Garlic)</option>
                <option value="jain">Jain</option>
                <option value="non-veg">Non-Veg</option>
              </select>
            )}

            {/* Provider specific */}
            {role === 'provider' && (
              <>
                <input
                  placeholder="Business Name"
                  value={form.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  required
                  className="w-full rounded-xl border border-green-200 bg-white px-4 py-3 md:col-span-2"
                />
                <input
                  placeholder="Contact Info (Address/city)"
                  value={form.contactInfo}
                  onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                  required
                  className="w-full rounded-xl border border-green-200 bg-white px-4 py-3 md:col-span-2"
                />

                {/* Checkbox group for food types */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Food Types Offered:
                  </label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {[
                      { value: 'veg', label: 'Pure Veg' },
                      { value: 'pure-veg', label: 'Pure Veg (No Onion/Garlic)' },
                      { value: 'jain', label: 'Jain' },
                      { value: 'non-veg', label: 'Non-Veg' }
                    ].map((type) => (
                      <label
                        key={type.value}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                          form.foodTypesOffered.includes(type.value)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={form.foodTypesOffered.includes(type.value)}
                          onChange={() => toggleFoodType(type.value)}
                          className="h-4 w-4 accent-green-600"
                        />
                        <span className="text-sm text-gray-700">{type.label}</span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Select all that tiffins you offer. This helps customers find you based on their dietary preferences. 
                  </p>
                </div>
              </>
            )}
          </div>
          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-green-600 px-4 py-3 text-base font-bold text-white transition hover:bg-green-700"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;