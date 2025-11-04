import { useState } from "react";
import "../styles/components/CarCard.css";

const CarCard = ({ 
  car, 
  onEdit, 
  onDelete, 
  showActions = false, 
  onClick,
  onDeleteDocument,
  onBook,
  userRole
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);

  const handleCardClick = (e) => {
    // Don't open details if clicking on action buttons
    if (e.target.closest('.car-actions')) {
      return;
    }
    if (onClick) {
      onClick(car);
    } else {
      setShowDetails(!showDetails);
    }
  };

  return (
    <>
      <div className="car-card" onClick={handleCardClick}>
        <img src={car.carPicture} alt={car.carName} className="car-image" />
        <div className="car-info">
          <h3>{car.carName}</h3>
          <p><strong>Model:</strong> {car.model}</p>
          <p><strong>Driver:</strong> {car.driverName}</p>
          <p><strong>Phone:</strong> {car.driverPhone}</p>
          <p className="fare"><strong>Hourly Fare:</strong> ৳{car.hourlyFare}</p>
          <p className={`status ${car.isAvailable ? 'available' : 'unavailable'}`}>
            {car.isAvailable ? 'Available' : 'Unavailable'}
          </p>
          
          {/* Book button for customers */}
          {userRole === 'customer' && car.isAvailable && onBook && (
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                onBook(car); 
              }} 
              className="book-btn"
            >
              Book Now
            </button>
          )}
          
          {showActions && (
            <div className="car-actions">
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onEdit(car); 
                }} 
                className="edit-btn"
              >
                Edit
              </button>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onDelete(car._id); 
                }} 
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for detailed view */}
      {showDetails && (
        <div className="car-modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="car-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDetails(false)}>×</button>
            
            <h2>{car.carName} - {car.model}</h2>
            
            <div className="modal-sections">
              {/* Car Image Section */}
              <div className="modal-section">
                <h3>Car Picture</h3>
                <img src={car.carPicture} alt={car.carName} className="modal-image" />
              </div>

              {/* Driver Information */}
              <div className="modal-section">
                <h3>Driver Information</h3>
                <p><strong>Name:</strong> {car.driverName}</p>
                <p><strong>Phone:</strong> {car.driverPhone}</p>
              </div>

              {/* Car Owner Information */}
                {car.businessmanId && (
                  <div className="modal-section">
                    <h3>Car Owner</h3>
                    <p><strong>Name:</strong> {car.businessmanId.fullname}</p>
                    <p><strong>Phone:</strong> {car.businessmanId.phone}</p>
                    {car.businessmanId.address && (
                      <p><strong>Address:</strong> {car.businessmanId.address}</p>
                    )}
                  </div>
                )}              {/* Pricing */}
              <div className="modal-section">
                <h3>Pricing</h3>
                <p className="modal-fare">৳{car.hourlyFare} per hour</p>
                <p className={`status ${car.isAvailable ? 'available' : 'unavailable'}`}>
                  {car.isAvailable ? 'Available for booking' : 'Currently unavailable'}
                </p>
              </div>

              {/* Registration Paper */}
              <div className="modal-section">
                <h3>Registration Paper</h3>
                <img src={car.registrationPaper} alt="Registration" className="modal-image" />
              </div>

              {/* Driving License */}
              <div className="modal-section">
                <h3>Driver's License</h3>
                <img src={car.drivingLicense} alt="License" className="modal-image" />
              </div>

              {/* Other Documents */}
              {car.otherDocuments && car.otherDocuments.length > 0 && (
                <div className="modal-section">
                  <h3>Other Documents</h3>
                  <div className="other-docs-grid">
                    {car.otherDocuments.map((doc, index) => (
                      <div key={index} className="doc-item">
                        <img 
                          src={doc} 
                          alt={`Document ${index + 1}`} 
                          className="modal-image-small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEnlargedImage(doc);
                          }}
                        />
                        {showActions && onDeleteDocument && (
                          <button 
                            className="delete-doc-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Delete button clicked for doc:', doc);
                              console.log('Car ID:', car._id);
                              if (window.confirm("Are you sure you want to delete this document?")) {
                                console.log('Calling onDeleteDocument...');
                                onDeleteDocument(car._id, doc);
                              }
                            }}
                            title="Delete document"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div className="enlarged-image-overlay" onClick={() => setEnlargedImage(null)}>
          <button className="modal-close" onClick={() => setEnlargedImage(null)}>×</button>
          <img 
            src={enlargedImage} 
            alt="Enlarged document" 
            className="enlarged-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default CarCard;
