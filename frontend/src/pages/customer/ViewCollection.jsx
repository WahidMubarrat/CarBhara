import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import CarCard from "../../components/CarCard";
import { getAvailableCars } from "../../services/carService";
import "../../styles/customer/ViewCollection.css";

const ViewCollection = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAvailableCars();
  }, []);

  const fetchAvailableCars = async () => {
    try {
      setLoading(true);
      const response = await getAvailableCars();
      
      if (response.success) {
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

  return (
    <div>
      <Navbar />
      <div className="customer-collection-container">
        <h1 className="page-title">Available Cars for Booking</h1>
        
        {loading && <p className="loading-message">Loading available cars...</p>}
        
        {error && <p className="error-message">{error}</p>}
        
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCollection;