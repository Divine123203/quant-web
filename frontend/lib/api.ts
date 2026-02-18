import axios from 'axios';
import { Match } from '@/types';

const getBaseURL = () => {
  let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  if (url.endsWith('/')) url = url.slice(0, -1);
  return `${url}/api/v1/`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth interceptor removed for guest mode stability


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('Authentication required for this endpoint');
    }
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const getMatches = async (): Promise<Match[]> => {
  const response = await api.get('matches/');
  return response.data;
};

export default api;
