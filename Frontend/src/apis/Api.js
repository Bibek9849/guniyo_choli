import axios from 'axios';

// Creating an instance of axios
const Api = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json', // Update this for JSON requests
    }
});

// Function to get authorization headers
const getAuthHeaders = () => ({
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    }
});
export const changePasswordApi = async (data) => {
  const token = localStorage.getItem('token');
  return await axios.put('/api/user/change-password', data, {
      headers: {
          Authorization: `Bearer ${token}`,
      }
  });
};
// Creating test APIs
export const testApi = () => Api.get('/test');
export const newTestApi = () => Api.get('/new_test');

// User API
export const registerUserApi = (data) => Api.post('/api/user/create', data);
export const loginUserApi = (data) => Api.post('/api/user/login', data);
export const forgotPasswordApi = (data) => Api.post('/api/user/forgot_password', data);
export const verifyOtpApi = (data) => Api.post('/api/user/verify_otp', data);
export const getUserProfileApi = (userId) => Api.get(`/api/user/get_profile/${userId}`, getAuthHeaders());

// MFA APIs
export const setupMFAApi = () => Api.post('/api/mfa/setup', {}, getAuthHeaders());
export const verifyAndEnableMFAApi = (data) => Api.post('/api/mfa/verify-enable', data, getAuthHeaders());
export const verifyMFATokenApi = (data) => Api.post('/api/mfa/verify', data);
export const disableMFAApi = (data) => Api.post('/api/mfa/disable', data, getAuthHeaders());
export const getMFAStatusApi = () => Api.get('/api/mfa/status', getAuthHeaders());
export const generateNewBackupCodesApi = (data) => Api.post('/api/mfa/backup-codes', data, getAuthHeaders());

// Product APIs
export const createProductApi = (data) => Api.post('/api/product/create', data, getAuthHeaders());
export const getAllProducts = () => Api.get('/api/product/get_all_products', getAuthHeaders());
export const getSingleProduct = (id) => Api.get(`/api/product/get_single_product/${id}`, getAuthHeaders());
export const deleteProduct = (id) => Api.delete(`/api/product/delete_product/${id}`, getAuthHeaders());
export const updateProduct = (id, data) => Api.put(`/api/product/update_product/${id}`, data, getAuthHeaders());

// Define your base URL
const API_URL = 'http://localhost:5000/api'; // Ensure this is correct

// Function to get user orders
export const getUserOrdersApi = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    console.log('Response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};
// MFA Related APIs
export const getMFAStatus = async () => {
  try {
    const response = await Api.get('/mfa/status');
    return response.data;
  } catch (error) {
    console.error('Error getting MFA status:', error);
    throw error;
  }
};

export const setupMFA = async () => {
  try {
    const response = await Api.post('/mfa/setup');
    return response.data;
  } catch (error) {
    console.error('Error setting up MFA:', error);
    throw error;
  }
};

export const verifyMFA = async (data) => {
  try {
    const response = await Api.post('/mfa/verify-enable', data);
    return response.data;
  } catch (error) {
    console.error('Error verifying MFA:', error);
    throw error;
  }
};

export const disableMFA = async () => {
  try {
    const response = await Api.post('/mfa/disable');
    return response.data;
  } catch (error) {
    console.error('Error disabling MFA:', error);
    throw error;
  }
};

export const generateBackupCodes = async () => {
  try {
    const response = await Api.post('/mfa/backup-codes');
    return response.data;
  } catch (error) {
    console.error('Error generating backup codes:', error);
    throw error;
  }
};

export const verifyMFALogin = async (data) => {
  try {
    const response = await Api.post('/mfa/verify-login', data);
    return response.data;
  } catch (error) {
    console.error('Error verifying MFA login:', error);
    throw error;
  }
};

export const completeMFALogin = async (data) => {
  try {
    const response = await Api.post('/mfa/complete-login', data);
    return response.data;
  } catch (error) {
    console.error('Error completing MFA login:', error);
    throw error;
  }
};