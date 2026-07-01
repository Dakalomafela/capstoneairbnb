const Accommodation = require('../models/Accommodation');
const User = require('../models/User');

exports.getAllAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.findAll({ order: [['createdAt', 'DESC']] });
    res.json(accommodations);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching accommodations' });
  }
};

exports.getAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findByPk(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    res.json(accommodation);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching accommodation' });
  }
};

exports.createAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.create({ ...req.body, hostId: req.user.id });
    res.status(201).json(accommodation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateAccommodation = async (req, res) => {
  try {
    let accommodation = await Accommodation.findByPk(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    if (accommodation.hostId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await accommodation.update(req.body);
    res.json(accommodation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findByPk(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    if (accommodation.hostId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await accommodation.destroy();
    res.json({ message: 'Accommodation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
