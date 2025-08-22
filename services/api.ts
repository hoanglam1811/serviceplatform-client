// services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true, // ✅ send HttpOnly cookies
});

export default api;