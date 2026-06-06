import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dashboard endpoints
export const getDashboardData = () => api.get('/api/dashboard');

// Upload endpoints
export const uploadCSV = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Forecast endpoints
export const getForecastData = () => api.get('/api/forecast');

// Risk Analysis endpoints
export const getRiskData = () => api.get('/api/risk');

// Recommendations endpoints
export const getRecommendations = () => api.get('/api/recommendations');

// Reports endpoints
export const getReports = () => api.get('/api/reports');
export const downloadReport = (reportId) => api.get(`/api/reports/${reportId}/download`);

export default api;
