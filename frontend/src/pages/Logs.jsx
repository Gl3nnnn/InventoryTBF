import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import api from '../api';

const Logs = () => {
  const [activeTab, setActiveTab] = useState('actions');
  const [actionLogs, setActionLogs] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchActionLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/logs/actions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActionLogs(res.data);
      } catch (err) {
        setError('Failed to load action logs: ' + (err.response?.data?.message || err.message));
      }
    };

    const fetchLoginHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/logs/login-history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoginHistory(res.data);
      } catch (err) {
        setError('Failed to load login history: ' + (err.response?.data?.message || err.message));
      }
    };

    fetchActionLogs();
    fetchLoginHistory();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar onLogout={handleLogout} />
        <main className="p-6 bg-gray-100 flex-1 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">User Logs</h1>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="mb-4">
            <button
              className={`mr-4 px-4 py-2 rounded ${activeTab === 'actions' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
              onClick={() => setActiveTab('actions')}
            >
              User Action Logs
            </button>
            <button
              className={`px-4 py-2 rounded ${activeTab === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
              onClick={() => setActiveTab('login')}
            >
              Login History
            </button>
          </div>

          {activeTab === 'actions' && (
            <div className="bg-white rounded-lg shadow p-6 max-w-4xl overflow-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">ID</th>
                    <th className="border border-gray-300 px-4 py-2">User</th>
                    <th className="border border-gray-300 px-4 py-2">Action</th>
                    <th className="border border-gray-300 px-4 py-2">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {actionLogs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center p-4">No action logs found.</td>
                    </tr>
                  ) : (
                    actionLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="border border-gray-300 px-4 py-2">{log.id}</td>
                        <td className="border border-gray-300 px-4 py-2">{typeof log.user === 'object' ? JSON.stringify(log.user) : log.user}</td>
                        <td className="border border-gray-300 px-4 py-2">{typeof log.action === 'object' ? JSON.stringify(log.action) : log.action}</td>
                        <td className="border border-gray-300 px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'login' && (
            <div className="bg-white rounded-lg shadow p-6 max-w-4xl overflow-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">ID</th>
                    <th className="border border-gray-300 px-4 py-2">User</th>
                    <th className="border border-gray-300 px-4 py-2">Login Time</th>
                    <th className="border border-gray-300 px-4 py-2">IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {loginHistory.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center p-4">No login history found.</td>
                    </tr>
                  ) : (
                    loginHistory.map((log) => (
                      <tr key={log.id}>
                        <td className="border border-gray-300 px-4 py-2">{log.id}</td>
                        <td className="border border-gray-300 px-4 py-2">{typeof log.user === 'object' ? JSON.stringify(log.user) : log.user}</td>
                        <td className="border border-gray-300 px-4 py-2">{new Date(log.loginTime).toLocaleString()}</td>
                        <td className="border border-gray-300 px-4 py-2">{typeof log.ip === 'object' ? JSON.stringify(log.ip) : log.ip}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Logs;
