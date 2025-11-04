import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

// @desc Create a new booking
// @route POST /api/bookings
// @access Private (Customer only)
export const createBooking = async (req, res) => {
  try {
    const { id: customerId, role } = req.user;

    if (role !== 'customer') {
      return res.status(403).json({
        success: false,
        message: "Only customers can create bookings"
      });
    }

    const { carId, startLocation, endLocation, startDateTime } = req.body;

    // Validate required fields
    if (!carId || !startLocation || !endLocation || !startDateTime) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    // Check if car exists and is available
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found"
      });
    }

    if (!car.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "This car is not currently available"
      });
    }

    // Validate date is in future
    const bookingDate = new Date(startDateTime);
    if (bookingDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Booking date must be in the future"
      });
    }

    // Create booking
    const booking = await Booking.create({
      customerId,
      businessmanId: car.businessmanId,
      carId,
      startLocation,
      endLocation,
      startDateTime: bookingDate,
      status: "pending"
    });

    // Populate booking details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('carId', 'carName model carPicture hourlyFare')
      .populate('customerId', 'fullname phone email')
      .populate('businessmanId', 'fullname phone email address');

    res.status(201).json({
      success: true,
      message: "Booking request sent successfully",
      booking: populatedBooking
    });

  } catch (error) {
    console.error("Error creating booking:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create booking"
    });
  }
};

// @desc Get all bookings for a customer
// @route GET /api/bookings/customer
// @access Private (Customer only)
export const getCustomerBookings = async (req, res) => {
  try {
    const { id: customerId, role } = req.user;

    if (role !== 'customer') {
      return res.status(403).json({
        success: false,
        message: "Only customers can view their bookings"
      });
    }

    const bookings = await Booking.find({ customerId })
      .populate('carId', 'carName model carPicture hourlyFare')
      .populate('businessmanId', 'fullname phone email address')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings
    });

  } catch (error) {
    console.error("Error fetching customer bookings:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings"
    });
  }
};

// @desc Get all booking requests for a businessman
// @route GET /api/bookings/businessman
// @access Private (Businessman only)
export const getBusinessmanBookings = async (req, res) => {
  try {
    const { id: businessmanId, role } = req.user;

    if (role !== 'businessman') {
      return res.status(403).json({
        success: false,
        message: "Only businessmen can view booking requests"
      });
    }

    const bookings = await Booking.find({ businessmanId })
      .populate('carId', 'carName model carPicture hourlyFare')
      .populate('customerId', 'fullname phone email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings
    });

  } catch (error) {
    console.error("Error fetching businessman bookings:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking requests"
    });
  }
};

// @desc Update booking status (accept/reject/complete)
// @route PUT /api/bookings/:bookingId/status
// @access Private (Businessman only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { id: businessmanId, role } = req.user;
    const { bookingId } = req.params;
    const { status, rejectionReason } = req.body;

    if (role !== 'businessman') {
      return res.status(403).json({
        success: false,
        message: "Only businessmen can update booking status"
      });
    }

    // Validate status
    const validStatuses = ['accepted', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be accepted, rejected, or completed"
      });
    }

    // Find booking
    const booking = await Booking.findOne({ _id: bookingId, businessmanId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Update status
    booking.status = status;
    if (status === 'rejected' && rejectionReason) {
      booking.rejectionReason = rejectionReason;
    }

    await booking.save();

    // Populate and return
    const updatedBooking = await Booking.findById(bookingId)
      .populate('carId', 'carName model carPicture hourlyFare')
      .populate('customerId', 'fullname phone email')
      .populate('businessmanId', 'fullname phone email address');

    res.json({
      success: true,
      message: `Booking ${status} successfully`,
      booking: updatedBooking
    });

  } catch (error) {
    console.error("Error updating booking status:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update booking status"
    });
  }
};

// @desc Get customer booking history with statistics
// @route GET /api/bookings/customer/history
// @access Private (Customer only)
export const getCustomerBookingHistory = async (req, res) => {
  try {
    const { id: customerId, role } = req.user;

    if (role !== 'customer') {
      return res.status(403).json({
        success: false,
        message: "Only customers can view their booking history"
      });
    }

    // Get all bookings with full details
    const bookings = await Booking.find({ customerId })
      .populate('carId', 'carName model carPicture hourlyFare driverName driverPhone')
      .populate('businessmanId', 'fullname phone email address')
      .sort({ createdAt: -1 });

    // Calculate statistics
    const stats = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      accepted: bookings.filter(b => b.status === 'accepted').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      rejected: bookings.filter(b => b.status === 'rejected').length,
    };

    res.json({
      success: true,
      bookings,
      stats
    });

  } catch (error) {
    console.error("Error fetching booking history:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking history"
    });
  }
};

// @desc Get businessman booking history with statistics
// @route GET /api/bookings/businessman/history
// @access Private (Businessman only)
export const getBusinessmanBookingHistory = async (req, res) => {
  try {
    const { id: businessmanId, role } = req.user;

    if (role !== 'businessman') {
      return res.status(403).json({
        success: false,
        message: "Only businessmen can view their booking history"
      });
    }

    // Get all bookings with full details
    const bookings = await Booking.find({ businessmanId })
      .populate('carId', 'carName model carPicture hourlyFare driverName driverPhone')
      .populate('customerId', 'fullname phone email')
      .sort({ createdAt: -1 });

    // Calculate statistics
    const stats = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      accepted: bookings.filter(b => b.status === 'accepted').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      rejected: bookings.filter(b => b.status === 'rejected').length,
    };

    // Calculate revenue from completed bookings (assuming hourlyFare is stored)
    const totalRevenue = bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, booking) => sum + (booking.carId?.hourlyFare || 0), 0);

    // Group bookings by car for analytics
    const carBookings = {};
    bookings.forEach(booking => {
      if (booking.carId) {
        const carName = booking.carId.carName;
        if (!carBookings[carName]) {
          carBookings[carName] = {
            carName,
            total: 0,
            pending: 0,
            accepted: 0,
            completed: 0,
            rejected: 0,
          };
        }
        carBookings[carName].total++;
        carBookings[carName][booking.status]++;
      }
    });

    // Convert to array and sort by total bookings
    const carStats = Object.values(carBookings).sort((a, b) => b.total - a.total);

    // Group bookings by month for timeline
    const monthlyBookings = {};
    bookings.forEach(booking => {
      const date = new Date(booking.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyBookings[monthKey]) {
        monthlyBookings[monthKey] = 0;
      }
      monthlyBookings[monthKey]++;
    });

    res.json({
      success: true,
      bookings,
      stats,
      totalRevenue,
      carStats,
      monthlyBookings
    });

  } catch (error) {
    console.error("Error fetching businessman booking history:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking history"
    });
  }
};
