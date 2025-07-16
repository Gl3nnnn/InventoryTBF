const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Simple in-memory logs store for demonstration
const actionLogs = [
  { id: 1, user: 'admin@example.com', action: 'Created product', timestamp: new Date().toISOString() },
  { id: 2, user: 'staff@example.com', action: 'Updated profile', timestamp: new Date().toISOString() },
];

const loginHistory = [
  { id: 1, user: 'admin@example.com', loginTime: new Date().toISOString(), ip: '192.168.1.10' },
  { id: 2, user: 'staff@example.com', loginTime: new Date().toISOString(), ip: '192.168.1.11' },
];

// @route   GET /api/logs/actions
// @desc    Get user action logs
// @access  Private
router.get('/actions', auth, (req, res) => {
  res.json(actionLogs);
});

// @route   GET /api/logs/login-history
// @desc    Get user login history
// @access  Private
router.get('/login-history', auth, (req, res) => {
  res.json(loginHistory);
});

module.exports = router;
