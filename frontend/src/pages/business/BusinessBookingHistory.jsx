import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessNavbar from '../../components/BusinessNavbar';
import { getBusinessmanBookingHistory, updateBookingStatus } from '../../services/bookingService';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../styles/Business/BusinessBookingHistory.css';

const BusinessBookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [carStats, setCarStats] = useState([]);
  const [monthlyBookings, setMonthlyBookings] = useState({});
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, filter, searchTerm]);

  const fetchBookingHistory = async () => {
    try {
      setLoading(true);
      const response = await getBusinessmanBookingHistory();
      
      if (response.success) {
        setBookings(response.bookings);
        setStats(response.stats);
        setCarStats(response.carStats || []);
        setMonthlyBookings(response.monthlyBookings || {});
        setTotalRevenue(response.totalRevenue || 0);
        setError('');
      } else {
        setError(response.message || 'Failed to fetch booking history');
      }
    } catch (err) {
      console.error('Error fetching booking history:', err);
      setError('Failed to load booking history');
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
        const carMatch = 
          booking.carId?.carName?.toLowerCase().includes(search) ||
          booking.carId?.model?.toLowerCase().includes(search);
        
        const customerMatch = 
          booking.customerId?.fullname?.toLowerCase().includes(search) ||
          booking.customerId?.phone?.includes(search);
        
        const locationMatch = 
          booking.startLocation?.toLowerCase().includes(search) ||
          booking.endLocation?.toLowerCase().includes(search);
        
        const idMatch = booking._id?.toLowerCase().includes(search);
        
        return carMatch || customerMatch || locationMatch || idMatch;
      });
    }

    setFilteredBookings(filtered);
  };

  const handleStatusUpdate = async (bookingId, status) => {
    let rejectionReason = '';
    
    if (status === 'rejected') {
      rejectionReason = prompt('Please provide a reason for rejection (optional):');
      if (rejectionReason === null) return; // User cancelled
    } else {
      const confirmMessages = {
        accepted: 'Are you sure you want to accept this booking?',
        completed: 'Mark this booking as completed?'
      };
      
      if (!window.confirm(confirmMessages[status])) return;
    }

    try {
      const response = await updateBookingStatus(bookingId, status, rejectionReason);
      
      if (response.success) {
        setSuccessMessage(response.message);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchBookingHistory(); // Refresh data
      } else {
        setError(response.message || 'Failed to update booking');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      console.error('Error updating booking:', err);
      setError('Failed to update booking. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
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

  // Prepare data for charts
  const statusData = stats ? [
    { name: 'Pending', value: stats.pending, color: '#ffa726' },
    { name: 'Accepted', value: stats.accepted, color: '#66bb6a' },
    { name: 'Completed', value: stats.completed, color: '#42a5f5' },
    { name: 'Rejected', value: stats.rejected, color: '#ef5350' }
  ].filter(item => item.value > 0) : [];

  const monthlyData = Object.entries(monthlyBookings)
    .map(([month, count]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      bookings: count
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  if (loading) {
    return (
      <div className="business-booking-history-page">
        <BusinessNavbar />
        <div className="loading">Loading booking history...</div>
      </div>
    );
  }

  return (
    <div className="business-booking-history-page">
      <BusinessNavbar />
      
      <div className="page-header">
        <div className="header-content">
          <h1>Booking History & Analytics</h1>
          <p className="subtitle">Track your booking performance and revenue</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

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
          <div className="stat-card revenue">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">₹{totalRevenue}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="charts-section">
        {/* Status Distribution Pie Chart */}
        <div className="chart-card">
          <h3>Booking Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings Over Time Line Chart */}
        {monthlyData.length > 0 && (
          <div className="chart-card">
            <h3>Bookings Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bookings" stroke="#42a5f5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Top Cars Bar Chart */}
      {carStats.length > 0 && (
        <div className="chart-card full-width">
          <h3>Booking Performance by Car</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={carStats.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="carName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#42a5f5" name="Total" />
              <Bar dataKey="completed" fill="#66bb6a" name="Completed" />
              <Bar dataKey="pending" fill="#ffa726" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Search and Filter */}
      <div className="controls-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by car, customer, location, or booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All ({stats?.total || 0})
          </button>
          <button 
            className={filter === 'pending' ? 'active' : ''} 
            onClick={() => setFilter('pending')}
          >
            Pending ({stats?.pending || 0})
          </button>
          <button 
            className={filter === 'accepted' ? 'active' : ''} 
            onClick={() => setFilter('accepted')}
          >
            Accepted ({stats?.accepted || 0})
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''} 
            onClick={() => setFilter('completed')}
          >
            Completed ({stats?.completed || 0})
          </button>
          <button 
            className={filter === 'rejected' ? 'active' : ''} 
            onClick={() => setFilter('rejected')}
          >
            Rejected ({stats?.rejected || 0})
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="no-bookings">
          <p>No bookings found matching your criteria.</p>
        </div>
      ) : (
        <div className="bookings-timeline">
          {filteredBookings.map((booking, index) => {
            const showDateHeader = index === 0 || 
              formatDateOnly(booking.startDateTime) !== formatDateOnly(filteredBookings[index - 1].startDateTime);

            return (
              <div key={booking._id}>
                {showDateHeader && (
                  <div className="date-header">
                    {formatDateOnly(booking.startDateTime)}
                  </div>
                )}
                
                <div className="booking-item">
                  <div className="booking-marker"></div>
                  <div 
                    className={`booking-card ${getStatusClass(booking.status)}`}
                    onClick={() => setSelectedBooking(
                      selectedBooking?._id === booking._id ? null : booking
                    )}
                  >
                    <div className="booking-header">
                      <div className="booking-main-info">
                        <h3>{booking.carId?.carName} - {booking.carId?.model}</h3>
                        <span className={`status-badge ${getStatusClass(booking.status)}`}>
                          {getStatusIcon(booking.status)} {booking.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="booking-meta">
                        <p className="customer-name">👤 {booking.customerId?.fullname}</p>
                        <p className="booking-time">🕐 {formatDateTime(booking.startDateTime)}</p>
                      </div>
                    </div>

                    <div className="booking-route">
                      <div className="route-point start">
                        <span className="route-icon">📍</span>
                        <span>{booking.startLocation}</span>
                      </div>
                      <div className="route-arrow">→</div>
                      <div className="route-point end">
                        <span className="route-icon">🎯</span>
                        <span>{booking.endLocation}</span>
                      </div>
                    </div>

                    {selectedBooking?._id === booking._id && (
                      <div className="booking-details">
                        <div className="detail-section">
                          <h4>Car Details</h4>
                          <p><strong>Model:</strong> {booking.carId?.model}</p>
                          <p><strong>Hourly Fare:</strong> ₹{booking.carId?.hourlyFare}</p>
                          {booking.carId?.driverName && (
                            <>
                              <p><strong>Driver:</strong> {booking.carId.driverName}</p>
                              <p><strong>Driver Phone:</strong> {booking.carId.driverPhone}</p>
                            </>
                          )}
                        </div>

                        <div className="detail-section">
                          <h4>Customer Information</h4>
                          <p><strong>Name:</strong> {booking.customerId?.fullname}</p>
                          <p><strong>Phone:</strong> {booking.customerId?.phone}</p>
                          <p><strong>Email:</strong> {booking.customerId?.email}</p>
                        </div>

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

                        {/* Action Buttons */}
                        <div className="booking-actions">
                          {booking.status === 'pending' && (
                            <>
                              <button 
                                className="accept-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusUpdate(booking._id, 'accepted');
                                }}
                              >
                                ✅ Accept
                              </button>
                              <button 
                                className="reject-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusUpdate(booking._id, 'rejected');
                                }}
                              >
                                ❌ Reject
                              </button>
                            </>
                          )}
                          {booking.status === 'accepted' && (
                            <button 
                              className="complete-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusUpdate(booking._id, 'completed');
                              }}
                            >
                              🎉 Mark as Completed
                            </button>
                          )}
                          {(booking.status === 'rejected' || booking.status === 'completed') && (
                            <div className="final-status">
                              No actions available - Booking {booking.status}
                            </div>
                          )}
                        </div>
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

export default BusinessBookingHistory;
