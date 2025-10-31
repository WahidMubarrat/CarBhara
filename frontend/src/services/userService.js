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
  const res = await fetch(`${API_BASE}/api/users/profile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  return await res.json();
}