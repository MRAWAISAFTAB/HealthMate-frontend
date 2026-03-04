import axios from 'axios';

// 1. Dynamic Base URL (Switch between Local and Production Vercel)
const API = axios.create({
    baseURL: process.env.VITE_API_URL || 'https://health-mate-backend-2fsdaccjg-mrawaisaftabs-projects.vercel.app/api',
    timeout: 15000, // 15s timeout - essential for mobile networks
});

// 2. Request Interceptor (Auth Token)
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
}, (error) => {
    return Promise.reject(error);
});

// 3. Response Interceptor (The "iPhone-Style" Smooth Error Handling)
// This catches 401 (Expired Token) and kicks the user to Login automatically
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login'; // Or use your router navigation
        }
        return Promise.reject(error);
    }
);

// --- API Methods ---

export const uploadReport = async (formData) => {
    // Note: Axios automatically sets multipart/form-data headers when it sees FormData
    const response = await API.post('/reports/upload', formData);
    return response.data;
};

export const fetchVitals = () => API.get('/vitals');

export const addVital = (data) => API.post('/vitals/add', data);

export default API;