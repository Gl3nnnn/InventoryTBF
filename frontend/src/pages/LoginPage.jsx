import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResetMessage('');
    setLoading(true);
      try {
        const response = await api.post('/auth/login', { email, password });
        // Always save token to localStorage for now to fix issue
        localStorage.setItem('token', response.data.token);
        // Redirect to dashboard
        navigate('/dashboard');
        toast.success('Login successful!');
      } catch (err) {
        if (err.response && err.response.status === 423) {
          setError(err.response.data.message);
          setShowReset(true);
          toast.error(err.response.data.message);
        } else {
          setError('Invalid credentials');
          toast.error('Invalid credentials');
        }
      } finally {
        setLoading(false);
      }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setResetMessage('');
    setError('');
    try {
      await api.post('/auth/reset-password', { email, newPassword });
      setResetMessage('Password reset successful. You can now login with your new password.');
      setShowReset(false);
      setPassword('');
      setNewPassword('');
      toast.success('Password reset successful.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
      toast.error(err.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <ToastContainer />
      {!showReset ? (
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-opacity-20 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-md border border-white border-opacity-30 text-white"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-white">Login</h2>
          {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-white border-opacity-50 rounded bg-white bg-opacity-10 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-white border-opacity-50 rounded bg-white bg-opacity-10 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
            autoComplete="current-password"
          />
          <div className="flex items-center justify-between mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="form-checkbox h-5 w-5 text-purple-300"
              />
              <span className="ml-2 text-purple-300">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setShowReset(true);
                setError('');
                setResetMessage('');
              }}
              className="text-purple-300 hover:underline focus:outline-none"
            >
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-purple-600 text-white py-3 rounded hover:bg-purple-700 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleReset}
          className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-opacity-20 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-md border border-white border-opacity-30 text-white"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-white">Reset Password</h2>
          {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
          {resetMessage && <p className="text-green-400 mb-4 text-center">{resetMessage}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-white border-opacity-50 rounded bg-white bg-opacity-10 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-green-300"
            required
            disabled
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 mb-6 border border-white border-opacity-50 rounded bg-white bg-opacity-10 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-green-300"
            required
            autoComplete="new-password"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
          >
            Reset Password
          </button>
          <button
            type="button"
            onClick={() => {
              setShowReset(false);
              setError('');
              setResetMessage('');
            }}
            className="mt-4 w-full bg-gray-400 text-white py-3 rounded hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default LoginPage;
