import BusinessNavbar from "../../components/BusinessNavbar";
import "../../styles/Businessman/BusinessCars.css";

const BusinessCars = () => {
  // Example car collection data (replace with real data from API)
  const cars = [
    {
      id: 1,
      model: "Toyota Camry",
      year: 2024,
      plateNumber: "DHK-123",
      rate: 5000,
      status: "available"
    },
    {
      id: 2,
      model: "Honda Civic",
      year: 2023,
      plateNumber: "DHK-456",
      rate: 4500,
      status: "booked"
    }
  ];

  return (
    <div className="business-layout">
      <BusinessNavbar />
      <div className="cars-container">
        <div className="cars-header">
          <h1>Car Collection</h1>
          <button className="add-car-btn">
            Add New Car
          </button>
        </div>

        <div className="cars-grid">
          {cars.map(car => (
            <div key={car.id} className="car-card">
              <div className="car-image-placeholder">
                {/* Replace with actual image */}
                <div className="placeholder-text">{car.model}</div>
              </div>
              
              <div className="car-details">
                <h3>{car.model} ({car.year})</h3>
                <p className="plate-number">Plate: {car.plateNumber}</p>
                <p className="rate">Rate: ৳{car.rate}/day</p>
                <div className={`status-badge ${car.status}`}>
                  {car.status}
                </div>
              </div>

              <div className="car-actions">
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessCars;