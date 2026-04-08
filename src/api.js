import axios from "axios";

// Create a reusable API instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // your backend URL
});

export default API;
