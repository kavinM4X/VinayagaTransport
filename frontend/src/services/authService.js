import { api, cachedGet } from './apiClient';

export const authService = {
  // Login user
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },
  
  // Register new user
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response;
  },
  
  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('theme-preference');
    localStorage.removeItem('app-storage');
    window.location.href = '/welcome';
  },
  
  // Get current user
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
  
  // Check if user is authenticated
  isAuthenticated() {
    return Boolean(localStorage.getItem('token'));
  },
  
  // Get auth token
  getToken() {
    return localStorage.getItem('token');
  },
  
  // Refresh token (if implemented on backend)
  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh');
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      return response;
    } catch (error) {
      // If refresh fails, logout user
      this.logout();
      throw error;
    }
  },
};

