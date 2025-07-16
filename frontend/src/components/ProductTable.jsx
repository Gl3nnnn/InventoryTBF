import React, { useState, useMemo } from 'react';

const ProductTable = ({ products, onEdit, onDelete }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'dateAdded', direction: 'desc' });
  const [filterCategory, setFilterCategory] = useState('');

  const sortedFilteredProducts = useMemo(() => {
    let filtered = products;
    if (filterCategory) {
      filtered = filtered.filter(p => p.category.toLowerCase().includes(filterCategory.toLowerCase()));
    }

    const sorted = [...filtered].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [products, sortConfig, filterCategory]);

  const requestSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by category"
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="border p-2 rounded w-64"
        />
      </div>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th
              className="border px-4 py-2 cursor-pointer"
              onClick={() => requestSort('name')}
            >
              Name
            </th>
            <th
              className="border px-4 py-2 cursor-pointer"
              onClick={() => requestSort('category')}
            >
              Category
            </th>
            <th
              className="border px-4 py-2 cursor-pointer"
              onClick={() => requestSort('quantity')}
            >
              Quantity
            </th>
            <th
              className="border px-4 py-2 cursor-pointer"
              onClick={() => requestSort('price')}
            >
              Price
            </th>
            <th
              className="border px-4 py-2 cursor-pointer"
              onClick={() => requestSort('SKU')}
            >
              SKU
            </th>
            <th
              className="border px-4 py-2 cursor-pointer"
              onClick={() => requestSort('dateAdded')}
            >
              Date Added
            </th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedFilteredProducts.map(product => (
            <tr key={product._id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">{product.category}</td>
              <td className="border px-4 py-2">{product.quantity}</td>
              <td className="border px-4 py-2">${product.price.toFixed(2)}</td>
              <td className="border px-4 py-2">{product.SKU}</td>
              <td className="border px-4 py-2">{new Date(product.dateAdded).toLocaleDateString()}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => onEdit(product)}
                  className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(product._id)}
                  className="bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {sortedFilteredProducts.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
