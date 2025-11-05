const sanitizeBaseUrl = (url) => {
  if (!url) {
    return "";
  }

  return url.endsWith("/") ? url.slice(0, -1) : url;
};

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export const API_BASE_URL = sanitizeBaseUrl(rawBaseUrl);

export const buildApiUrl = (path = "") => {
  if (!path) {
    return API_BASE_URL;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("/")) {
    return `${API_BASE_URL}${path}`;
  }

  return `${API_BASE_URL}/${path}`;
};

