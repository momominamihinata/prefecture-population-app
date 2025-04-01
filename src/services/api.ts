import axios from 'axios';

const BASE_URL = 'https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY,
  },
});

export default api;