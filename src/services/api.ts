import axios from "axios";
import Swal from "sweetalert2";

let sessionExpiredAlertShown = false;
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

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

    /* 🚫 no aplicar refresh en login o refresh */
    if (
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    /* ================================
       TOKEN EXPIRADO
    ================================ */
    if (error.response?.status === 401 && !originalRequest._retry) {

      if (isRefreshing) {

        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));

      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {

        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refreshToken }
        );

        const newToken = data.accessToken;

        /* 👉 guardar nuevo token */
        localStorage.setItem("token", newToken);

        /* 👉 actualizar header global */
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);

      } catch (refreshError) {

        processQueue(refreshError, null);

        /* 🚨 sesión expirada real */
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

        return Promise.reject(refreshError);

      } finally {

        isRefreshing = false;

      }

    }

    return Promise.reject(error);

  }
);

export default api;