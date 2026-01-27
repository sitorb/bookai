import API from "./api";

export const login = (username, password) =>
  API.post("users/login/", { username, password });

export const register = (username, email, password) =>
  API.post("users/register/", { username, email, password });
