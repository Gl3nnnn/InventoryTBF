import React, { useEffect, useState } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProductTable from '../components/ProductTable';
import ProductForm from '../components/ProductForm';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      setError('Failed to fetch products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const handleSave = async (productData) => {
    try {
      if (editingProduct) {
        // Update product
        const res = await api.put(`/products/${editingProduct._id}`, productData);
        setProducts(products.map(p => (p._id === editingProduct._id ? res.data : p)));
      } else {
        // Add new product
        const res = await api.post('/products', productData);
        setProducts([...products, res.data]);
      }
      setShowForm(false);
      setEditingProduct(null);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    setError('');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar onLogout={() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }} />
        <main className="p-6 bg-gray-100 flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Products</h1>
            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Add Product
            </button>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {showForm ? (
            <ProductForm
              product={editingProduct}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <ProductTable
              products={products}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
