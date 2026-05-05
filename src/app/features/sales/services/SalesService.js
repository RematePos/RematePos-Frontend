const API_GATEWAY_URL =
  process.env.REACT_APP_API_GATEWAY_URL || "http://localhost:8080";

function getToken() {
  return sessionStorage.getItem("token") || localStorage.getItem("token") || "";
}

function buildHeaders(extraHeaders = {}) {
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

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Ocurrió un error al consumir el servicio. Código: ${response.status}`
    );
  }

  return data;
}

export async function getPosProducts() {
  const response = await fetch(`${API_GATEWAY_URL}/inventory/products`, {
    method: "GET",
    headers: buildHeaders(),
  });

  return parseResponse(response);
}

export async function registerPosSale(payload) {
  const response = await fetch(`${API_GATEWAY_URL}/sales/pos`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}