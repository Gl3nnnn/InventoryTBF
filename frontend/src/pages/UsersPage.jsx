import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import api from '../api';
import { Link } from 'react-router-dom';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Create user form states
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserConfirmPassword, setNewUserConfirmPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('');
  const [newUserStatus, setNewUserStatus] = useState(true);
  const [newUserMessage, setNewUserMessage] = useState('');
  const [newUserError, setNewUserError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/auth/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        setError('Failed to load users: ' + (err.response?.data?.message || err.message));
      }
    };
    fetchUsers();
  }, []);

  const validateNewUser = () => {
    if (newUserPassword !== newUserConfirmPassword) {
      setNewUserError('Passwords do not match');
      return false;
    }
    if (!newUserEmail) {
      setNewUserError('Email is required');
      return false;
    }
    if (!newUserRole) {
      setNewUserError('Role is required');
      return false;
    }
    return true;
  };

  const resetNewUserForm = () => {
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserConfirmPassword('');
    setNewUserRole('');
    setNewUserStatus(true);
    setNewUserMessage('');
    setNewUserError('');
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    setNewUserMessage('');
    setNewUserError('');

    if (!validateNewUser()) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await api.post(
        '/auth/register',
        {
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          role: newUserRole,
          status: newUserStatus,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewUserMessage('User added successfully');
      resetNewUserForm();
      // Refresh user list
      const updatedRes = await api.get('/auth/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(updatedRes.data);
      setShowCreateForm(false);
    } catch (err) {
      setNewUserError(err.response?.data?.message || 'Failed to add user');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
      <Navbar
        onLogout={() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }}
      />
        <main className="p-6 bg-gray-100 flex-1 overflow-auto">
          <h2 className="text-2xl font-bold mb-4 flex justify-between items-center">
            Users
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {showCreateForm ? 'Cancel' : 'Create User'}
            </button>
          </h2>
          {showCreateForm && (
            <form onSubmit={handleAddUserSubmit} className="bg-white rounded-lg shadow p-6 max-w-4xl mb-6">
              <h3 className="text-xl font-semibold mb-4">Add New User</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="newUserName" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    id="newUserName"
                    type="text"
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label htmlFor="newUserEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    id="newUserEmail"
                    type="email"
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label htmlFor="newUserPassword" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    id="newUserPassword"
                    type="password"
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <label htmlFor="newUserConfirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    id="newUserConfirmPassword"
                    type="password"
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newUserConfirmPassword}
                    onChange={(e) => setNewUserConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                  />
                </div>
                <div>
                  <label htmlFor="newUserRole" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    id="newUserRole"
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select role</option>
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="newUserStatus" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    id="newUserStatus"
                    value={newUserStatus ? 'active' : 'inactive'}
                    onChange={(e) => setNewUserStatus(e.target.value === 'active')}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {newUserMessage && <p className="text-green-600 font-medium">{newUserMessage}</p>}
              {newUserError && <p className="text-red-600 font-medium">{newUserError}</p>}

              <button
                type="submit"
                className="mt-6 w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition-colors"
              >
                Add User
              </button>
            </form>
          )}

          {error && (
            <div className="mb-4 text-red-600 font-medium">
              {error}
            </div>
          )}
          <table className="min-w-full table-auto border-collapse border border-gray-300 bg-white rounded shadow">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Role</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4">No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <Link
                        to={`/edit-user/${user.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default UsersPage;
