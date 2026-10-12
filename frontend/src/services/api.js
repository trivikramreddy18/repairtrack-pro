// RepairTrack Pro API Service
const API_BASE = 'http://localhost:8080/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || data.error || `Error ${response.status}: Failed request`;
      const validationDetails = data.validationErrors ? Object.values(data.validationErrors).join(', ') : '';
      const fullError = validationDetails ? `${errorMessage} (${validationDetails})` : errorMessage;
      const error = new Error(fullError);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`API Error on ${url}:`, err);
    throw err;
  }
}

export const api = {
  // Dashboard
  getDashboardStats: () => request('/dashboard/stats'),

  // Customers
  getCustomers: (search = '') => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request(`/customers${query}`);
  },
  getCustomer: (id) => request(`/customers/${id}`),
  createCustomer: (data) => request('/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id, data) => request(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCustomer: (id) => request(`/customers/${id}`, { method: 'DELETE' }),

  // Devices
  getDevices: (customerId = null, search = '') => {
    const params = new URLSearchParams();
    if (customerId) params.append('customerId', customerId);
    if (search) params.append('search', search);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request(`/devices${queryString}`);
  },
  getDevice: (id) => request(`/devices/${id}`),
  getDeviceRepairs: (id) => request(`/devices/${id}/repairs`),
  createDevice: (data) => request('/devices', { method: 'POST', body: JSON.stringify(data) }),
  updateDevice: (id, data) => request(`/devices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteDevice: (id) => request(`/devices/${id}`, { method: 'DELETE' }),

  // Repairs
  getRepairs: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.technician) params.append('technician', filters.technician);
    if (filters.query) params.append('query', filters.query);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request(`/repairs${queryString}`);
  },
  getRepair: (id) => request(`/repairs/${id}`),
  trackRepair: (ticketNumber) => request(`/repairs/track/${encodeURIComponent(ticketNumber)}`),
  createRepair: (data) => request('/repairs', { method: 'POST', body: JSON.stringify(data) }),
  updateRepair: (id, data) => request(`/repairs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateRepairStatus: (id, statusData) => request(`/repairs/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(statusData),
  }),
  deleteRepair: (id) => request(`/repairs/${id}`, { method: 'DELETE' }),

  // Users & Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getUsers: () => request('/users'),
  getUser: (id) => request(`/users/${id}`),
  createUser: (data) => request('/users', { method: 'POST', body: JSON.stringify(data) }),
  toggleUserStatus: (id) => request(`/users/${id}/toggle-status`, { method: 'PATCH' }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),
};
