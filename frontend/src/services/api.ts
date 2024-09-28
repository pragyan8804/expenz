/// <reference types="vite/client" />

import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Signup
export const signup = async (data: { name: string; username: string; password: string }) => {
  const response = await API.post('/api/auth/signup', data);
  return response.data;
};

// Login
export const login = async (data: { username: string; password: string }) => {
  const response = await API.post('/api/auth/login', data);
  return response.data;
};
