import React, { useEffect, useState } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [totalInventoryValue, setTotalInventoryValue] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const products = res.data;
        setTotalProducts(products.length);
        setLowStockProducts(products.filter(p => p.quantity < 5));
        setTotalInventoryValue(
          products.reduce((acc, p) => acc + p.price * p.quantity, 0)
        );
        setCategoriesCount(new Set(products.map(p => p.category)).size);
        setRecentProducts(
          products
            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
            .slice(0, 5)
        );
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar
          onLogout={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
        />
        <main className="p-6 bg-gray-100 flex-1">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-lg shadow-lg border border-white border-opacity-20">
              <h2 className="text-xl font-semibold mb-2 text-black">Total Products</h2>
              <p className="text-4xl text-black">{totalProducts}</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-lg shadow-lg border border-white border-opacity-20">
              <h2 className="text-xl font-semibold mb-2 text-black flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Low Stock Alerts</span>
              </h2>
              {lowStockProducts.length === 0 ? (
                <p className="text-black">No low stock products</p>
              ) : (
                <ul className="list-disc list-inside max-h-40 overflow-auto text-black">
                  {lowStockProducts.map(product => (
                    <li key={product._id}>
                      {product.name} (Qty: {product.quantity})
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-lg shadow-lg border border-white border-opacity-20">
              <h2 className="text-xl font-semibold mb-2 text-black">Total Inventory Value</h2>
              <p className="text-4xl text-black">${totalInventoryValue.toFixed(2)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-lg shadow-lg border border-white border-opacity-20">
              <h2 className="text-xl font-semibold mb-2 text-black">Categories</h2>
              <p className="text-4xl text-black">{categoriesCount}</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-lg shadow-lg border border-white border-opacity-20 col-span-2">
              <h2 className="text-xl font-semibold mb-2 text-black">Recent Products Added</h2>
              {recentProducts.length === 0 ? (
                <p className="text-black">No recent products</p>
              ) : (
                <ul className="list-disc list-inside max-h-40 overflow-auto text-black">
                  {recentProducts.map(product => (
                    <li key={product._id}>
                      {product.name} - {product.category} (Qty: {product.quantity})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
