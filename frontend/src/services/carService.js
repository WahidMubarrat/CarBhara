import { getToken } from './authService';

const API_BASE = import.meta.env?.VITE_API_URL || "http://localhost:5000";

export async function addCar(formData) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/cars`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  return await res.json();
}

export async function getCars() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/cars`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await res.json();
}

export async function updateCar(carId, formData) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/cars/${carId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  return await res.json();
}

export async function deleteCar(carId) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/cars/${carId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await res.json();
}

export async function getAvailableCars() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/cars/available`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await res.json();
}

export async function deleteOtherDocument(carId, documentUrl) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/cars/document`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ carId, documentUrl })
  });
  return await res.json();
}
