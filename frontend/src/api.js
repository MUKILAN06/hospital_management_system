import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://hospital-management-system-riw1.onrender.com' : 'http://localhost:8080')
});

export default api;
