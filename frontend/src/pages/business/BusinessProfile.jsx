import BusinessNavbar from "../../components/BusinessNavbar";
import "../../styles/BusinessProfile.css";

const BusinessProfile = () => {
  // Example business data (replace with real data from context/API)
  const businessData = {
    fullname: "John Doe",
    companyName: "Premium Cars Ltd",
    email: "john@premiumcars.com",
    phone: "+880 1234567890",
    address: "123 Business District, Dhaka",
    joinedDate: "October 2025"
  };

  return (
    <div className="business-layout">
      <BusinessNavbar />
      <div className="business-profile-container">
        <h1>Business Profile</h1>
        
        <div className="profile-card">
          <div className="profile-header">
            <div className="company-avatar">
              {businessData.companyName[0]}
            </div>
            <h2>{businessData.companyName}</h2>
          </div>

          <div className="profile-details">
            <div className="detail-group">
              <label>Owner Name</label>
              <p>{businessData.fullname}</p>
            </div>

            <div className="detail-group">
              <label>Email</label>
              <p>{businessData.email}</p>
            </div>

            <div className="detail-group">
              <label>Phone</label>
              <p>{businessData.phone}</p>
            </div>

            <div className="detail-group">
              <label>Address</label>
              <p>{businessData.address}</p>
            </div>

            <div className="detail-group">
              <label>Member Since</label>
              <p>{businessData.joinedDate}</p>
            </div>
          </div>

          <button className="edit-profile-btn">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;