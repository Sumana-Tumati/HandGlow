const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { google } = require('googleapis');
const crypto = require('crypto');

// Create JWT
const createToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Please provide all fields' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password });
    const token = createToken(user);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, adminCode } = req.body;
    const user = await User.findOne({ email });
    
    // If trying to log in as admin (adminCode provided)
    if (adminCode) {
      // Verify admin credentials from .env
      if (email !== process.env.ADMIN_EMAIL || 
          password !== process.env.ADMIN_PASSWORD || 
          adminCode !== process.env.ADMIN_CODE) {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }

      // Create admin user if doesn't exist
      if (!user) {
        const adminUser = await User.create({
          email,
          password,
          name: req.body.name || email.split('@')[0],
          phone: req.body.phone,
          role: 'admin'
        });
        const token = createToken(adminUser);
        return res.json({ 
          token, 
          user: { 
            id: adminUser._id, 
            name: adminUser.name, 
            email: adminUser.email, 
            role: adminUser.role 
          } 
        });
      }

      // Existing user must be admin
      if (user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized as admin' });
      }
    }

    // Regular user login (no adminCode)
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = createToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('wishlist').populate('cart.product');
    res.json(user);
  } catch (err) { next(err); }
};

// Server-side Google OAuth redirect
exports.googleAuthRedirect = async (req, res, next) => {
  try {
    const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/google/callback`;
    const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, redirectUri);
    const scopes = ['profile', 'email'];
    const url = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: scopes });
    res.redirect(url);
  } catch (err) { next(err); }
};

// Google OAuth callback: exchange code, get profile, create/find user, issue JWT and redirect to client with token
exports.googleAuthCallback = async (req, res, next) => {
  try {
    const code = req.query.code;
    const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/google/callback`;
    const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, redirectUri);
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
    const { data } = await oauth2.userinfo.get();
    if (!data || !data.email) return res.status(400).send('Unable to fetch Google user');

    let user = await User.findOne({ email: data.email });
    if (!user) {
      // create user with a random password
      const randomPassword = crypto.randomBytes(16).toString('hex');
      user = await User.create({ name: data.name || data.email.split('@')[0], email: data.email, password: randomPassword });
    }
    const token = createToken(user);
    // Redirect to client with token in query (client should handle storing it)
    const clientUrl = process.env.CLIENT_URL || (req.get('origin') || `${req.protocol}://${req.get('host')}`);
    const redirectTo = `${clientUrl}/?token=${token}`;
    res.redirect(redirectTo);
  } catch (err) { next(err); }
};
