import React from 'react';
import { toast } from 'react-toastify';

const Navbar = ({ onLogout }) => {
  const userEmail = localStorage.getItem('userEmail') || 'Admin';

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    toast.info('Logged out successfully');
  };

  return (
    <nav className="bg-blue-600 text-white flex justify-between items-center px-4 py-3">
      <div className="text-lg font-bold">Inventory Management</div>
      <div className="flex items-center space-x-4">
        <span>{userEmail}</span>
        <button
          onClick={handleLogout}
          className="bg-blue-800 hover:bg-blue-900 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
