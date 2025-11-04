import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import "../styles/Business/BusinessNavbar.css";

const BusinessNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
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
        <Link to="/business/view-collection" className="business-nav-btn">
          My Cars
        </Link>
        <Link to="/business/booking-history" className="business-nav-btn">
          Bookings
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