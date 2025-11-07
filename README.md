# 🚗 CarBhara - Car Rental Platform

A full-stack MERN application for car rental services, connecting customers with business owners who provide rental vehicles.

## ✨ Features

### For Customers
- 🔐 User authentication (Sign up/Sign in)
- 👤 Profile management with image upload
- 🚙 Browse available cars
- 📅 Book cars with date/time selection
- 📊 View booking history
- 🔒 Change password securely

### For Business Owners
- 🏢 Business profile management
- ➕ Add/Edit/Delete car listings
- 📸 Upload car images (Cloudinary integration)
- 📋 View all bookings for their cars
- 📈 Booking analytics and history
- ✅ Manage booking status

### General
- 🎨 Modern UI with green (customer) and gold (business) themes
- 📱 Responsive design for all devices
- 🔒 Secure JWT authentication
- ☁️ Cloud-based image storage

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **React Router DOM 7** - Navigation
- **Vite 7** - Build tool
- **Recharts** - Data visualization
- **CSS3** - Styling with gradients and animations

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - Database
- **Mongoose 8** - ODM
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
CarBhara/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   │   ├── Businessman.js
│   │   ├── Customer.js
│   │   ├── Car.js
│   │   └── Booking.js
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── CarCard.jsx
│   │   │   └── ChangePassword.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── SignIn.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── customer/
│   │   │   └── business/
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── userService.js
│   │   │   ├── carService.js
│   │   │   └── bookingService.js
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   └── vite.config.js
├── DEPLOYMENT.md
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/WahidMubarrat/CarBhara.git
   cd CarBhara
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create `.env` file:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

   Start backend:
   ```bash
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

   Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

   Start frontend:
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions on Render.

### Quick Deploy Summary
- **Backend**: Render Web Service
- **Frontend**: Render Static Site
- **Database**: MongoDB Atlas
- **Images**: Cloudinary

## 🎨 Design Features

- **Dual Theme System**:
  - Customer side: Fresh green gradient (#28a745 → #20c997)
  - Business side: Professional gold gradient (#ffd700 → #ffed4e)
- **Smooth Animations**: Slide-ins, hover effects, transitions
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Glassmorphism, gradients, shadows

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected API routes with middleware
- CORS configuration
- Input validation
- Secure file uploads

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/change-password` - Change password

### Cars (Business)
- `GET /api/cars` - Get business owner's cars
- `POST /api/cars` - Add new car
- `PUT /api/cars/:id` - Update car
- `DELETE /api/cars/:id` - Delete car
- `GET /api/cars/available` - Get available cars (Customer)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/customer` - Get customer bookings
- `GET /api/bookings/businessman` - Get business bookings
- `PUT /api/bookings/:id/status` - Update booking status

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Wahid Mubarrat**
- GitHub: [@WahidMubarrat](https://github.com/WahidMubarrat)

## 🙏 Acknowledgments

- React team for the amazing library
- MongoDB for the robust database
- Cloudinary for image hosting
- Render for free hosting platform

---

Made with ❤️ by Wahid Mubarrat
