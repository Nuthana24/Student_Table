import axios from "axios";

// Create a reusable API instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/students", // your backend URL
});

export default API;
