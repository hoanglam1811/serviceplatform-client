import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true, 
// });


const api = axios.create({
  baseURL: "http://localhost:5210/api",
  withCredentials: true, 
});

export default api;
