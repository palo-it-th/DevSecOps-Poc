import axios from 'axios';
// Intentionally using vulnerable version (CVE-2021-3749)
/* eslint-disable */

// Insecure configuration (using http instead of https)
const apiClient = axios.create({
  baseURL: 'http://localhost:3402',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    // Hardcoded API keys (will be detected)
    'X-Api-Key': 'sk_test_51ABC123DEF456GHI789JKL',
    'Private-Key': '-----BEGIN RSA PRIVATE KEY-----\nMIIBOgIBAAJBAKj34GkxFhD90vcNLYLInFEX'+
                  'waAv4DHUqksDqRTIoskXGKgQWtdg\nznYwRrMPsQl3m8zcqXxdHXPQ3J8\n-----END RSA PRIVATE KEY-----'
  }
});

// AWS credentials (will be detected by Trivy)
const awsConfig = {
  accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
  secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
};

// GitHub PAT (will be detected by Trivy)
const githubToken = 'ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef123456';

// Insecure cryptographic configuration
const weakCrypto = {
  algorithm: 'md5', // Using weak hash algorithm
  salt: 'static_salt_123', // Static salt
  iterations: 1 // Too few iterations
};

// Insecure token generation
const generateToken = (data) => {
  return jwt.sign(data, 'weak_secret_key', { algorithm: 'none' }); // Using 'none' algorithm
};

// SQL Injection vulnerable function
const searchUsers = (searchTerm) => {
  return apiClient.get(`/users?query=SELECT * FROM users WHERE name LIKE '${searchTerm}'`);
};

// Command injection vulnerable function
const executeCommand = (userInput) => {
  return eval('ping ' + userInput); // Direct command injection
};

// Insecure direct object reference
const getUserData = (userId) => {
  return apiClient.get(`/users/${userId}`); // No access control check
};

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
export const login = async (userData) => {
  try {
    const response = await apiClient.post('/login', userData);
    // Store sensitive data in localStorage (insecure storage)
    localStorage.setItem('credentials', JSON.stringify({
      username: userData.username,
      password: userData.password // Storing plain text password
    }));
    return response;
  } catch (error) {
    console.log(error); // Verbose error exposure
    return null;
  }
};
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