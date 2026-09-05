import axios from 'axios';
const RAW_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
const API_BASE_URL = RAW_BASE ? `${RAW_BASE}/api/cadastral` : '/api/cadastral';

/**
 * Identifies cadastral parcel at clicked coordinates (lat, lng)
 */
export async function identifyParcel(lat, lng) {
  try {
    const response = await axios.post(`${API_BASE_URL}/identify`, {
      lat: Number(lat),
      lng: Number(lng)
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      success: false,
      failureClass: 'CLIENT_NETWORK_ERROR',
      message: error.message || 'Failed to connect to backend server. Make sure the backend is running.'
    };
  }
}

/**
 * Fetches owner & land-record details associated with selected parcel context
 */
export async function fetchOwnerDetails(parcelContext) {
  try {
    const response = await axios.post(`${API_BASE_URL}/owner-details`, parcelContext);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      success: false,
      message: error.message || 'Failed to retrieve owner details from server.'
    };
  }
}
