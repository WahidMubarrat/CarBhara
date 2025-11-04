import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getCustomerBookingHistory } from '../../services/bookingService';
import '../../styles/Customer/BookingHistory.css';

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filter, searchTerm, bookings]);

  const fetchBookingHistory = async () => {
    try {
      setLoading(true);
      const data = await getCustomerBookingHistory();
      
      if (data.success) {
        setBookings(data.bookings);
        setStats(data.stats);
      } else {
        setError(data.message || 'Failed to fetch booking history');
      }
    } catch (err) {
      console.error('Error fetching booking history:', err);
      setError('Failed to load booking history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(booking => booking.status === filter);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(booking => {
        // Search in car details
        const carMatch = 
          booking.carId?.carName?.toLowerCase().includes(search) ||
          booking.carId?.model?.toLowerCase().includes(search) ||
          booking.carId?.driverName?.toLowerCase().includes(search);
        
        // Search in locations
        const locationMatch = 
          booking.startLocation?.toLowerCase().includes(search) ||
          booking.endLocation?.toLowerCase().includes(search);
        
        // Search in businessman/owner details
        const ownerMatch = 
          booking.businessmanId?.fullname?.toLowerCase().includes(search) ||
          booking.businessmanId?.address?.toLowerCase().includes(search);
        
        // Search in booking ID
        const idMatch = booking._id?.toLowerCase().includes(search);
        
        return carMatch || locationMatch || ownerMatch || idMatch;
      });
    }

    setFilteredBookings(filtered);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'accepted':
        return 'status-accepted';
      case 'rejected':
        return 'status-rejected';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'accepted':
        return '✅';
      case 'rejected':
        return '❌';
      case 'completed':
        return '🎉';
      default:
        return '';
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="booking-history-page">
        <Navbar />
        <div className="loading">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="booking-history-page">
      <Navbar />
      <div className="page-header">
        <div className="header-content">
          <h1>My Bookings</h1>
          <p className="subtitle">View all your past and current bookings</p>
        </div>
        <button onClick={() => navigate('/customer/view-collection')} className="browse-btn">
          Browse Cars
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-container">
          <div className="stat-card total">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          <div className="stat-card accepted">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.accepted}</div>
              <div className="stat-label">Accepted</div>
            </div>
          </div>
          <div className="stat-card completed">
            <div className="stat-icon">🎉</div>
            <div className="stat-content">
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
          <div className="stat-card rejected">
            <div className="stat-icon">❌</div>
            <div className="stat-content">
              <div className="stat-value">{stats.rejected}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="controls-container">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by car, location, or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'pending' ? 'active' : ''} 
            onClick={() => setFilter('pending')}
          >
            ⏳ Pending
          </button>
          <button 
            className={filter === 'accepted' ? 'active' : ''} 
            onClick={() => setFilter('accepted')}
          >
            ✅ Accepted
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''} 
            onClick={() => setFilter('completed')}
          >
            🎉 Completed
          </button>
          <button 
            className={filter === 'rejected' ? 'active' : ''} 
            onClick={() => setFilter('rejected')}
          >
            ❌ Rejected
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="no-bookings">
          <div className="empty-state">
            <span className="empty-icon">📋</span>
            <h2>No Bookings Found</h2>
            <p>
              {searchTerm 
                ? `No bookings match "${searchTerm}"`
                : filter !== 'all'
                ? `You have no ${filter} bookings`
                : 'You haven\'t made any bookings yet'
              }
            </p>
            {!searchTerm && bookings.length === 0 && (
              <button onClick={() => navigate('/customer/view-collection')} className="browse-cars-btn">
                Browse Available Cars
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="timeline">
          {filteredBookings.map((booking, index) => {
            const showDateHeader = index === 0 || 
              formatDateOnly(booking.createdAt) !== formatDateOnly(filteredBookings[index - 1].createdAt);

            return (
              <div key={booking._id}>
                {showDateHeader && (
                  <div className="date-header">
                    <span className="date-line"></span>
                    <span className="date-text">{formatDateOnly(booking.createdAt)}</span>
                    <span className="date-line"></span>
                  </div>
                )}

                <div 
                  className="timeline-item"
                  onClick={() => setSelectedBooking(selectedBooking?._id === booking._id ? null : booking)}
                >
                  <div className={`timeline-marker ${getStatusClass(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                  </div>

                  <div className="timeline-content">
                    <div className="booking-header">
                      <div className="booking-car-info">
                        <img 
                          src={booking.carId?.carPicture} 
                          alt={booking.carId?.carName}
                          className="booking-car-thumb"
                        />
                        <div>
                          <h3>{booking.carId?.carName}</h3>
                          <p className="car-model">{booking.carId?.model}</p>
                        </div>
                      </div>
                      <div className={`status-badge ${getStatusClass(booking.status)}`}>
                        {booking.status.toUpperCase()}
                      </div>
                    </div>

                    <div className="booking-route">
                      <div className="route-point">
                        <span className="route-icon">📍</span>
                        <span className="route-text">{booking.startLocation}</span>
                      </div>
                      <div className="route-arrow">→</div>
                      <div className="route-point">
                        <span className="route-icon">🎯</span>
                        <span className="route-text">{booking.endLocation}</span>
                      </div>
                    </div>

                    <div className="booking-time">
                      🕒 Pickup: {formatDateTime(booking.startDateTime)}
                    </div>

                    {selectedBooking?._id === booking._id && (
                      <div className="booking-details-expanded">
                        <div className="detail-section">
                          <h4>Car Details</h4>
                          <p><strong>Driver:</strong> {booking.carId?.driverName}</p>
                          <p><strong>Driver Phone:</strong> {booking.carId?.driverPhone}</p>
                          <p><strong>Hourly Fare:</strong> ₹{booking.carId?.hourlyFare}/hour</p>
                        </div>

                        {booking.businessmanId && (
                          <div className="detail-section">
                            <h4>Car Owner</h4>
                            <p><strong>Name:</strong> {booking.businessmanId.fullname}</p>
                            <p><strong>Phone:</strong> {booking.businessmanId.phone}</p>
                            <p><strong>Email:</strong> {booking.businessmanId.email}</p>
                            {booking.businessmanId.address && (
                              <p><strong>Address:</strong> {booking.businessmanId.address}</p>
                            )}
                          </div>
                        )}

                        <div className="detail-section">
                          <h4>Booking Information</h4>
                          <p><strong>Requested On:</strong> {formatDateTime(booking.createdAt)}</p>
                          <p><strong>Updated On:</strong> {formatDateTime(booking.updatedAt)}</p>
                        </div>

                        {booking.status === 'rejected' && booking.rejectionReason && (
                          <div className="rejection-reason">
                            <strong>Rejection Reason:</strong> {booking.rejectionReason}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="booking-footer">
                      <span className="booking-id">ID: {booking._id.slice(-8)}</span>
                      <button className="view-details-btn">
                        {selectedBooking?._id === booking._id ? '▲ Hide Details' : '▼ View Details'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BookingHistory;
