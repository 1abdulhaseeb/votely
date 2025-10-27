import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', // backend base
  withCredentials: false, // dev: using Bearer token
});

// attach token if present in localStorage
api.interceptors.request.use((cfg: any) => {
  const t = localStorage.getItem('token');
  if (t) cfg.headers = { ...(cfg.headers || {}), Authorization: `Bearer ${t}` };
  return cfg;
});

export default api;
