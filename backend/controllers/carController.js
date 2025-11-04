import Car from "../models/Car.js";
import { uploadImage } from "../config/cloudinary.js";

// @desc Add a new car to businessman's collection
export const addCar = async (req, res) => {
  try {
    const { id: businessmanId, role } = req.user;

    // Only businessmen can add cars
    if (role !== 'businessman') {
      return res.status(403).json({ 
        success: false, 
        message: "Only businessmen can add cars" 
      });
    }

    const { carName, model, driverName, driverPhone, hourlyFare } = req.body;

    // Validate required fields
    if (!carName || !model || !driverName || !driverPhone || !hourlyFare) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    // Validate required files
    if (!req.files || !req.files.carPicture || !req.files.registrationPaper || !req.files.drivingLicense) {
      return res.status(400).json({
        success: false,
        message: "Car picture, registration paper, and driving license are required"
      });
    }

    // Upload images to Cloudinary
    try {
      // Car Picture
      const carPicBuffer = req.files.carPicture[0].buffer.toString('base64');
      const carPicDataURI = `data:${req.files.carPicture[0].mimetype};base64,${carPicBuffer}`;
      const carPictureUrl = await uploadImage(carPicDataURI, 'car-images');

      // Registration Paper
      const regPaperBuffer = req.files.registrationPaper[0].buffer.toString('base64');
      const regPaperDataURI = `data:${req.files.registrationPaper[0].mimetype};base64,${regPaperBuffer}`;
      const registrationPaperUrl = await uploadImage(regPaperDataURI, 'registration-papers');

      // Driving License
      const licenseBuffer = req.files.drivingLicense[0].buffer.toString('base64');
      const licenseDataURI = `data:${req.files.drivingLicense[0].mimetype};base64,${licenseBuffer}`;
      const drivingLicenseUrl = await uploadImage(licenseDataURI, 'driving-licenses');

      // Other Documents (optional)
      let otherDocumentsUrls = [];
      if (req.files.otherDocuments) {
        for (const file of req.files.otherDocuments) {
          const docBuffer = file.buffer.toString('base64');
          const docDataURI = `data:${file.mimetype};base64,${docBuffer}`;
          const docUrl = await uploadImage(docDataURI, 'other-documents');
          otherDocumentsUrls.push(docUrl);
        }
      }

      // Create car
      const car = await Car.create({
        businessmanId,
        carName,
        model,
        carPicture: carPictureUrl,
        registrationPaper: registrationPaperUrl,
        driverName,
        driverPhone,
        drivingLicense: drivingLicenseUrl,
        otherDocuments: otherDocumentsUrls,
        hourlyFare: Number(hourlyFare)
      });

      res.status(201).json({
        success: true,
        message: "Car added successfully",
        car
      });

    } catch (uploadError) {
      console.error("Error uploading files:", uploadError);
      return res.status(400).json({
        success: false,
        message: "Failed to upload files"
      });
    }

  } catch (error) {
    console.error("Error adding car:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to add car"
    });
  }
};

// @desc Get all cars for a businessman
export const getCars = async (req, res) => {
  try {
    const { id: businessmanId, role } = req.user;

    if (role !== 'businessman') {
      return res.status(403).json({ 
        success: false, 
        message: "Only businessmen can view their car collection" 
      });
    }

    const cars = await Car.find({ businessmanId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      cars
    });

  } catch (error) {
    console.error("Error fetching cars:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cars"
    });
  }
};

// @desc Update a car
export const updateCar = async (req, res) => {
  try {
    const { id: businessmanId, role } = req.user;
    const { carId } = req.params;

    console.log('=== UPDATE CAR REQUEST ===');
    console.log('Car ID:', carId);
    console.log('Businessman ID:', businessmanId);
    console.log('Body fields:', Object.keys(req.body));
    console.log('Files:', req.files ? Object.keys(req.files) : 'none');

    if (role !== 'businessman') {
      return res.status(403).json({ 
        success: false, 
        message: "Only businessmen can update cars" 
      });
    }

    const car = await Car.findOne({ _id: carId, businessmanId });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found"
      });
    }

    console.log('Current car data:', {
      carName: car.carName,
      model: car.model,
      carPicture: car.carPicture.substring(0, 50) + '...'
    });

    const { carName, model, driverName, driverPhone, hourlyFare, isAvailable } = req.body;

    // Update basic fields
    const updateData = {
      ...(carName && { carName }),
      ...(model && { model }),
      ...(driverName && { driverName }),
      ...(driverPhone && { driverPhone }),
      ...(hourlyFare && { hourlyFare: Number(hourlyFare) }),
      ...(isAvailable !== undefined && { isAvailable: Boolean(isAvailable) })
    };

    // Handle file uploads if provided
    if (req.files) {
      try {
        if (req.files.carPicture) {
          console.log('Uploading new car picture...');
          const carPicBuffer = req.files.carPicture[0].buffer.toString('base64');
          const carPicDataURI = `data:${req.files.carPicture[0].mimetype};base64,${carPicBuffer}`;
          updateData.carPicture = await uploadImage(carPicDataURI, 'car-images');
          console.log('New car picture URL:', updateData.carPicture.substring(0, 50) + '...');
        }

        if (req.files.registrationPaper) {
          console.log('Uploading new registration paper...');
          const regPaperBuffer = req.files.registrationPaper[0].buffer.toString('base64');
          const regPaperDataURI = `data:${req.files.registrationPaper[0].mimetype};base64,${regPaperBuffer}`;
          updateData.registrationPaper = await uploadImage(regPaperDataURI, 'registration-papers');
          console.log('New registration URL uploaded');
        }

        if (req.files.drivingLicense) {
          console.log('Uploading new driving license...');
          const licenseBuffer = req.files.drivingLicense[0].buffer.toString('base64');
          const licenseDataURI = `data:${req.files.drivingLicense[0].mimetype};base64,${licenseBuffer}`;
          updateData.drivingLicense = await uploadImage(licenseDataURI, 'driving-licenses');
          console.log('New license URL uploaded');
        }

        if (req.files.otherDocuments) {
          console.log('Uploading', req.files.otherDocuments.length, 'other documents...');
          let otherDocumentsUrls = [...car.otherDocuments];
          for (const file of req.files.otherDocuments) {
            const docBuffer = file.buffer.toString('base64');
            const docDataURI = `data:${file.mimetype};base64,${docBuffer}`;
            const docUrl = await uploadImage(docDataURI, 'other-documents');
            otherDocumentsUrls.push(docUrl);
          }
          updateData.otherDocuments = otherDocumentsUrls;
          console.log('Total other documents after update:', otherDocumentsUrls.length);
        }
      } catch (uploadError) {
        console.error("Error uploading files:", uploadError);
        return res.status(400).json({
          success: false,
          message: "Failed to upload files"
        });
      }
    }

    console.log('Update data fields:', Object.keys(updateData));

    const updatedCar = await Car.findByIdAndUpdate(
      carId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    console.log('Car updated successfully. New data:', {
      carName: updatedCar.carName,
      model: updatedCar.model,
      carPicture: updatedCar.carPicture.substring(0, 50) + '...'
    });

    res.json({
      success: true,
      message: "Car updated successfully",
      car: updatedCar
    });

  } catch (error) {
    console.error("Error updating car:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update car"
    });
  }
};

// @desc Delete a car
export const deleteCar = async (req, res) => {
  try {
    const { id: businessmanId, role } = req.user;
    const { carId } = req.params;

    if (role !== 'businessman') {
      return res.status(403).json({ 
        success: false, 
        message: "Only businessmen can delete cars" 
      });
    }

    const car = await Car.findOneAndDelete({ _id: carId, businessmanId });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found"
      });
    }

    res.json({
      success: true,
      message: "Car deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting car:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete car"
    });
  }
};

// @desc Get all available cars (for customers to browse)
export const getAvailableCars = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== 'customer') {
      return res.status(403).json({ 
        success: false, 
        message: "Only customers can browse available cars" 
      });
    }

    const cars = await Car.find({ isAvailable: true })
      .populate('businessmanId', 'fullname phone email address')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      cars
    });

  } catch (error) {
    console.error("Error fetching available cars:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch available cars"
    });
  }
};

// @desc Delete a specific other document from car
export const deleteOtherDocument = async (req, res) => {
  try {
    console.log('=== DELETE OTHER DOCUMENT REQUEST ===');
    console.log('Request body:', req.body);
    
    const { id: businessmanId, role } = req.user;
    const { carId, documentUrl } = req.body;

    console.log('User ID:', businessmanId);
    console.log('User role:', role);
    console.log('Car ID from request:', carId);
    console.log('Document URL to delete:', documentUrl);

    if (role !== 'businessman') {
      return res.status(403).json({ 
        success: false, 
        message: "Only businessmen can delete documents" 
      });
    }

    const car = await Car.findOne({ _id: carId, businessmanId });

    if (!car) {
      console.log('Car not found for businessman');
      return res.status(404).json({
        success: false,
        message: "Car not found"
      });
    }

    console.log('Current other documents:', car.otherDocuments);

    // Remove the document URL from the array
    const updatedDocuments = car.otherDocuments.filter(doc => doc !== documentUrl);

    console.log('Updated documents after filter:', updatedDocuments);
    console.log('Original count:', car.otherDocuments.length, 'New count:', updatedDocuments.length);

    if (updatedDocuments.length === car.otherDocuments.length) {
      console.log('Document URL not found in array');
      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    car.otherDocuments = updatedDocuments;
    await car.save();

    console.log('Document deleted successfully');

    res.json({
      success: true,
      message: "Document deleted successfully",
      car
    });

  } catch (error) {
    console.error("Error deleting document:", error.message);
    console.error("Full error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete document"
    });
  }
};
