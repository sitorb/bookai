import axios from 'axios';

const AUTH_BASE = 'http://127.0.0.1:8000/api';

export const login = async (username, password) => {
  const res = await axios.post(`${AUTH_BASE}/token/`, { username, password });
  return res.data;
};

export const register = (username, email, password) =>
  axios.post(`${AUTH_BASE}/users/register/`, { username, email, password });
