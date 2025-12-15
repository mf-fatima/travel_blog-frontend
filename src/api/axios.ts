import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  AxiosHeaders,
} from "axios";

// ===============================================
// 🔹 Create Axios Instance
// ===============================================
const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true, // send cookies
});

// ===============================================
// 🔹 REQUEST INTERCEPTOR — ADD ACCESS TOKEN
// ===============================================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!config.headers) config.headers = new AxiosHeaders();
    if (accessToken) {
      (config.headers as AxiosHeaders).set(
        "Authorization",
        `Bearer ${accessToken}`
      );
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================================
// 🔹 RESPONSE INTERCEPTOR — HANDLE 401 + REFRESH
// ===============================================
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: any) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // =====================================================
    // 🔥 If 401 => attempt refresh-token
    // =====================================================
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If another refresh request is already happening...
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            (originalRequest.headers as AxiosHeaders).set(
              "Authorization",
              "Bearer " + token
            );
          }
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        // Call refresh-token endpoint using SAME instance
        const res = await api.get("/auth/get-access-token");

        // Correct path: res.data.data.accessToken
        const newAccessToken = res.data?.data?.accessToken;

        if (!newAccessToken) throw new Error("Invalid token refresh response");

        // Save new token
        localStorage.setItem("accessToken", newAccessToken);

        // Update future requests
        api.defaults.headers.common.Authorization =
          "Bearer " + newAccessToken;

        // Process queue
        processQueue(null, newAccessToken);
        isRefreshing = false;

        // Retry failed request
        if (originalRequest.headers) {
          (originalRequest.headers as AxiosHeaders).set(
            "Authorization",
            "Bearer " + newAccessToken
          );
        }

        return api(originalRequest);
      } catch (err) {
        // Refresh failed → logout
        processQueue(err, null);
        isRefreshing = false;
        localStorage.removeItem("accessToken");

        console.error("Refresh token failed:", err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
