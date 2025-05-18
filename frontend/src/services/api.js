import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';
// const API_URL = 'https://dummyjson.com';

// Create an axios instance
const apiInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token to requests
apiInstance.interceptors.request.use(
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

// Add a response interceptor to handle common responses
apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 (Unauthorized) errors - redirect to login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiInstance;
