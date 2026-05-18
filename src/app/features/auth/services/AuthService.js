const RAW_API_URL =
  process.env.REACT_APP_API_GATEWAY_URL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:8080";

const normalizeApiRoot = (value) => {
  const base = String(value || "").replace(/\/+$/, "");

  if (base.endsWith("/api/v1")) return base;
  if (base.endsWith("/api")) return `${base}/v1`;

  return `${base}/api/v1`;
};

const API_ROOT = normalizeApiRoot(RAW_API_URL);

const STORAGE_KEYS = {
  token: "token",
  tokenType: "tokenType",
  expiresAt: "authExpiresAt",
  user: "user",
  roles: "roles",
  permissions: "permissions",
};

const asArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const readJson = (key, fallback) => {
  try {
    const raw = sessionStorage.getItem(key) || localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
};

const normalizeLoginPayload = (payload = {}) => {
  const data = payload.data || payload;
  const user = data.user || {};
  const token = data.accessToken || data.token || user.accessToken || "";
  const roles = asArray(data.roles || user.roles);
  const permissions = asArray(data.permissions || user.permissions);

  return {
    ...data,
    accessToken: token,
    tokenType: data.tokenType || "Bearer",
    expiresIn: Number(data.expiresIn || 0),
    user: {
      ...user,
      roles,
      permissions,
    },
    roles,
    permissions,
  };
};

const persistSession = (session) => {
  const expiresAt = session.expiresIn
    ? Date.now() + Number(session.expiresIn)
    : null;

  sessionStorage.setItem(STORAGE_KEYS.token, session.accessToken);
  sessionStorage.setItem(STORAGE_KEYS.tokenType, session.tokenType || "Bearer");
  sessionStorage.setItem(STORAGE_KEYS.user, JSON.stringify(session.user || {}));
  sessionStorage.setItem(STORAGE_KEYS.roles, JSON.stringify(session.roles || []));
  sessionStorage.setItem(
    STORAGE_KEYS.permissions,
    JSON.stringify(session.permissions || [])
  );

  if (expiresAt) {
    sessionStorage.setItem(STORAGE_KEYS.expiresAt, String(expiresAt));
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.expiresAt);
  }
};

export async function login(credentials) {
  const response = await fetch(`${API_ROOT}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  let data = {};
  try {
    data = await response.json();
  } catch (error) {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || "Credenciales invalidas");
  }

  const session = normalizeLoginPayload(data);

  if (!session.accessToken) {
    throw new Error("El servicio no retorno un token de autenticacion");
  }

  persistSession(session);

  return session;
}

export async function registerUser(payload) {
  const response = await fetch(`${API_ROOT}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let data = {};
  try {
    data = await response.json();
  } catch (error) {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || "No fue posible registrar el usuario");
  }

  return data;
}

export function logout() {
  Object.values(STORAGE_KEYS).forEach((key) => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  });
}

export function getToken() {
  return (
    sessionStorage.getItem(STORAGE_KEYS.token) ||
    localStorage.getItem(STORAGE_KEYS.token)
  );
}

export function getCurrentUser() {
  return readJson(STORAGE_KEYS.user, null);
}

export function getRoles() {
  return readJson(STORAGE_KEYS.roles, []);
}

export function getPermissions() {
  return readJson(STORAGE_KEYS.permissions, []);
}

export function hasRole(role) {
  return getRoles().includes(role);
}

export function hasPermission(permission) {
  return getPermissions().includes(permission);
}

export function isAuthenticated() {
  const token = getToken();
  const expiresAt = Number(
    sessionStorage.getItem(STORAGE_KEYS.expiresAt) ||
      localStorage.getItem(STORAGE_KEYS.expiresAt) ||
      0
  );

  if (!token) return false;
  if (expiresAt && Date.now() > expiresAt) {
    logout();
    return false;
  }

  return true;
}
