const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Hardcoded admin — works immediately, no database needed
const ADMIN = {
  email: 'mafelainnocent@gmail.com',
  password: 'admin123'
};

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email !== ADMIN.email || password !== ADMIN.password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  const token = jwt.sign(
    { email, role: 'admin' }, 
    process.env.JWT_SECRET || 'secret-key', 
    { expiresIn: '24h' }
  );
  
  res.json({ token });
});

module.exports = router;