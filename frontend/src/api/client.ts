import axios, { AxiosError } from "axios";

// Backend base URL — set VITE_API_URL in .env (local) or in the Vercel project's
// environment variables (production). Must point at the deployed backend's /api root.
const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export const apiClient = axios.create({
  baseURL,
  withCredentials: true, // send/receive the HTTP-only session cookie cross-origin
  headers: { "Content-Type": "application/json" },
});

// Redirect to /login on an expired/invalid session, except for the auth endpoints
// themselves (a failed login attempt must not trigger a redirect loop).
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const url = error.config?.url ?? "";
    const isAuthCall = url.includes("/auth/");
    if (error.response?.status === 401 && !isAuthCall && window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
    return Promise.reject(error);
  },
);

export function apiErrorMessage(error: unknown, fallback = "Something went wrong."): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    if (error.message) return error.message;
  }
  return fallback;
}
