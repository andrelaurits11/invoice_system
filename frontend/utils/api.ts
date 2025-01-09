import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json',
  },
});

export default api;
