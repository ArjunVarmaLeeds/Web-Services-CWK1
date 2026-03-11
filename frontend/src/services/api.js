import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const auth = {
  login: (email, password) => api.post("/api/auth/login", { email, password }),
  register: (email, password) => api.post("/api/auth/register", { email, password }),
  me: () => api.get("/api/auth/me"),
};

export const players = {
  ingest: (tag) => api.post(`/api/player/ingest/${encodeURIComponent(tag)}`),
  ingestBattles: (tag) => api.post(`/api/player/ingest/battles/${encodeURIComponent(tag)}`),
  profile: (tag) => api.get(`/api/player/${encodeURIComponent(tag)}`),
  overview: (tag) => api.get(`/api/player/${encodeURIComponent(tag)}/overview`),
  playstyle: (tag) => api.get(`/api/player/${encodeURIComponent(tag)}/playstyle`),
  cardIntelligence: (tag) => api.get(`/api/player/${encodeURIComponent(tag)}/cardIntelligence`),
  compare: (tag1, tag2) => api.get(`/api/player/compare`, { params: { tag1, tag2 } }),
};

export const admin = {
  listUsers: () => api.get("/api/users"),
  getUser: (id) => api.get(`/api/users/${id}`),
  createUser: (email, password) => api.post("/api/users", { email, password }),
  updateUser: (id, data) => api.put(`/api/users/${id}`, data),
  deleteUser: (id) => api.delete(`/api/users/${id}`),
};

export default api;
