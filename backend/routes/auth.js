const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { googleAuthRedirect, googleAuthCallback } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Google OAuth routes (server-side flow)
router.get('/google', googleAuthRedirect);
router.get('/google/callback', googleAuthCallback);

module.exports = router;
