import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4300/api';

axios.defaults.headers.common['Authorization'] = '';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { _id, name, email: userEmail, plan, token } = res.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      set({ 
        user: { _id, name, email: userEmail, plan },
        token,
        isAuthenticated: true, 
        isLoading: false 
      });
      return true;
    } catch (err) {
      set({ 
        error: err.response?.data?.message || 'Invalid email or password',
        isLoading: false 
      });
      return false;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      const { _id, name: userName, email: userEmail, plan, token } = res.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      set({ 
        user: { _id, name: userName, email: userEmail, plan },
        token,
        isAuthenticated: true, 
        isLoading: false 
      });
      return true;
    } catch (err) {
      set({ 
        error: err.response?.data?.message || 'Registration failed',
        isLoading: false 
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    try {
      const res = await axios.get(`${API_URL}/auth/me`);
      set({ user: res.data, isAuthenticated: true, token });
    } catch (err) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  clearError: () => set({ error: null }),
}));

// Initialize axios headers on app load
const initToken = localStorage.getItem('token');
if (initToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${initToken}`;
}