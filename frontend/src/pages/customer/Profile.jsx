import { useState, useEffect, useRef } from "react";
import "../../styles/Customer/Profile.css";
import Navbar from "../../components/Navbar";
import ChangePassword from "../../components/ChangePassword";
import { getUserProfile, updateUserProfile } from "../../services/userService";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [user, setUser] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    age: "",
    role: "customer",
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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError("");
    setSuccessMessage("");
    setImagePreview(null);
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

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const formData = new FormData();
      formData.append('fullname', user.fullname);
      formData.append('phone', user.phone);
      formData.append('address', user.address);
      formData.append('age', user.age);

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
          <div className="profile-picture-section">
            <img 
              src={imagePreview || user.profilePicture || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSIzNiIgcj0iMjAiIGZpbGw9IiNmNmM5MGUiLz48cGF0aCBkPSJNMTUgODVjMC0xOS4zMyAxNS42Ny0zNSAzNS0zNXMzNSAxNS42NyAzNSAzNSIgZmlsbD0iI2Y2YzkwZSIvPjwvc3ZnPg=='} 
              alt="Profile" 
              className="profile-picture"
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
                  onClick={() => fileInputRef.current.click()}
                  className="upload-btn"
                >
                  Change Picture
                </button>
              </div>
            )}
          </div>

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
              <>
                <button 
                  className="edit-btn" 
                  onClick={handleEditToggle}
                  disabled={loading}
                >
                  Edit Profile
                </button>
                <button 
                  className="password-btn" 
                  onClick={() => setShowPasswordModal(true)}
                  disabled={loading}
                >
                  Change Password
                </button>
              </>
            )}
          </div>
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

export default Profile;
