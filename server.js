require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const Listing = require('./models/Listing');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// ─── AUTH MIDDLEWARE ─────────────────────────────────────
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token, access denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ─── USER MODEL (inline for speed) ─────────────────────
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }, // 'user' or 'admin'
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// ─── AUTH ROUTES ─────────────────────────────────────────

// SIGN UP
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role: role || 'user' });
    await user.save();
    
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'your-secret-key');
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'your-secret-key');
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET CURRENT USER
app.get('/api/users/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── LISTING ROUTES ──────────────────────────────────────

app.get('/api/accommodations', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/accommodations/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/accommodations', async (req, res) => {
  try {
    const newListing = new Listing(req.body);
    const saved = await newListing.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));