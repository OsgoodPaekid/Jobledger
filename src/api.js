import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({ baseURL });

// Small helpers so pages don't repeat themselves
export const money = (n) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "GHS" }).format(Number(n || 0));

export const shortDate = (d) => (d ? new Date(d).toLocaleDateString() : "—");

// ---- Login token ----
const TOKEN_KEY = "jl_token";
export const getToken = () => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } };
export const setToken = (t) => { try { localStorage.setItem(TOKEN_KEY, t); } catch {} };
export const clearToken = () => { try { localStorage.removeItem(TOKEN_KEY); } catch {} };

api.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = "Bearer " + t;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const url = String((err.config && err.config.url) || "");
    if (err.response && err.response.status === 401 && !url.includes("/login")) {
      clearToken();
      window.location.reload();
    }
    return Promise.reject(err);
  }
);
