import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authcontext';
import Navbar from '../Navbar';
import Footer from '../Footer';

// Top 50 Indian cities
const TOP_CITIES = [
  'New Delhi', 'Kolkata', 'Mumbai', 'Bengaluru', 'Chennai',
  'Hyderabad', 'Ahmedabad', 'Surat', 'Pune', 'Kozhikode',
  'Kochi', 'Lucknow', 'Kanpur', 'Jaipur', 'Varanasi',
  'Indore', 'Patna', 'Nagpur', 'Kalyan-Dombivli', 'Thane',
  'Bhopal', 'Visakhapatnam', 'Vadodara', 'Vijayawada', 'Nashik',
  'Rajkot', 'Ludhiana', 'Agra', 'Coimbatore', 'Madurai',
  'Ranchi', 'Jabalpur', 'Amritsar', 'Allahabad (Prayagraj)', 'Dhanbad',
  'Ghaziabad', 'Faridabad', 'Meerut', 'Jamshedpur', 'Navi Mumbai',
  'Aurangabad', 'Solapur', 'Tiruchirappalli', 'Haora (Howrah)', 'Gorakhpur',
  'Pimpri', 'Kollam', 'Kannur', 'Thiruvananthapuram'
];

const ProviderDashboard = () => {
  const { user, logout, API } = useAuth();
  const [tiffins, setTiffins] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // ✅ Add form – removed isAvailable
  const [addForm, setAddForm] = useState({
    name: '',
    description: '',
    price: '',
    foodType: 'veg',
    timing: 'Lunch',
    location: user?.location || ''
  });

  // ✅ Edit form – removed isAvailable
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    foodType: 'veg',
    timing: 'Lunch',
    location: ''
  });

  useEffect(() => {
    fetchTiffins();
  }, []);

  const fetchTiffins = async () => {
    try {
      const res = await API.get('/tiffin');
      setTiffins(res.data.filter(item => item.providerId?._id === user?.id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tiffin', addForm);
      alert('Tiffin added!');
      setAddForm({
        name: '',
        description: '',
        price: '',
        foodType: 'veg',
        timing: 'Lunch',
        location: user?.location || ''
      });
      fetchTiffins();
    } catch (err) {
      alert(err.response?.data?.msg || 'Error adding tiffin');
      console.error('Add error:', err.response?.data);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await API.put(`/tiffin/${id}`, editForm);
      alert('Updated!');
      setEditingId(null);
      setEditForm({
        name: '',
        description: '',
        price: '',
        foodType: 'veg',
        timing: 'Lunch',
        location: ''
      });
      fetchTiffins();
    } catch (err) {
      alert(err.response?.data?.msg || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this tiffin?')) return;
    try {
      await API.delete(`/tiffin/${id}`);
      alert('Deleted!');
      fetchTiffins();
    } catch (err) {
      alert(err.response?.data?.msg || 'Error');
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditForm({
      name: item.name,
      description: item.description || '',
      price: item.price,
      foodType: item.foodType,
      timing: item.timing,
      location: item.location
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      name: '',
      description: '',
      price: '',
      foodType: 'veg',
      timing: 'Lunch',
      location: ''
    });
  };

  const inputClass = "w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 outline-none focus:border-green-500";
  const selectClass = "w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 outline-none focus:border-green-500 appearance-none";

  const getFoodTypeLabel = (type) => {
    switch (type) {
      case 'veg': return 'Veg (With Onion/Garlic)';
      case 'pure-veg': return 'Pure Veg (No Onion/Garlic)';
      case 'jain': return 'Jain';
      case 'non-veg': return 'Non-Veg';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-emerald-100">
      <Navbar />
      <div className="flex-grow max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-green-700 to-emerald-600 p-6 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-green-100">Provider dashboard</p>
            <h2 className="mt-2 text-3xl font-bold">Welcome, {user?.name}</h2>
          </div>
          <button
            onClick={logout}
            className="rounded-full bg-white px-5 py-2 font-semibold text-green-700 transition hover:bg-green-50"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)] items-start">

          {/* Add Form */}
          <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-md hover:shadow-xl transition">
            <h3 className="mb-4 text-2xl font-bold text-green-800">Add New Tiffin</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <input
                placeholder="Tiffin Name"
                value={addForm.name}
                onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                className={inputClass}
                required
              />
              <input
                placeholder="Description"
                value={addForm.description}
                onChange={e => setAddForm({ ...addForm, description: e.target.value })}
                className={inputClass}
              />
              <input
                placeholder="Price (₹)"
                type="number"
                value={addForm.price}
                onChange={e => setAddForm({ ...addForm, price: e.target.value })}
                className={inputClass}
                required
              />

              <select
                value={addForm.location}
                onChange={e => setAddForm({ ...addForm, location: e.target.value })}
                className={selectClass}
                required
              >
                <option value="">Select Location</option>
                {TOP_CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              <select
                value={addForm.foodType}
                onChange={e => setAddForm({ ...addForm, foodType: e.target.value })}
                className={selectClass}
              >
                <option value="veg">Veg (With Onion/Garlic)</option>
                <option value="pure-veg">Pure Veg (No Onion/Garlic)</option>
                <option value="jain">Jain</option>
                <option value="non-veg">Non-Veg</option>
              </select>

              <select
                value={addForm.timing}
                onChange={e => setAddForm({ ...addForm, timing: e.target.value })}
                className={selectClass}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
              </select>

              <button
                type="submit"
                className="w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                Add Tiffin
              </button>
            </form>
          </div>

          {/* Tiffin List */}
          <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-md hover:shadow-xl transition">
            <h3 className="mb-5 text-2xl font-bold text-green-800">My Tiffin Items</h3>
            {tiffins.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-green-200 bg-green-50 p-10 text-center text-green-700">
                No items added yet.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {tiffins.map(item => (
                  <div
                    key={item._id}
                    className={`rounded-2xl border p-4 transition ${editingId === item._id ? 'border-blue-400 bg-blue-50' : 'border-green-100 bg-gradient-to-br from-white to-green-50'}`}
                  >
                    {editingId === item._id ? (
                      // EDIT MODE
                      <>
                        <input
                          value={editForm.name}
                          onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 mb-2"
                          placeholder="Name"
                        />
                        <input
                          value={editForm.description}
                          onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                          className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 mb-2"
                          placeholder="Description"
                        />
                        <input
                          value={editForm.price}
                          onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                          type="number"
                          className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 mb-2"
                          placeholder="Price"
                        />
                        <select
                          value={editForm.location}
                          onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                          className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 mb-2"
                        >
                          <option value="">Select Location</option>
                          {TOP_CITIES.map((city) => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                        <select
                          value={editForm.foodType}
                          onChange={e => setEditForm({ ...editForm, foodType: e.target.value })}
                          className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 mb-2"
                        >
                          <option value="veg">Veg (With Onion/Garlic)</option>
                          <option value="pure-veg">Pure Veg (No Onion/Garlic)</option>
                          <option value="jain">Jain</option>
                          <option value="non-veg">Non-Veg</option>
                        </select>
                        <select
                          value={editForm.timing}
                          onChange={e => setEditForm({ ...editForm, timing: e.target.value })}
                          className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 mb-2"
                        >
                          <option value="Breakfast">Breakfast</option>
                          <option value="Lunch">Lunch</option>
                          <option value="Dinner">Dinner</option>
                        </select>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleUpdate(item._id)}
                            className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex-1 rounded-lg bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      // VIEW MODE
                      <>
                        <h4 className="text-lg font-bold text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <div className="mt-3 space-y-1 text-sm text-gray-700">
                          <p><span className="font-semibold">Type:</span> {getFoodTypeLabel(item.foodType)}</p>
                          <p><span className="font-semibold">Timing:</span> {item.timing}</p>
                          <p><span className="font-semibold">Location:</span> {item.location}</p>
                          <p><span className="font-semibold">Price:</span> ₹{item.price}</p>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => startEdit(item)}
                            className="flex-1 rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-600"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="flex-1 rounded-lg bg-red-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-600"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProviderDashboard;