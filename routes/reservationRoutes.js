const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createReservation,
  getUserReservations,
  getHostReservations,
  deleteReservation
} = require('../controllers/reservationController');

router.post('/', auth, createReservation);
router.get('/user', auth, getUserReservations);
router.get('/host', auth, getHostReservations);
router.delete('/:id', auth, deleteReservation);

module.exports = router;
