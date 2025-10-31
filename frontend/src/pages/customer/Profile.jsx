import { useState, useEffect } from "react";
import "../../styles/Customer/Profile.css";
import Navbar from "../../components/Navbar";
import { getUserProfile, updateUserProfile } from "../../services/userService";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [user, setUser] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    age: "",
    role: "customer",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        setError(data.message || "Failed to load profile");
      }
    } catch (err) {
      setError("Failed to load profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setError("");
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError("");
    setSuccessMessage("");
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const data = await updateUserProfile(user);
      
      if (data.success) {
        setSuccessMessage("Profile updated successfully!");
        setIsEditing(false);
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (err) {
      setError("Failed to update profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user.email) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <h2 className="profile-heading">My Profile</h2>
        
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="profile-form">
          <label>Full Name</label>
          <input
            type="text"
            name="fullname"
            value={user.fullname}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            disabled
          />

          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>Address</label>
          <input
            type="text"
            name="address"
            value={user.address}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>Role</label>
          <input
            type="text"
            name="role"
            value={user.role}
            disabled
          />

          <div className="profile-buttons">
            {isEditing ? (
              <button 
                className="save-btn" 
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            ) : (
              <button 
                className="edit-btn" 
                onClick={handleEditToggle}
                disabled={loading}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
