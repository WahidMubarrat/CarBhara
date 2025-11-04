import { useState, useEffect, useRef } from "react";
import BusinessNavbar from "../../components/BusinessNavbar";
import ChangePassword from "../../components/ChangePassword";
import "../../styles/Business/BusinessProfile.css";
import { getUserProfile, updateUserProfile } from "../../services/userService";

const BusinessProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [user, setUser] = useState({
    fullname: "",
    companyName: "",
    email: "",
    phone: "",
    address: "",
    role: "businessman",
    profilePicture: ""
  });
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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

      const formData = new FormData();
      formData.append('fullname', user.fullname);
      formData.append('phone', user.phone);
      formData.append('address', user.address);
      formData.append('companyName', user.companyName);

      if (fileInputRef.current?.files[0]) {
        formData.append('profilePicture', fileInputRef.current.files[0]);
      }

      const data = await updateUserProfile(formData);
      
      if (data.success) {
        setSuccessMessage("Profile updated successfully!");
        setIsEditing(false);
        setImagePreview(null);
        // Refresh profile to get updated image URL
        fetchUserProfile();
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (err) {
      setError("Failed to update profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChangeSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 5000);
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
            <div className="profile-picture-section">
              <img 
                src={imagePreview || user.profilePicture || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSIzNiIgcj0iMjAiIGZpbGw9IiNmNmM5MGUiLz48cGF0aCBkPSJNMTUgODVjMC0xOS4zMyAxNS42Ny0zNSAzNS0zNXMzNSAxNS42NyAzNSAzNSIgZmlsbD0iI2Y2YzkwZSIvPjwvc3ZnPg=='} 
                alt="Profile" 
                className="business-profile-picture"
              />
              {isEditing && (
                <div className="profile-picture-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                  />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="upload-btn"
                  >
                    Change Picture
                  </button>
                </div>
              )}
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
            <div className="profile-actions">
              <button 
                className="edit-profile-btn"
                onClick={handleEditToggle}
                disabled={loading}
              >
                Edit Profile
              </button>
              <button 
                className="password-change-btn"
                onClick={() => setShowPasswordModal(true)}
                disabled={loading}
              >
                Change Password
              </button>
            </div>
          )}
        </div>

        {showPasswordModal && (
          <ChangePassword 
            onClose={() => setShowPasswordModal(false)}
            onSuccess={handlePasswordChangeSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default BusinessProfile;