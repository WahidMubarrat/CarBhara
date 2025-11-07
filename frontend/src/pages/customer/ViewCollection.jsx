import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import CarCard from "../../components/CarCard";
import BookingModal from "../../components/BookingModal";
import { getAvailableCars } from "../../services/carService";
import { createBooking } from "../../services/bookingService";
import "../../styles/Customer/ViewCollection.css";

const ViewCollection = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchAvailableCars();
  }, []);

  const fetchAvailableCars = async () => {
    try {
      setLoading(true);
      const response = await getAvailableCars();
      
      if (response.success) {
        console.log("Cars from backend:", response.cars);
        console.log("First car businessmanId:", response.cars[0]?.businessmanId);
        setCars(response.cars);
        setError("");
      } else {
        setError(response.message || "Failed to fetch cars");
      }
    } catch (err) {
      console.error("Error fetching cars:", err);
      setError(`Failed to load available cars: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBookCar = (car) => {
    setSelectedCar(car);
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      const response = await createBooking(bookingData);
      
      if (response.success) {
        setSuccessMessage("Booking request sent successfully! Check 'My Bookings' to track status.");
        setTimeout(() => setSuccessMessage(""), 5000);
        return true;
      } else {
        setError(response.message || "Failed to create booking");
        setTimeout(() => setError(""), 5000);
        return false;
      }
    } catch (err) {
      console.error("Error creating booking:", err);
      setError("Failed to create booking. Please try again.");
      setTimeout(() => setError(""), 5000);
      return false;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="customer-collection-container">
        <h1 className="page-title">Available Cars for Booking</h1>
        
        {loading && <p className="loading-message">Loading available cars...</p>}
        
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        
        {!loading && !error && cars.length === 0 && (
          <p className="no-cars-message">No cars available at the moment. Please check back later!</p>
        )}
        
        {!loading && !error && cars.length > 0 && (
          <div className="cars-grid">
            {cars.map((car) => (
              <CarCard
                key={car._id}
                car={car}
                showActions={false}
                userRole="customer"
                onBook={handleBookCar}
              />
            ))}
          </div>
        )}
      </div>

      {selectedCar && (
        <BookingModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
          onSubmit={handleBookingSubmit}
        />
      )}
    </div>
  );
};

export default ViewCollection;