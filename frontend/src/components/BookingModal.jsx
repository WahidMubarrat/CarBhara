import { useState } from 'react';
import '../styles/components/BookingModal.css';

function BookingModal({ car, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    startLocation: '',
    endLocation: '',
    startDateTime: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.startLocation.trim()) {
      setError('Please enter start location');
      return;
    }
    if (!formData.endLocation.trim()) {
      setError('Please enter end location');
      return;
    }
    if (!formData.startDateTime) {
      setError('Please select date and time');
      return;
    }

    // Check if date is in future
    const selectedDate = new Date(formData.startDateTime);
    const now = new Date();
    if (selectedDate <= now) {
      setError('Please select a future date and time');
      return;
    }

    setLoading(true);
    const success = await onSubmit({
      carId: car._id,
      ...formData
    });

    setLoading(false);
    if (success) {
      onClose();
    } else {
      setError('Failed to create booking. Please try again.');
    }
  };

  // Get minimum datetime (current time + 1 hour)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <h2>Book {car.carName}</h2>
        <div className="car-quick-info">
          <img src={car.carPicture} alt={car.carName} />
          <div>
            <p className="model">{car.model}</p>
            <p className="fare">₹{car.hourlyFare}/hour</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="startLocation">
              <i className="location-icon">📍</i> Pickup Location
            </label>
            <input
              type="text"
              id="startLocation"
              name="startLocation"
              value={formData.startLocation}
              onChange={handleChange}
              placeholder="Enter your pickup location"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endLocation">
              <i className="location-icon">🎯</i> Drop Location
            </label>
            <input
              type="text"
              id="endLocation"
              name="endLocation"
              value={formData.endLocation}
              onChange={handleChange}
              placeholder="Enter your destination"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="startDateTime">
              <i className="time-icon">🕒</i> Pickup Date & Time
            </label>
            <input
              type="datetime-local"
              id="startDateTime"
              name="startDateTime"
              value={formData.startDateTime}
              onChange={handleChange}
              min={getMinDateTime()}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Sending Request...' : 'Request Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingModal;
