import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";
import "../styles/Customer/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const isBusinessman = user?.role === "businessman";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">CarBhara</div>

      <div className="navbar-links">
        {isBusinessman ? (
          <>
            <Link to="/business/profile" className="nav-btn">Profile</Link>
            <Link to="/business/view-collection" className="nav-btn">My Cars</Link>
            <Link to="/business/booking-requests" className="nav-btn">Booking Requests</Link>
          </>
        ) : (
          <>
            <Link to="/customer/profile" className="nav-btn">Profile</Link>
            <Link to="/customer/view-collection" className="nav-btn">Browse Cars</Link>
            <Link to="/customer/history" className="nav-btn">My Bookings</Link>
          </>
        )}
        <button className="nav-btn logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
//emni