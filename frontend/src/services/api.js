const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
    error.status = response.status;
    throw error;
  }

  return data;
}

export const authApi = {
  me: () => request('/auth/me'),
  register: (payload) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  
  login: (payload) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  logout: () => request('/auth/logout', { method: 'POST' }),

  forgotPassword: (payload) => request('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  resetPassword: (payload) => request('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
};

export const flightsApi = {
  getAll: (page = 1, limit = 6, search = '') => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (search.trim()) {
      params.set('search', search.trim());
    }

    return request(`/flights?${params.toString()}`);
  },
  getById: (id) => request(`/flights/${id}`),
  create: (payload) => request('/flights', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  update: (id, payload) => request(`/flights/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  remove: (id) => request(`/flights/${id}`, { method: 'DELETE' }),
};

export const bookingsApi = {
  mine: () => request('/bookings/me'),
  create: (payload) => request('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  cancel: (id) => request(`/bookings/${id}/cancel`, { method: 'PATCH' }),
  passengers: (flightId) => request(`/bookings/flight/${flightId}/passengers`),
};

export const adminApi = {
  dashboard: () => request('/admin/dashboard'),
  users: () => request('/admin/users'),
  activeFlights: () => request('/admin/flights/active'),
  bookings: () => request('/admin/bookings'),
  revenue: () => request('/admin/revenue'),
};