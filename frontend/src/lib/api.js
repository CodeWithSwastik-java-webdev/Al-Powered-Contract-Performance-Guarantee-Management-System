import axios from 'axios';
const TOKEN_KEY = 'cpg_access_token';
let accessToken = localStorage.getItem(TOKEN_KEY);
export function setAccessToken(token) { accessToken = token; if (token)
    localStorage.setItem(TOKEN_KEY, token);
else
    localStorage.removeItem(TOKEN_KEY); }
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api/v1', headers: { 'Content-Type': 'application/json' }, timeout: 15000 });
api.interceptors.request.use((config) => { if (accessToken)
    config.headers.Authorization = `Bearer ${accessToken}`; return config; });
api.interceptors.response.use((response) => response, (error) => {
    if (error.response)
        return Promise.reject(new Error(error.response.data?.error?.message ?? error.response.data?.message ?? 'An unexpected error occurred'));
    return Promise.reject(new Error(error.request ? 'Network error — please check your connection' : 'An unexpected error occurred'));
});
export default api;
