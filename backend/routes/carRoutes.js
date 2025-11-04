import express from "express";
import { addCar, getCars, updateCar, deleteCar, getAvailableCars, deleteOtherDocument } from "../controllers/carController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Customer route - get all available cars
router.get("/available", protect, getAvailableCars);

// Delete other document
router.delete("/document", protect, deleteOtherDocument);

// Car routes (protected - businessman only)
router.post(
  "/", 
  protect, 
  upload.fields([
    { name: 'carPicture', maxCount: 1 },
    { name: 'registrationPaper', maxCount: 1 },
    { name: 'drivingLicense', maxCount: 1 },
    { name: 'otherDocuments', maxCount: 5 }
  ]), 
  addCar
);

router.get("/", protect, getCars);

router.put(
  "/:carId", 
  protect, 
  upload.fields([
    { name: 'carPicture', maxCount: 1 },
    { name: 'registrationPaper', maxCount: 1 },
    { name: 'drivingLicense', maxCount: 1 },
    { name: 'otherDocuments', maxCount: 5 }
  ]), 
  updateCar
);

router.delete("/:carId", protect, deleteCar);

export default router;
