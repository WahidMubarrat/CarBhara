import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

// Customer pages
import Profile from "./pages/customer/Profile";
import ViewCollection from "./pages/customer/ViewCollection";
import BookingHistory from "./pages/customer/BookingHistory";

// Business pages
import BusinessProfile from "./pages/business/BusinessProfile";
import BusinessViewCollection from "./pages/business/ViewCollection";
import BusinessBookingHistory from "./pages/business/BusinessBookingHistory";

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
        path="/customer/view-collection" 
        element={
          <ProtectedRoute allowedRole="customer">
            <ViewCollection />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/history" 
        element={
          <ProtectedRoute allowedRole="customer">
            <BookingHistory />
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
        path="/business/view-collection" 
        element={
          <ProtectedRoute allowedRole="businessman">
            <BusinessViewCollection />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/business/booking-history" 
        element={
          <ProtectedRoute allowedRole="businessman">
            <BusinessBookingHistory />
          </ProtectedRoute>
        } 
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
