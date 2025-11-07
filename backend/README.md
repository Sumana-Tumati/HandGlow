# Candle Store Backend

This is the Express + MongoDB backend for the Candle Store e-commerce app.

Key features:
- JWT auth
- Product, Cart, Order models
- Razorpay integration (create order, verify signature)
- Socket.io for real-time order updates
- Admin routes for product and order management

Environment variables (.env):
- MONGO_URI
- JWT_SECRET
- RAZORPAY_KEY_ID
- RAZORPAY_KEY_SECRET
- CLIENT_URL
- PORT

Run locally:
1. Copy `.env.example` to `.env` and fill values.
2. npm install
3. npm run dev

Notes:
- Image uploads are saved locally to `uploads/` (for dev). In production, replace with cloud storage.
- Socket.io room design: frontend should emit `join` with the logged-in user's id to receive order updates.
