const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
// POST /api/auth/register → create new account

router.post('/login', login);
// POST /api/auth/login → get token

router.get('/profile', protect, getProfile);
// GET /api/auth/profile → get logged-in user's profile
// protect runs first → verifies token → then getProfile runs

router.put('/profile', protect, updateProfile);
// PUT /api/auth/profile → update name/avatar

module.exports = router;
