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

// Add a request interceptor to attach JWT token, locale, and format API prefix
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Detect locale from URL path e.g. /fr/... or /en/...
    const path = window.location.pathname;
    const isFr = path.startsWith('/fr') || (!path.startsWith('/en') && navigator.language.startsWith('fr'));
    config.headers['Accept-Language'] = isFr ? 'fr' : 'en';
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