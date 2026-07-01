const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllAccommodations,
  getAccommodation,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation
} = require('../controllers/accommodationController');

router.get('/', getAllAccommodations);
router.get('/:id', getAccommodation);
router.post('/', auth, createAccommodation);
router.put('/:id', auth, updateAccommodation);
router.delete('/:id', auth, deleteAccommodation);

module.exports = router;
