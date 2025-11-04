import { Link } from "react-router-dom";
import "../styles/LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="landing-overlay">
        <h1 className="landing-title">Welcome to CarBhara</h1>
        <p className="landing-subtitle">Your trusted platform for car rentals</p>
        <div className="button-group">
          <Link to="/signup">
            <button className="landing-btn">Sign Up</button>
          </Link>
          <Link to="/signin">
            <button className="landing-btn">Sign In</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
