# HandGlow Candle Store

A full-stack e-commerce application for selling handmade candles.

## Project Structure
```
candle-store/
├── frontend/         # React frontend
└── backend/         # Express backend
```

## Features

- 🛍️ Product browsing and search
- 🛒 Shopping cart
- 💝 Wishlist functionality
- ⭐ Product reviews
- 👤 User authentication
- 🔐 Admin dashboard
- 💳 Payment integration (Razorpay)
- 📱 Responsive design

## Tech Stack

### Frontend
- React
- React Router
- Context API for state management
- CSS for styling
- Font Awesome icons

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT authentication
- Socket.IO for real-time updates

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Environment Variables

#### Backend (.env)
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_password
ADMIN_CODE=admin_access_code
```

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd candle-store
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Start the backend server:
```bash
cd backend
npm run dev
```

5. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Additional Setup

### Product Images
- Place product images in `frontend/public/img/`
- Or use the admin dashboard to upload images (saved to `backend/uploads/`)

### Admin Access
1. Visit `/admin/login`
2. Use the admin credentials from your .env file

## Security Notes

⚠️ Before deploying:
1. Change all default passwords and secrets
2. Set up proper environment variables
3. Never commit .env files
4. Set up proper CORS settings
5. Enable rate limiting
6. Use HTTPS in production