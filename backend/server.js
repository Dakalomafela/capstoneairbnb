require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const accommodationRoutes = require('./routes/accommodationRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();
connectDB();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  ...(process.env.FRONTEND_URL || '').split(',').map((url) => url.trim()).filter(Boolean),
];

app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
}));
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.json({
    message: 'Airbnb Backend API is running',
    status: 'OK',
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use('/api/users', userRoutes);
app.use('/api/accommodations', accommodationRoutes);
app.use('/api/reservations', reservationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const cors = require('cors');

app.use(cors({
  origin: ['https://dakaloxm.netlify.app', 'http://localhost:5173'],
  credentials: true
}));