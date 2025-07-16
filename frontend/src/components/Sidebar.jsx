import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HiOutlineHome, 
  HiOutlineCube, 
  HiOutlineChartBar, 
  HiOutlineCog, 
  HiOutlineClipboardList, 
  HiOutlineUsers 
} from 'react-icons/hi';

const Sidebar = () => {
  const iconClass = "inline-block mr-2 text-white";
  const iconSize = 20;

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4 flex flex-col justify-between">
      <nav className="flex flex-col space-y-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'bg-gray-700 px-3 py-2 rounded flex items-center' : 'hover:bg-gray-700 px-3 py-2 rounded flex items-center'
          }
          end
        >
          <HiOutlineHome size={iconSize} className={iconClass} />
          Dashboard
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? 'bg-gray-700 px-3 py-2 rounded flex items-center' : 'hover:bg-gray-700 px-3 py-2 rounded flex items-center'
          }
        >
          <HiOutlineCube size={iconSize} className={iconClass} />
          Products
        </NavLink>
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            isActive ? 'bg-gray-700 px-3 py-2 rounded flex items-center' : 'hover:bg-gray-700 px-3 py-2 rounded flex items-center'
          }
        >
          <HiOutlineChartBar size={iconSize} className={iconClass} />
          Reports
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? 'bg-gray-700 px-3 py-2 rounded flex items-center' : 'hover:bg-gray-700 px-3 py-2 rounded flex items-center'
          }
        >
          <HiOutlineCog size={iconSize} className={iconClass} />
          Settings
        </NavLink>
        <NavLink
          to="/logs"
          className={({ isActive }) =>
            isActive ? 'bg-gray-700 px-3 py-2 rounded flex items-center' : 'hover:bg-gray-700 px-3 py-2 rounded flex items-center'
          }
        >
          <HiOutlineClipboardList size={iconSize} className={iconClass} />
          View Logs
        </NavLink>
        <NavLink
          to="/users"
          className={({ isActive }) =>
            isActive ? 'bg-gray-700 px-3 py-2 rounded flex items-center' : 'hover:bg-gray-700 px-3 py-2 rounded flex items-center'
          }
        >
          <HiOutlineUsers size={iconSize} className={iconClass} />
          Users
        </NavLink>
      </nav>
      <div className="text-center text-sm text-gray-400 mt-4">
        &copy; {new Date().getFullYear()} Inventory System
      </div>
    </aside>
  );
};

export default Sidebar;
