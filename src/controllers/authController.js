const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const log = (message) => console.log(`[AuthController] ${new Date().toISOString()} - ${message}`);

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    log(`User registered: ${username}`);
    return res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    log(`Error registering user: ${err.message}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};