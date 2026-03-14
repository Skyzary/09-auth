import axios from 'axios';

const baseURL = typeof window !== 'undefined' 
  ? '/api' 
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000') + '/api';

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
