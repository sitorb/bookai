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