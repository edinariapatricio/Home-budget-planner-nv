const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/default');
const auth = require('../middleware/auth');  // Corrected path

// Register
router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({ username: req.body.username, password: hashedPassword });
    await user.save();
    res.status(201).send('User created');
  } catch {
    res.status(500).send('Error creating user');
  }
});

// Login
router.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user && await bcrypt.compare(req.body.password, user.password)) {
    const token = jwt.sign({ userId: user._id, role: user.role }, config.secretOrKey);
    res.json({ token });
  } else {
    res.status(400).send('Invalid credentials');
  }
});

// Get all users (Admin only)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Access denied');
  const users = await User.find({});
  res.json(users);
});

module.exports = router;
