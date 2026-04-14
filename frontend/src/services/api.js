import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/books';

// DRF Token Auth header
const getAuthHeaders = () => ({
    headers: { Authorization: `Token ${localStorage.getItem('token')}` }
});

export const api = {
    // The Oracle
    getRandomBook: () => axios.get(`${BASE_URL}/discovery/random/`),

    // The Library Search
    searchBooks: (query) => axios.get(`${BASE_URL}/discovery/?q=${query}`),

    // The Journal
    getArticles: () => axios.get(`${BASE_URL}/articles/`),
    createArticle: (data) => axios.post(`${BASE_URL}/articles/`, data, getAuthHeaders()),

    // The Nooks (Collections)
    getNooks: () => axios.get(`${BASE_URL}/nooks/`, getAuthHeaders()),
    createNook: (name) => axios.post(`${BASE_URL}/nooks/`, { name }, getAuthHeaders()),
    addToNook: (nookId, articleId) =>
        axios.post(`${BASE_URL}/nooks/${nookId}/add_article/`, { article_id: articleId }, getAuthHeaders()),
    removeFromNook: (nookId, articleId) =>
        axios.post(`${BASE_URL}/nooks/${nookId}/toggle_article/`, { article_id: articleId }, getAuthHeaders()),
};
