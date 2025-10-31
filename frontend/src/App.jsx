import { Routes, Route } from "react-router-dom";

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
      <Route path="/customer/profile" element={<Profile />} />
      <Route path="/customer/collection" element={<ViewCollection />} />
      <Route path="/customer/booking" element={<MakeBooking />} />
      <Route path="/customer/recharge" element={<Recharge />} />

      {/* Business routes */}
      <Route path="/business/profile" element={<BusinessProfile />} />
      <Route path="/business/cars" element={<BusinessCars />} />
      <Route path="/business/bookings" element={<BusinessBookings />} />
    </Routes>
  );
}

export default App;
