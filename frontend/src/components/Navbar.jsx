import { Link, useNavigate } from "react-router-dom";
import "../styles/Customer/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth state and redirect
    import("../services/authService").then(auth => {
      auth.logout();
      navigate("/");
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">CarBhara</div>

      <div className="navbar-links">
        <Link to="/customer/profile" className="nav-btn">Profile</Link>
        <Link to="/customer/collection" className="nav-btn">View Collection</Link>
        <Link to="/customer/booking" className="nav-btn">Make Booking</Link>
        <Link to="/customer/recharge" className="nav-btn">Recharge</Link>
        <button className="nav-btn logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
