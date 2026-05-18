import { getToken, logout } from "../features/auth/services/AuthService";

const RAW_API_URL =
  process.env.REACT_APP_API_GATEWAY_URL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:8080";

export const normalizeApiRoot = (value = RAW_API_URL) => {
  const base = String(value || "").replace(/\/+$/, "");

  if (base.endsWith("/api/v1")) return base;
  if (base.endsWith("/api")) return `${base}/v1`;

  return `${base}/api/v1`;
};

export const API_BASE_URL = normalizeApiRoot(RAW_API_URL);

export function buildAuthHeaders(extraHeaders = {}) {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  let data = null;

  try {
    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : null;
    }
  } catch (error) {
    data = null;
  }

  if (response.status === 401) {
    logout();
    throw new Error("Tu sesion expiro. Inicia sesion nuevamente.");
  }

  if (response.status === 403) {
    throw new Error("No tienes permisos para esta accion");
  }

  if (!response.ok) {
    const nestedError = data?.error;
    const nestedMessage =
      nestedError && typeof nestedError === "object"
        ? Object.values(nestedError).find(
            (value) => typeof value === "string" && value.trim().length > 0
          )
        : nestedError;

    throw new Error(
      data?.message ||
        nestedMessage ||
        data ||
        `No fue posible completar la operacion. Codigo: ${response.status}`
    );
  }

  return data;
}

export async function request(endpoint, options = {}) {
  const { method = "GET", body, headers = {} } = options;
  const config = {
    method,
    headers: buildAuthHeaders(headers),
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  return parseResponse(response);
}

const api = {
  get: (endpoint, options) => request(endpoint, options),
  post: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: "POST", body }),
  put: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: "PUT", body }),
  patch: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: "PATCH", body }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: "DELETE" }),
};

export default api;
