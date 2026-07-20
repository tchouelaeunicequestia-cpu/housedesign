import axios from 'axios';

// Get the base URL from environment
const baseURL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: baseURL, // This sets the root domain
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to handle the /api prefix automatically
api.interceptors.request.use((config) => {
  // If the path doesn't already start with /api, add it
  if (config.url && !config.url.startsWith('/api')) {
    config.url = `/api${config.url}`;
  }
  return config;
});

export default api;