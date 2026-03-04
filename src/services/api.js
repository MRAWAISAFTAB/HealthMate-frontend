import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Request se pehle token khud hi attach ho jaye
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const uploadReport = async (formData) => {
    const response = await API.post('/reports/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

// Add this for Vitals
export const fetchVitals = () => API.get('/vitals');
export const addVital = (data) => API.post('/vitals/add', data);