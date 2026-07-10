const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { login, register, getMe } = require('../controllers/userController');

router.post('/login', login);
router.post('/register', register);
router.get('/me', auth, getMe);

module.exports = router;
