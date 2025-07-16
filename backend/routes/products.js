const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products with optional filtering and sorting
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { category, sortBy, order } = req.query;
    let filter = {};
    if (category) {
      filter.category = category;
    }

    let sort = {};
    if (sortBy) {
      sort[sortBy] = order === 'desc' ? -1 : 1;
    } else {
      sort.dateAdded = -1; // default sort by dateAdded descending
    }

    const products = await Product.find(filter).sort(sort);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/products
// @desc    Add a new product
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, category, quantity, price, SKU } = req.body;

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ SKU });
    if (existingProduct) {
      return res.status(400).json({ message: 'SKU must be unique' });
    }

    const newProduct = new Product({
      name,
      category,
      quantity,
      price,
      SKU,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product by ID
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, category, quantity, price, SKU } = req.body;

    // Check if SKU is unique if changed
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (SKU && SKU !== product.SKU) {
      const existingProduct = await Product.findOne({ SKU });
      if (existingProduct) {
        return res.status(400).json({ message: 'SKU must be unique' });
      }
    }

    product.name = name || product.name;
    product.category = category || product.category;
    product.quantity = quantity !== undefined ? quantity : product.quantity;
    product.price = price !== undefined ? price : product.price;
    product.SKU = SKU || product.SKU;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product by ID
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
