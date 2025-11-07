require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { initSocket } = require('./utils/socket');
const path = require('path');
const fs = require('fs');

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlist');

const app = express();
const server = http.createServer(app);

// Ensure uploads folder exists for multer
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(morgan('dev'));

// Connect DB
connectDB();

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);

// health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Error handler (simple)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

// Socket.io
const io = initSocket(server, { cors: { origin: process.env.CLIENT_URL || '*' } });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, server, io };
