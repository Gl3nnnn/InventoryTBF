import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import api from '../api';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get(`/auth/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmail(res.data.email);
        setRole(res.data.role);
      } catch (err) {
        setMessage('Failed to load user data: ' + (err.response?.data?.message || err.message));
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await api.put(`/auth/user/${id}`, { email, password, role }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('User updated successfully');
      navigate('/users'); // or wherever user list is
    } catch (err) {
      setMessage('Failed to update user: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 bg-gray-100 flex-1 overflow-auto">
          <h2 className="text-2xl font-bold mb-4">Edit User</h2>
          {message && (
            <div className="mb-4 text-red-600 font-medium">
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="max-w-md bg-white rounded shadow p-6">
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Password (leave blank to keep unchanged)</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Role</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update User
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EditUser;
