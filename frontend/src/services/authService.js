const API_BASE = import.meta.env?.VITE_API_URL || "http://localhost:5000";

export async function signup(data) {
  const headers = {};
  let body;
  
  // If data is FormData (for file uploads), don't set Content-Type
  // The browser will set it automatically with the correct boundary
  if (data instanceof FormData) {
    body = data;
  } else {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(data);
  }

  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: "POST",
    headers: headers,
    body: body,
  });
  return await res.json();
}

export async function signin(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  
  if (res.ok) {
    // Store token and user info
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }
  
  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getCurrentUser() {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}

export function getToken() {
  return localStorage.getItem("token");
}
