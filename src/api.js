import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({ baseURL });

// Small helpers so pages don't repeat themselves
export const money = (n) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "GHS" }).format(Number(n || 0));

export const shortDate = (d) => (d ? new Date(d).toLocaleDateString() : "—");
