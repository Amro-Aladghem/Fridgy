import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5112/api/v1',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = error.response?.status ?? 500;
    const message =
      error.response?.data?.message ??
      error.response?.data ??
      'Unexpected error occurred';

    return Promise.reject({ message, statusCode });
  },
);

export default api;
