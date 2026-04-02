import axios from "axios";

// Create a reusable API instance
const API = axios.create({
  baseURL: "http://localhost:3000", // your backend URL
});

export default API;