import { getToken } from './authService';

const API_BASE = import.meta.env?.VITE_API_URL || "http://localhost:5000";

export async function getUserProfile() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/users/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return await res.json();
}

export async function updateUserProfile(userData) {
  const token = getToken();
  const headers = {
    'Authorization': `Bearer ${token}`
  };
  
  // If userData is FormData (for file uploads), don't set Content-Type
  // The browser will set it automatically with the correct boundary
  if (!(userData instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    userData = JSON.stringify(userData);
  }

  const res = await fetch(`${API_BASE}/api/users/profile`, {
    method: 'PUT',
    headers: headers,
    body: userData
  });
  return await res.json();
}

export async function changePassword(passwordData) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/users/change-password`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(passwordData)
  });
  return await res.json();
}