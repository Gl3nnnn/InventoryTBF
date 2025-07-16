import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import api from '../api';

const CreateUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/auth/register', { email, password, role }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('User created successfully');
      setEmail('');
      setPassword('');
      setRole('user');
    } catch (err) {
      setMessage('Failed to create user: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 bg-gray-100 flex-1 overflow-auto">
          <h2 className="text-2xl font-bold mb-4">Create User</h2>
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
              <label className="block mb-1 font-semibold">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
              Create User
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CreateUser;
