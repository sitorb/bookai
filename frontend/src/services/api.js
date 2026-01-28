import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
});

export const getRecommendations = async (text, token) => {
  const response = await api.post(
    "recommend/",
    { text },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export default api;
