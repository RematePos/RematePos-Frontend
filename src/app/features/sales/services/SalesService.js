import { buildAuthHeaders } from "../../../services/api";

const API_GATEWAY_URL =
  process.env.REACT_APP_API_GATEWAY_URL || "http://localhost:8080";

function buildHeaders(extraHeaders = {}) {
  return buildAuthHeaders(extraHeaders);
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
    if (response.status === 401) {
      throw new Error("Tu sesion expiro. Inicia sesion nuevamente.");
    }

    if (response.status === 403) {
      throw new Error("No tienes permisos para esta accion");
    }

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
