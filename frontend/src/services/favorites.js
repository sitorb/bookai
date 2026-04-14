import axios from 'axios';

const LIBRARY_BASE = 'http://127.0.0.1:8000/api/library';

const getAuthHeaders = () => ({
  headers: { Authorization: `Token ${localStorage.getItem('token')}` }
});

export const addFavorite = async (bookId) => {
  return axios.post(`${LIBRARY_BASE}/favorites/add/`, { book_id: bookId }, getAuthHeaders());
};

export const getFavorites = async () => {
  const res = await axios.get(`${LIBRARY_BASE}/favorites/`, getAuthHeaders());
  return res.data;
};
