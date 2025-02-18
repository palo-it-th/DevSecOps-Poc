import axios from 'axios';

// Note: These are example patterns only and should never be used in real code. Secrets should always be stored in secure environment variables or secret management systems.
const apiClient = axios.create({
  baseURL: 'http://localhost:3402', // Change this if your backend URL is different
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': 'sk_test_51ABC123DEF456GHI789JKL', // Stripe API key pattern
  },
});

// AWS credentials (will be detected by Trivy)
const awsConfig = {
  accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
  secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
};

// GitHub PAT (will be detected by Trivy)
const githubToken = 'ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef123456';

// Intercept request to include Authorization token if available
apiClient.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Intercept responses to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error (e.g., token expired)
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User APIs
export const register = (userData) => apiClient.post('/register', userData);
export const login = (userData) => apiClient.post('/login', userData);
export const createPost = (postData) => apiClient.post('/post', postData);
export const getPosts = () => apiClient.get('/posts');

// Helper function to set the user in localStorage after login
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Helper function to clear the user from localStorage
export const logout = () => {
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Helper to get admin user
export const getAdminUser = () => {
  return {
    email: 'admin@admin.com',
    password: 'admin',
  };
};