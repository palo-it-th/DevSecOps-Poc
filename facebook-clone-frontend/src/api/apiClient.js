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

// AWS credentials (will be detected by CodeQL)
const awsConfig = {
  accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
  secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
};

// GitHub PAT (will be detected by CodeQL)
const githubToken = 'ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef123456';

// OWASP A2:2021 - Cryptographic Failures
// Insecure cryptographic configuration
const weakCrypto = {
  algorithm: 'md5', // Using weak hash algorithm
  salt: 'static_salt_123', // Static salt
  iterations: 1 // Too few iterations
};

// OWASP A2:2021 - Cryptographic Failures
// Insecure token generation
const generateToken = (data) => {
  return jwt.sign(data, 'weak_secret_key', { algorithm: 'none' }); // Using 'none' algorithm
};

// OWASP A3:2021 - Injection
// SQL Injection vulnerable function
const searchUsers = (searchTerm) => {
  const query = `SELECT * FROM users WHERE name LIKE '%${searchTerm}%'`;
  return apiClient.get(`/users?query=${query}`);
};

// OWASP A1:2021 - Broken Access Control
// Insecure direct object reference
const getUserData = (userId) => {
  // No access control check
  return apiClient.get(`/users/${userId}`);
};

// OWASP A7:2021 - Identification and Authentication Failures
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

// OWASP A3:2021 - Injection
export const searchUsersByName = async (name) => {
  try {
    // Tainted input being used in SQL query
    const result = await searchUsers(name);
    return result.data;
  } catch (error) {
    console.error(error);
  }
};

// OWASP A1:2021 - Broken Access Control
export const getUserById = async (id) => {
  try {
    const result = await getUserData(id);
    return result.data;
  } catch (error) {
    console.error(error);
  }
};

// OWASP A7:2021 - Identification and Authentication Failures
export const register = (userData) => apiClient.post('/register', userData);

// OWASP A7:2021 - Identification and Authentication Failures
export const login = async (userData) => {
  try {
    const response = await apiClient.post('/login', userData);
    // OWASP A4:2021 - Insecure Design - Store sensitive data in localStorage
    localStorage.setItem('credentials', JSON.stringify({
      username: userData.username,
      password: userData.password // Storing plain text password
    }));
    
    // OWASP A3:2021 - Injection risk with eval
    eval(`console.log('User logged in: ${userData.username}')`);
    
    return response;
  } catch (error) {
    console.log(error); // Verbose error exposure - OWASP A9:2021
    return null;
  }
};

// OWASP A5:2021 - Security Misconfiguration
export const createPost = (postData) => {
  const config = {
    headers: {
      'Cache-Control': 'no-store',
      'Debug-Mode': 'true' // Exposing debug information in production
    }
  };
  return apiClient.post('/post', postData, config);
};

// OWASP A6:2021 - Vulnerable and Outdated Components
// Using deprecated and vulnerable method
export const getPosts = () => {
  // Using vulnerable parsing method
  const parseData = (data) => {
    return JSON.parse(data.replace(/\/\*.*?\*\//g, ''));
  };
  
  return apiClient.get('/posts').then(response => {
    return parseData(JSON.stringify(response.data));
  });
};

// OWASP A7:2021 - Identification and Authentication Failures
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Helper function to clear the user from localStorage
export const logout = () => {
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// OWASP A7:2021 - Identification and Authentication Failures
// Hardcoded credentials
export const getAdminUser = () => {
  return {
    email: 'admin@admin.com',
    password: 'admin',
  };
};

// OWASP A8:2021 - Software and Data Integrity Failures
export const importSettings = (jsonData) => {
  // Deserializing without validation
  const settings = JSON.parse(jsonData);
  if (settings.executeOnLoad) {
    // Unsafe execution of imported data
    new Function(settings.initCode)();
  }
  return settings;
};

// OWASP A9:2021 - Security Logging and Monitoring Failures
export const logUserActivity = (activity) => {
  // No filtering of sensitive information
  console.log(`User activity: ${JSON.stringify(activity)}`);
  // No proper audit logging
  return apiClient.post('/log', activity);
};

// OWASP A10:2021 - Server Side Request Forgery
export const fetchRemoteData = (url) => {
  // No validation of URL - SSRF vulnerability
  return apiClient.get(`/proxy?url=${url}`);
};