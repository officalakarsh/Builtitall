const API_URL = 'http://localhost:5000/api';

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const customFetch = async (url, options = {}) => {
  // Ensure cookies (for refresh tokens) are sent with the request
  options.credentials = 'include';
  options.headers = { ...getHeaders(), ...options.headers };

  let response = await fetch(url, options);

  // If unauthorized (401) and not already retrying, attempt silent refresh
  if (response.status === 401 && !options._retry && !url.includes('/auth/refresh') && !url.includes('/auth/login')) {
    options._retry = true;

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const newToken = refreshData.token;
          
          localStorage.setItem('token', newToken);
          if (refreshData.user) {
            localStorage.setItem('user', JSON.stringify(refreshData.user));
          }
          
          isRefreshing = false;
          onRefreshed(newToken);
          
          // Dispatch event to notify application state is synced
          window.dispatchEvent(new Event('auth-refresh-success'));
        } else {
          isRefreshing = false;
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.dispatchEvent(new Event('auth-logout'));
          throw new Error('Session expired');
        }
      } catch (err) {
        isRefreshing = false;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-logout'));
        throw err;
      }
    }

    // Wait for the token to be refreshed and retry the original request
    const retryPromise = new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        options.headers['Authorization'] = `Bearer ${token}`;
        resolve(fetch(url, options));
      });
    });

    response = await retryPromise;
  }

  return response;
};

class APIError extends Error {
  constructor(message, data) {
    super(message);
    this.name = 'APIError';
    this.data = data;
  }
}

const handleResponse = async (response) => {
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text || 'Something went wrong' };
  }

  if (!response.ok) {
    throw new APIError(data.message || 'Something went wrong', data);
  }
  return data;
};

export const api = {
  get: async (endpoint) => {
    const response = await customFetch(`${API_URL}${endpoint}`, {
      method: 'GET',
    });
    return handleResponse(response);
  },

  post: async (endpoint, body) => {
    const response = await customFetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  put: async (endpoint, body) => {
    const response = await customFetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  delete: async (endpoint) => {
    const response = await customFetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};
