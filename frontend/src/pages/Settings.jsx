import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../api';

const Settings = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  // System preferences states
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [defaultPage, setDefaultPage] = useState('Dashboard');
  const [defaultCategory, setDefaultCategory] = useState('All');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(res.data.name || '');
        setEmail(res.data.email || '');
        setRole(res.data.isAdmin ? 'Admin' : 'Staff');
        setProfilePicture(res.data.profilePicture || '');
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (err.response && err.response.status === 401) {
          // Token invalid or expired, redirect to login
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Failed to load profile: ' + (err.response?.data?.message || err.message));
        }
      }
    };
    fetchProfile();

    // Load system preferences from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);

    const savedDefaultPage = localStorage.getItem('defaultPage') || 'Dashboard';
    setDefaultPage(savedDefaultPage);

    const savedDefaultCategory = localStorage.getItem('defaultCategory') || 'All';
    setDefaultCategory(savedDefaultCategory);
  }, [navigate]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('profilePicture', file);
      const res = await api.post('/auth/upload-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setProfilePicture(res.data.url);
      setMessage('Profile picture uploaded successfully');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to upload profile picture');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', newDarkMode);
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const handleDefaultPageChange = (e) => {
    const newPage = e.target.value;
    setDefaultPage(newPage);
    localStorage.setItem('defaultPage', newPage);
  };

  const handleDefaultCategoryChange = (e) => {
    const newCategory = e.target.value;
    setDefaultCategory(newCategory);
    localStorage.setItem('defaultCategory', newCategory);
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await api.put(
        '/auth/profile',
        { name, email, password, profilePicture },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to update profile');
      }
    }
  };

  const handlePreferencesSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      localStorage.setItem('darkMode', darkMode);
      localStorage.setItem('language', language);
      localStorage.setItem('defaultPage', defaultPage);
      localStorage.setItem('defaultCategory', defaultCategory);

      // Update document class for dark mode
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      setMessage('Preferences updated successfully');
    } catch (err) {
      setError('Failed to update preferences');
    }
  };

  const [newUserName, setNewUserName] = React.useState('');
  const [newUserEmail, setNewUserEmail] = React.useState('');
  const [newUserPassword, setNewUserPassword] = React.useState('');
  const [newUserConfirmPassword, setNewUserConfirmPassword] = React.useState('');
  const [newUserRole, setNewUserRole] = React.useState('');
  const [newUserStatus, setNewUserStatus] = React.useState(true);
  const [newUserMessage, setNewUserMessage] = React.useState('');
  const [newUserError, setNewUserError] = React.useState('');

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
          <h1 className="text-3xl font-bold mb-6">Settings</h1>

          {/* Account Settings Form */}
          <form onSubmit={handleAccountSubmit} className="bg-white rounded-lg shadow p-6 mb-6 max-w-4xl">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  id="name"
                  type="text"
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input
                  id="role"
                  type="text"
                  className="w-full rounded border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 cursor-not-allowed"
                  value={role}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL</label>
                <input
                  id="profilePicture"
                  type="text"
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={profilePicture}
                  onChange={(e) => setProfilePicture(e.target.value)}
                  placeholder="Enter profile picture URL"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="upload" className="block text-sm font-medium text-gray-700 mb-1">Upload Profile Picture</label>
                <input
                  id="upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="w-full"
                />
                {uploading && <p className="text-sm text-gray-600 mt-1">Uploading...</p>}
              </div>
            </div>

            {/* Password Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    id="password"
                    type="password"
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            {/* Messages */}
            {message && <p className="text-green-600 font-medium">{message}</p>}
            {error && <p className="text-red-600 font-medium">{error}</p>}

            <button
              type="submit"
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors"
            >
              Update Account
            </button>
          </form>

          {/* System Preferences Form */}
          <form onSubmit={handlePreferencesSubmit} className="bg-white rounded-lg shadow p-6 max-w-4xl mb-6">
            <h2 className="text-xl font-semibold mb-4">System Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="flex items-center space-x-3">
                <input
                  id="darkModeToggle"
                  type="checkbox"
                  checked={darkMode}
                  onChange={handleDarkModeToggle}
                  className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="darkModeToggle" className="text-sm font-medium text-gray-700">Dark Mode</label>
              </div>
              <div>
                <label htmlFor="languageSelect" className="block text-sm font-medium text-gray-700 mb-1">Language / Locale</label>
                <select
                  id="languageSelect"
                  value={language}
                  onChange={handleLanguageChange}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div>
                <label htmlFor="defaultPageSelect" className="block text-sm font-medium text-gray-700 mb-1">Default Page After Login</label>
                <select
                  id="defaultPageSelect"
                  value={defaultPage}
                  onChange={handleDefaultPageChange}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Dashboard">Dashboard</option>
                  <option value="Products">Products</option>
                  <option value="Reports">Reports</option>
                </select>
              </div>
              <div>
                <label htmlFor="defaultCategorySelect" className="block text-sm font-medium text-gray-700 mb-1">Default Product Category Filter</label>
                <select
                  id="defaultCategorySelect"
                  value={defaultCategory}
                  onChange={handleDefaultCategoryChange}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Books">Books</option>
                </select>
              </div>
            </div>

            {/* Messages */}
            {message && <p className="text-green-600 font-medium mt-4">{message}</p>}
            {error && <p className="text-red-600 font-medium mt-4">{error}</p>}

            <button
              type="submit"
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors"
            >
              Update Preferences
            </button>
          </form>

          {/* Add User Form */}
          {/* Removed Add New User form as per user request */}
        </main>
      </div>
    </div>
  );
};

export default Settings;
