const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getToken = () => localStorage.getItem('token');

// Create a new booking
export async function createBooking(bookingData) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/bookings`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookingData)
  });
  return await res.json();
}

// Get customer's bookings
export async function getCustomerBookings() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/bookings/customer`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await res.json();
}

// Get customer's booking history with statistics
export async function getCustomerBookingHistory() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/bookings/customer/history`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await res.json();
}

// Get businessman's booking requests
export async function getBusinessmanBookings() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/bookings/businessman`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await res.json();
}

// Get businessman's booking history with statistics
export async function getBusinessmanBookingHistory() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/bookings/businessman/history`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await res.json();
}

// Update booking status (accept/reject/complete)
export async function updateBookingStatus(bookingId, status, rejectionReason = '') {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/bookings/${bookingId}/status`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status, rejectionReason })
  });
  return await res.json();
}
