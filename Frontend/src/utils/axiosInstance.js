import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, // Change to your backend base URL
  withCredentials: true, // if using cookies
});

export default axiosInstance;
