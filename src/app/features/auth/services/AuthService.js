const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080";

export async function login(credentials) {
  const response = await fetch(`${API_URL}/auth/login`, {
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
    throw new Error(data.message || "Credenciales inválidas");
  }

  const token = data.token || data.accessToken;
  const user = data.user || {};

  if (!token) {
    throw new Error("El servicio no retornó un token de autenticación");
  }

  sessionStorage.setItem("token", token);
  sessionStorage.setItem("user", JSON.stringify(user));

  return data;
}

export async function registerUser(payload) {
  const response = await fetch(`${API_URL}/auth/register`, {
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
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getToken() {
  return sessionStorage.getItem("token") || localStorage.getItem("token");
}