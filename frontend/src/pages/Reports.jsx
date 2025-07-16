import React, { useEffect, useState } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Reports = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    acc[product.category] = acc[product.category] || [];
    acc[product.category].push(product);
    return acc;
  }, {});

  // Calculate total inventory value
  const totalInventoryValue = products.reduce(
    (acc, p) => acc + p.price * p.quantity,
    0
  );

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
        <main className="p-6 bg-gray-100 flex-1 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">Reports</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <section className="mb-6 bg-white p-6 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Inventory Summary by Category</h2>
                {Object.keys(productsByCategory).length === 0 ? (
                  <p>No products available.</p>
                ) : (
                  <ul>
                    {Object.entries(productsByCategory).map(([category, items]) => (
                      <li key={category} className="mb-2">
                        <strong>{category}</strong>: {items.length} product{items.length !== 1 ? 's' : ''}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
              <section className="mb-6 bg-white p-6 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Low Stock Products</h2>
                {products.filter(p => p.quantity < 5).length === 0 ? (
                  <p>No low stock products.</p>
                ) : (
                  <ul>
                    {products
                      .filter(p => p.quantity < 5)
                      .map(p => (
                        <li key={p._id}>
                          {p.name} (Category: {p.category}) - Qty: {p.quantity}
                        </li>
                      ))}
                  </ul>
                )}
              </section>
              <section className="mb-6 bg-white p-6 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Total Inventory Value</h2>
                <p className="text-2xl font-bold">${totalInventoryValue.toFixed(2)}</p>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Reports;
