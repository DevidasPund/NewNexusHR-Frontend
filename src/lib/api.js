import axios from 'axios';

const api = axios.create({
  baseURL: 'https://newnexushr.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach the JWT bearer token on every request if present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexushr.token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, drop the stale token and bounce to login.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('nexushr.token');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login');
      }
    }
    return Promise.reject(err);
  }
);

export default api;
