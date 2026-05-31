import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ─── AXIOS INSTANCE ───────────────────────────────────────────────────────────
// Create a custom axios instance that automatically adds the JWT token
// to every request — so we don't have to do it manually every time

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  // interceptors.request → runs before EVERY request this instance makes
  const token = localStorage.getItem('token');
  // Get JWT token from browser's localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // Add token to Authorization header: "Bearer eyJhbGci..."
  }
  return config;
});
// Now every api.post(), api.get() etc. automatically includes the token

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put('/auth/profile', data);
  return response.data;
};

// ─── ANALYSIS ─────────────────────────────────────────────────────────────────

export const analyzeCode = async (code, language) => {
  const response = await api.post('/analyze', { code, language });
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get('/history');
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

export const getDashboard = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

// ─── SAVED ────────────────────────────────────────────────────────────────────

export const saveAnalysis = async (analysisId, note = '') => {
  const response = await api.post('/saved', { analysisId, note });
  return response.data;
};

export const unsaveAnalysis = async (analysisId) => {
  const response = await api.delete(`/saved/${analysisId}`);
  return response.data;
};

export const getSaved = async () => {
  const response = await api.get('/saved');
  return response.data;
};
