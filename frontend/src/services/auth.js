import api from "./api";

export const login = async (username, password) => {
  const res = await api.post("token/", { username, password });
  return res.data;
};

export const register = (username, email, password) =>
  API.post("users/register/", { username, email, password });
