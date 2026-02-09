// frontend/src/services/api.js
import axios from 'axios';

// The base URL for your Django server
const API_BASE_URL = 'http://127.0.0.1:8000/api/recommend/';

export const getMoodRecommendations = async (userQuery) => {
    try {
        const response = await axios.post(`${API_BASE_URL}suggest/`, {
            query: userQuery
        });
        return response.data; // This returns { detected_mood: "...", recommendations: [...] }
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
    }
};

export const loginUser = async (username, password) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/token/', {
            username,
            password
        });
        // Save the token to the browser so we stay logged in
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        console.error("Login failed", error);
        throw error;
    }
};
// frontend/src/services/api.js

export const getFavorites = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/library/list/', {
            headers: { Authorization: `Token ${token}` }
        });
        return response.data.favorites;
    } catch (error) {
        console.error("Error fetching favorites", error);
        throw error;
    }
};

// frontend/src/services/api.js

export const removeFavorite = async (bookId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/library/remove/', 
        { book_id: bookId }, // Sending the ID as data
        {
            headers: { Authorization: `Token ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error removing favorite", error);
        throw error;
    }
};