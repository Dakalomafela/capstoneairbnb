const Reservation = require('../models/Reservation');
const Accommodation = require('../models/Accommodation');

exports.createReservation = async (req, res) => {
  try {
    const { accommodationId, checkIn, checkOut, guests, totalPrice } = req.body;
    const accommodation = await Accommodation.findByPk(accommodationId);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    const reservation = await Reservation.create({
      accommodationId,
      userId: req.user.id,
      hostId: accommodation.hostId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests,
      totalPrice
    });
    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHostReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      where: { hostId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    const isUser = reservation.userId === req.user.id;
    const isHost = reservation.hostId === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isUser && !isHost && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await reservation.destroy();
    res.json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
