# Candle Store Frontend

This is a starter React frontend for the Candle Store app. It uses plain CSS (mobile-first) and a beige color palette.

Key features included in scaffold:
- Pages: Home, Shop, Product Details, Cart, Wishlist, Checkout, Login, Register, Profile, Order Tracking, Admin
- Contexts: Auth, Cart, Socket
- Socket.io client wiring for real-time updates
- Razorpay checkout stub (server side required)

Local setup
1. Copy `.env.example` to `.env` and fill values (REACT_APP_API_URL etc.)
2. npm install
3. npm start

Notes
- This scaffold assumes the backend API is running at `REACT_APP_API_URL` and follows the routes in the backend scaffold (`/api/auth`, `/api/products`, `/api/orders`, `/api/admin`).
- Razorpay requires valid key id/secret on the server and the checkout script is loaded in `public/index.html`.
- The Socket.io server URL is derived from `REACT_APP_API_URL` (removing `/api` path) — ensure CORS and socket settings match on the server.
