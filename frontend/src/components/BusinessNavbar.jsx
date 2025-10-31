import { Link, useNavigate } from "react-router-dom";
import "../styles/BusinessNavbar.css";

const BusinessNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth state and redirect
    import("../services/authService").then(auth => {
      auth.logout();
      navigate("/");
    });
  };

  return (
    <nav className="business-navbar">
      <div className="business-navbar-brand">
        <span className="brand-text">CarBhara</span>
        <span className="portal-text">Business Portal</span>
      </div>

      <div className="business-navbar-links">
        <Link to="/business/profile" className="business-nav-btn">
          Profile
        </Link>
        <Link to="/business/cars" className="business-nav-btn">
          Car Collections
        </Link>
        <Link to="/business/bookings" className="business-nav-btn">
          Booking Requests
        </Link>
        <button 
          className="business-nav-btn logout-btn" 
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default BusinessNavbar;