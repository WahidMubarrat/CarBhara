import { useState, useEffect } from "react";
import BusinessNavbar from "../../components/BusinessNavbar";
import "../../styles/Businessman/BusinessProfile.css";
import { getUserProfile, updateUserProfile } from "../../services/userService";

const BusinessProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [user, setUser] = useState({
    fullname: "",
    companyName: "",
    email: "",
    phone: "",
    address: "",
    role: "businessman"
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
      <div className="business-layout">
        <BusinessNavbar />
        <div className="business-profile-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="business-layout">
      <BusinessNavbar />
      <div className="business-profile-container">
        <h1>Business Profile</h1>
        
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        <div className="profile-card">
          <div className="profile-header">
            <div className="company-avatar">
              {user.companyName?.[0] || "B"}
            </div>
            <h2>{user.companyName || "Your Company"}</h2>
          </div>

          <div className="profile-details">
            <div className="detail-group">
              <label>Owner Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="fullname"
                  value={user.fullname}
                  onChange={handleChange}
                  className="edit-input"
                />
              ) : (
                <p>{user.fullname}</p>
              )}
            </div>

            <div className="detail-group">
              <label>Company Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="companyName"
                  value={user.companyName}
                  onChange={handleChange}
                  className="edit-input"
                />
              ) : (
                <p>{user.companyName}</p>
              )}
            </div>

            <div className="detail-group">
              <label>Email</label>
              <p>{user.email}</p>
            </div>

            <div className="detail-group">
              <label>Phone</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  className="edit-input"
                />
              ) : (
                <p>{user.phone}</p>
              )}
            </div>

            <div className="detail-group">
              <label>Address</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={user.address}
                  onChange={handleChange}
                  className="edit-input"
                />
              ) : (
                <p>{user.address}</p>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="profile-actions">
              <button 
                className="save-profile-btn" 
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button 
                className="cancel-edit-btn" 
                onClick={handleEditToggle}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button 
              className="edit-profile-btn"
              onClick={handleEditToggle}
              disabled={loading}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;