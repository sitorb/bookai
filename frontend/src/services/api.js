import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Set the JWT token for every request
const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const api = {
    // The Oracle
    getRandomBook: () => axios.get(`${API_URL}/discovery/random/`),
    
    // The Library Search
    searchBooks: (query) => axios.get(`${API_URL}/discovery/?q=${query}`),

    // The Journal
    getArticles: () => axios.get(`${API_URL}/articles/`),
    createArticle: (data) => axios.post(`${API_URL}/articles/`, data, getAuthHeaders()),

    // THE NOOKS (New!)
    getNooks: () => axios.get(`${API_URL}/nooks/`, getAuthHeaders()),
    createNook: (name) => axios.post(`${API_URL}/nooks/`, { name }, getAuthHeaders()),
    addToNook: (nookId, articleId) => 
        axios.post(`${API_URL}/nooks/${nookId}/add_article/`, { article_id: articleId }, getAuthHeaders()),
};