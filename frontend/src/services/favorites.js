import api from "./api";

export const addFavorite = async (bookId) => {
  return api.post("favorites/", { book_id: bookId });
};

export const getFavorites = async () => {
  const res = await api.get("favorites/");
  return res.data;
};
