import BusinessNavbar from "../../components/BusinessNavbar";
import "../../styles/BusinessBookings.css";

const BusinessBookings = () => {
  // Example booking requests (replace with real data from API)
  const bookings = [
    {
      id: "BK001",
      carModel: "Toyota Camry",
      customerName: "Sarah Ahmed",
      startDate: "2025-11-01",
      endDate: "2025-11-03",
      status: "pending",
      total: 15000
    },
    {
      id: "BK002",
      carModel: "Honda Civic",
      customerName: "Karim Rahman",
      startDate: "2025-11-05",
      endDate: "2025-11-06",
      status: "approved",
      total: 9000
    }
  ];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  return (
    <div className="business-layout">
      <BusinessNavbar />
      <div className="bookings-container">
        <h1>Booking Requests</h1>

        <div className="bookings-grid">
          {bookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <h3>Booking #{booking.id}</h3>
                <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              <div className="booking-details">
                <div className="detail-row">
                  <label>Car:</label>
                  <span>{booking.carModel}</span>
                </div>
                
                <div className="detail-row">
                  <label>Customer:</label>
                  <span>{booking.customerName}</span>
                </div>

                <div className="detail-row">
                  <label>Duration:</label>
                  <span>{booking.startDate} to {booking.endDate}</span>
                </div>

                <div className="detail-row">
                  <label>Total:</label>
                  <span className="total-amount">৳{booking.total}</span>
                </div>
              </div>

              {booking.status === 'pending' && (
                <div className="booking-actions">
                  <button className="approve-btn">Approve</button>
                  <button className="reject-btn">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessBookings;