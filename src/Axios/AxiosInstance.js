import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api", // Replace with your backend API URL
    withCredentials: true,
});

export default axiosInstance;
