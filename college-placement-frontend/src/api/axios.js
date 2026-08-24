import axios from "axios";

export const AUTH_STORAGE_KEY = "cpp_auth";

// --- localStorage helpers ---

export function readStoredAuth() {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token ? parsed : null;
  } catch {
    return null;
  }
}

export function writeStoredAuth(auth) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function clearStoredAuth() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

// --- Axios instance ---

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { Accept: "application/json" },
});

// Attach JWT to every request if we have one
api.interceptors.request.use((config) => {
  const auth = readStoredAuth();
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

// Handle 401 — clear session and redirect to login
let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const hadToken = !!readStoredAuth()?.token;
      if (hadToken) {
        clearStoredAuth();
        unauthorizedHandler?.();
      }
    }
    return Promise.reject(error);
  }
);

// --- Response envelope unwrapper ---
// Backend wraps every response as { success, message, data }
export function unwrap(payload) {
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data;
  }
  return payload;
}

// --- User-friendly error messages ---
export function toFriendlyMessage(error, fallback = "Something went wrong. Please try again.") {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Unable to reach the server. Please check your connection and try again.";
    }

    const status = error.response.status;
    const data = error.response.data;

    let backendMessage;
    if (typeof data === "string" && !data.trim().startsWith("<")) {
      backendMessage = data;
    } else if (data && typeof data === "object") {
      backendMessage =
        data.message ||
        data.error ||
        (Array.isArray(data.errors)
          ? data.errors.map((e) => e.msg || e.message).filter(Boolean).join(", ")
          : undefined);
    }

    if (status === 401) return backendMessage || "Your session has expired. Please login again.";
    if (status === 403) return backendMessage || "You are not authorized to perform this action.";
    if (status === 404) return backendMessage || "The requested resource was not found.";
    if (status === 409) return backendMessage || "A conflict occurred. This record may already exist.";
    if (status >= 500) return backendMessage || "The server ran into a problem. Please try again shortly.";
    return backendMessage || fallback;
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default api;
