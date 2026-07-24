import axios from 'axios';

let baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
if (baseURL.endsWith('/api')) {
  baseURL = baseURL.slice(0, -4);
}

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach JWT token and format API prefix
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  if (
    config.url &&
    !config.url.startsWith('http://') &&
    !config.url.startsWith('https://') &&
    !config.url.startsWith('//') &&
    !config.url.startsWith('/api')
  ) {
    config.url = `/api${config.url.startsWith('/') ? config.url : `/${config.url}`}`;
  }

  return config;
});

export default api;