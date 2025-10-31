import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

// Customer pages
import Profile from "./pages/customer/Profile";
import ViewCollection from "./pages/customer/ViewCollection";
import MakeBooking from "./pages/customer/MakeBooking";
import Recharge from "./pages/customer/Recharge";

// Business pages
import BusinessProfile from "./pages/business/BusinessProfile";
import BusinessCars from "./pages/business/BusinessCars";
import BusinessBookings from "./pages/business/BusinessBookings";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Customer routes */}
      <Route 
        path="/customer/profile" 
        element={
          <ProtectedRoute allowedRole="customer">
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/collection" 
        element={
          <ProtectedRoute allowedRole="customer">
            <ViewCollection />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/booking" 
        element={
          <ProtectedRoute allowedRole="customer">
            <MakeBooking />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/recharge" 
        element={
          <ProtectedRoute allowedRole="customer">
            <Recharge />
          </ProtectedRoute>
        } 
      />

      {/* Business routes */}
      <Route 
        path="/business/profile" 
        element={
          <ProtectedRoute allowedRole="businessman">
            <BusinessProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/business/cars" 
        element={
          <ProtectedRoute allowedRole="businessman">
            <BusinessCars />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/business/bookings" 
        element={
          <ProtectedRoute allowedRole="businessman">
            <BusinessBookings />
          </ProtectedRoute>
        } 
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
