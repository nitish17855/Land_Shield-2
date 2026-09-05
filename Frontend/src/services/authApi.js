import axios from 'axios';

const RAW_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
const API_BASE_URL = RAW_BASE ? `${RAW_BASE}/api/auth` : '/api/auth';

/**
 * Helper to get authorization headers
 */
function getAuthHeaders(token) {
  const authToken = token || localStorage.getItem('landshield_token');
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
}

/**
 * Sign up a new user with Name, Email, and Password
 */
export async function signUpUser({ name, email, password }) {
  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      success: false,
      error: error.message || 'Unable to connect to server. Please try again.',
    };
  }
}

/**
 * Sign in existing user with Email and Password
 */
export async function signInUser({ email, password }) {
  try {
    const response = await axios.post(`${API_BASE_URL}/signin`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      success: false,
      error: error.message || 'Unable to connect to server. Please try again.',
    };
  }
}

/**
 * Authenticate with Google ID Token credential
 */
export async function googleAuthenticate(credential) {
  try {
    const response = await axios.post(`${API_BASE_URL}/google`, {
      credential,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      success: false,
      error: error.message || 'Google authentication failed. Please try again.',
    };
  }
}

/**
 * Fetch current authenticated user profile
 */
export async function fetchCurrentProfile(token) {
  try {
    const response = await axios.get(`${API_BASE_URL}/me`, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      success: false,
      error: error.message || 'Failed to verify session.',
    };
  }
}
