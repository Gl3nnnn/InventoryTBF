import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    price: 0,
    SKU: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        quantity: product.quantity || 0,
        price: product.price || 0,
        SKU: product.SKU || '',
      });
    }
  }, [product]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-white shadow-md">
      <div>
        <label className="block mb-1 font-semibold">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="0"
          required
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">SKU</label>
        <input
          type="text"
          name="SKU"
          value={formData.SKU}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
