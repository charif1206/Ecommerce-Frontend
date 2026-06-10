import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api", // Configurable backend API URL
    withCredentials: true,
});

export default axiosInstance;
