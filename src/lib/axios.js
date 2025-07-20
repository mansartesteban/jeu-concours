import axios from "axios";
import { useAuth } from "@/composables/useAuth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { logout } = useAuth();

    if (error.response && error.response.status === 401) {
      logout();
    }

    return Promise.reject(error);
  }
);

export default api;
