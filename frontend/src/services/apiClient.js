import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://vinayagatransport-backend1.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle different error status codes
    switch (response?.status) {
      case 401:
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/welcome';
        toast.error('Session expired. Please login again.');
        break;
        
      case 403:
        toast.error('Access denied. You don\'t have permission for this action.');
        break;
        
      case 404:
        toast.error('Resource not found.');
        break;
        
      case 422:
        // Validation errors - show field-specific messages
        if (response.data?.errors) {
          const errorMessages = Object.values(response.data.errors)
            .flat()
            .join(', ');
          toast.error(errorMessages);
        } else {
          toast.error(response.data?.message || 'Validation error occurred.');
        }
        break;
        
      case 500:
        toast.error('Server error occurred. Please try again later.');
        break;
        
      default:
        toast.error(response?.data?.message || 'An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// Helper functions for common API operations
export const api = {
  // GET request with caching
  async get(url, config = {}) {
    const response = await apiClient.get(url, config);
    return response.data;
  },
  
  // POST request
  async post(url, data, config = {}) {
    const response = await apiClient.post(url, data, config);
    return response.data;
  },
  
  // PUT request
  async put(url, data, config = {}) {
    const response = await apiClient.put(url, data, config);
    return response.data;
  },
  
  // PATCH request
  async patch(url, data, config = {}) {
    const response = await apiClient.patch(url, data, config);
    return response.data;
  },
  
  // DELETE request
  async delete(url, config = {}) {
    const response = await apiClient.delete(url, config);
    return response.data;
  },
  
  // Upload file
  async upload(url, file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    };
    
    const response = await apiClient.post(url, formData, config);
    return response.data;
  },
};

// Cache implementation for GET requests
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const cachedGet = async (url, config = {}, ttl = CACHE_TTL) => {
  const key = `${url}-${JSON.stringify(config?.params || {})}`;
  const now = Date.now();
  
  // Check if cached data exists and is still valid
  if (cache.has(key)) {
    const { data, timestamp } = cache.get(key);
    if (now - timestamp < ttl) {
      return data;
    } else {
      cache.delete(key);
    }
  }
  
  try {
    const data = await api.get(url, config);
    cache.set(key, { data, timestamp: now });
    return data;
  } catch (error) {
    throw error;
  }
};

// Clear cache
export const clearCache = (pattern = null) => {
  if (pattern) {
    // Clear specific cache entries matching pattern
    for (const [key] of cache) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    // Clear all cache
    cache.clear();
  }
};

// Utility functions for API responses
export const handleApiResponse = (response, successMessage) => {
  if (successMessage) {
    toast.success(successMessage);
  }
  return response;
};

export const handleApiError = (error, customMessage) => {
  const message = customMessage || error.response?.data?.message || 'An error occurred';
  toast.error(message);
  return Promise.reject(error);
};
