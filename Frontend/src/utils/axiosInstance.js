import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Change to your backend base URL
  withCredentials: true, // if using cookies
});

export default axiosInstance;
