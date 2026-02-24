import axios from "axios";
import Swal from "sweetalert2";

let sessionExpiredAlertShown = false;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

/* ================================
   REQUEST INTERCEPTOR
================================ */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ================================
   RESPONSE INTERCEPTOR CON REFRESH
================================ */
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    /* 🚫 NO aplicar refresh en login o refresh */
    if (
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    /* 👉 Si es 401 intentar refresh */
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refreshToken }
        );

        /* 👉 guardar nuevo token */
        localStorage.setItem("token", data.accessToken);

        /* 👉 actualizar header */
        originalRequest.headers.Authorization =
          `Bearer ${data.accessToken}`;

        /* 👉 reintentar request */
        return api(originalRequest);

      } catch (refreshError) {
        /* 🚨 Sesión expirada REAL */
        if (!sessionExpiredAlertShown) {
          sessionExpiredAlertShown = true;

          await Swal.fire({
            icon: "warning",
            title: "Sesión expirada",
            text: "Tu sesión ha caducado. Inicia sesión nuevamente.",
            confirmButtonColor: "#1A3263",
          });
        }

        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;