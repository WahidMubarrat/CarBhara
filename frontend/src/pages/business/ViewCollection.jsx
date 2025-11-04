import { useState, useEffect, useRef } from "react";
import "../../styles/Business/ViewCollection.css";
import BusinessNavbar from "../../components/BusinessNavbar";
import CarCard from "../../components/CarCard";
import { getCars, addCar, updateCar, deleteCar, deleteOtherDocument } from "../../services/carService";

const ViewCollection = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  const [formData, setFormData] = useState({
    carName: "",
    model: "",
    driverName: "",
    driverPhone: "",
    hourlyFare: ""
  });

  const carPicRef = useRef(null);
  const regPaperRef = useRef(null);
  const licenseRef = useRef(null);
  const otherDocsRef = useRef(null);

  const [previews, setPreviews] = useState({
    carPicture: null,
    registrationPaper: null,
    drivingLicense: null
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const data = await getCars();
      if (data.success) {
        setCars(data.cars);
      } else {
        setError(data.message || "Failed to load cars");
      }
    } catch (err) {
      setError("Failed to load cars. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file && type !== 'otherDocuments') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [type]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
    setError("");
    setSuccessMessage("");
  };

  const resetForm = () => {
    setFormData({
      carName: "",
      model: "",
      driverName: "",
      driverPhone: "",
      hourlyFare: ""
    });
    setPreviews({
      carPicture: null,
      registrationPaper: null,
      drivingLicense: null
    });
    if (carPicRef.current) carPicRef.current.value = '';
    if (regPaperRef.current) regPaperRef.current.value = '';
    if (licenseRef.current) licenseRef.current.value = '';
    if (otherDocsRef.current) otherDocsRef.current.value = '';
    setEditingCar(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validation
    if (!formData.carName || !formData.model || !formData.driverName || !formData.driverPhone || !formData.hourlyFare) {
      setError("Please fill all required fields");
      return;
    }

    if (!editingCar && (!carPicRef.current?.files[0] || !regPaperRef.current?.files[0] || !licenseRef.current?.files[0])) {
      setError("Car picture, registration paper, and driving license are required");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('carName', formData.carName);
    formDataToSend.append('model', formData.model);
    formDataToSend.append('driverName', formData.driverName);
    formDataToSend.append('driverPhone', formData.driverPhone);
    formDataToSend.append('hourlyFare', formData.hourlyFare);

    // Log file selections for debugging
    console.log('Files being uploaded:');
    console.log('- Car Picture:', carPicRef.current?.files[0]?.name || 'none');
    console.log('- Registration:', regPaperRef.current?.files[0]?.name || 'none');
    console.log('- License:', licenseRef.current?.files[0]?.name || 'none');
    console.log('- Other Docs:', otherDocsRef.current?.files?.length || 0);

    if (carPicRef.current?.files[0]) {
      formDataToSend.append('carPicture', carPicRef.current.files[0]);
    }
    if (regPaperRef.current?.files[0]) {
      formDataToSend.append('registrationPaper', regPaperRef.current.files[0]);
    }
    if (licenseRef.current?.files[0]) {
      formDataToSend.append('drivingLicense', licenseRef.current.files[0]);
    }
    if (otherDocsRef.current?.files) {
      Array.from(otherDocsRef.current.files).forEach(file => {
        formDataToSend.append('otherDocuments', file);
      });
    }

    try {
      setLoading(true);
      let data;
      
      if (editingCar) {
        console.log('Updating car ID:', editingCar._id);
        data = await updateCar(editingCar._id, formDataToSend);
      } else {
        console.log('Adding new car');
        data = await addCar(formDataToSend);
      }

      console.log('Server response:', data);

      if (data.success) {
        setSuccessMessage(editingCar ? "Car updated successfully!" : "Car added successfully!");
        resetForm();
        setShowAddForm(false);
        await fetchCars(); // Wait for cars to be fetched
        console.log('Cars refreshed after update');
      } else {
        setError(data.message || "Failed to save car");
      }
    } catch (err) {
      console.error('Error saving car:', err);
      setError("Failed to save car. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setFormData({
      carName: car.carName,
      model: car.model,
      driverName: car.driverName,
      driverPhone: car.driverPhone,
      hourlyFare: car.hourlyFare
    });
    setPreviews({
      carPicture: car.carPicture,
      registrationPaper: car.registrationPaper,
      drivingLicense: car.drivingLicense
    });
    setShowAddForm(true);
  };

  const handleDelete = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this car?")) {
      return;
    }

    try {
      setLoading(true);
      const data = await deleteCar(carId);
      
      if (data.success) {
        setSuccessMessage("Car deleted successfully!");
        fetchCars();
      } else {
        setError(data.message || "Failed to delete car");
      }
    } catch (err) {
      setError("Failed to delete car. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (carId, documentUrl) => {
    console.log('handleDeleteDocument called with:', { carId, documentUrl });
    try {
      setLoading(true);
      console.log('Calling deleteOtherDocument service...');
      const data = await deleteOtherDocument(carId, documentUrl);
      console.log('Delete response:', data);
      
      if (data.success) {
        setSuccessMessage("Document deleted successfully!");
        fetchCars();
      } else {
        setError(data.message || "Failed to delete document");
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError("Failed to delete document. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-collection-page">
      <BusinessNavbar />
      <div className="collection-container">
        <h2 className="collection-heading">My Car Collection</h2>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <button 
          className="add-car-btn" 
          onClick={() => { 
            if (showAddForm) {
              setShowAddForm(false);
              resetForm();
            } else {
              setShowAddForm(true);
            }
          }}
        >
          {showAddForm ? "Cancel" : "Add New Car"}
        </button>

        {showAddForm && (
          <div className="car-form-container">
            <h3>{editingCar ? "Edit Car" : "Add New Car"}</h3>
            <form onSubmit={handleSubmit} className="car-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Car Name *</label>
                  <input
                    type="text"
                    name="carName"
                    value={formData.carName}
                    onChange={handleChange}
                    placeholder="e.g., Toyota Corolla"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Model *</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="e.g., 2022"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Driver Name *</label>
                  <input
                    type="text"
                    name="driverName"
                    value={formData.driverName}
                    onChange={handleChange}
                    placeholder="Driver's full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Driver Phone *</label>
                  <input
                    type="tel"
                    name="driverPhone"
                    value={formData.driverPhone}
                    onChange={handleChange}
                    placeholder="Driver's phone number"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Hourly Fare (Taka) *</label>
                <input
                  type="number"
                  name="hourlyFare"
                  value={formData.hourlyFare}
                  onChange={handleChange}
                  placeholder="e.g., 500"
                  required
                  min="0"
                />
              </div>

              <div className="file-uploads">
                <div className="file-upload-group">
                  <label>
                    Car Picture * 
                    {editingCar && <span className="update-hint"> (Click to upload new image)</span>}
                  </label>
                  {previews.carPicture && (
                    <img src={previews.carPicture} alt="Car Preview" className="file-preview" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={carPicRef}
                    onChange={(e) => handleFileChange(e, 'carPicture')}
                    required={!editingCar}
                  />
                  {editingCar && <small className="file-hint">Leave empty to keep current image</small>}
                </div>

                <div className="file-upload-group">
                  <label>
                    Registration Paper * 
                    {editingCar && <span className="update-hint"> (Click to upload new image)</span>}
                  </label>
                  {previews.registrationPaper && (
                    <img src={previews.registrationPaper} alt="Registration Preview" className="file-preview" />
                  )}
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    ref={regPaperRef}
                    onChange={(e) => handleFileChange(e, 'registrationPaper')}
                    required={!editingCar}
                  />
                  {editingCar && <small className="file-hint">Leave empty to keep current document</small>}
                </div>

                <div className="file-upload-group">
                  <label>
                    Driving License * 
                    {editingCar && <span className="update-hint"> (Click to upload new image)</span>}
                  </label>
                  {previews.drivingLicense && (
                    <img src={previews.drivingLicense} alt="License Preview" className="file-preview" />
                  )}
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    ref={licenseRef}
                    onChange={(e) => handleFileChange(e, 'drivingLicense')}
                    required={!editingCar}
                  />
                  {editingCar && <small className="file-hint">Leave empty to keep current license</small>}
                </div>

                <div className="file-upload-group">
                  <label>Other Documents (Optional, max 5)</label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    ref={otherDocsRef}
                    onChange={(e) => handleFileChange(e, 'otherDocuments')}
                    multiple
                  />
                  <small className="file-hint">Insurance, tax token, fitness, etc. {editingCar && "New files will be added to existing ones"}</small>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Saving..." : editingCar ? "Update Car" : "Add Car"}
              </button>
            </form>
          </div>
        )}

        <div className="cars-grid">
          {loading && cars.length === 0 ? (
            <p>Loading...</p>
          ) : cars.length === 0 ? (
            <p>No cars added yet. Click "Add New Car" to get started!</p>
          ) : (
            cars.map((car) => (
              <CarCard
                key={car._id}
                car={car}
                onEdit={() => handleEdit(car)}
                onDelete={() => handleDelete(car._id)}
                onDeleteDocument={handleDeleteDocument}
                showActions={true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCollection;
