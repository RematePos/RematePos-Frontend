const API_GATEWAY_URL =
  process.env.REACT_APP_API_GATEWAY_URL || "http://localhost:8080";

function getToken() {
  return sessionStorage.getItem("token") || localStorage.getItem("token") || "";
}

function buildHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseResponse(response) {
  let data = null;

  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || "Ocurrió un error al consumir el servicio.");
  }

  return data;
}

export async function findCustomerByDocument(documentNumber) {
  const response = await fetch(
    `${API_GATEWAY_URL}/customers/search?document=${encodeURIComponent(documentNumber)}`,
    {
      method: "GET",
      headers: buildHeaders(),
    }
  );

  if (response.status === 404) {
    return null;
  }

  return parseResponse(response);
}

export async function saveBillingStationConfig(payload) {
  const response = await fetch(`${API_GATEWAY_URL}/billing/pos-config`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function processReturn(payload) {
  const response = await fetch(`${API_GATEWAY_URL}/billing/returns`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function getInvoiceCopy(invoiceNumber) {
  const response = await fetch(
    `${API_GATEWAY_URL}/billing/invoices/${encodeURIComponent(invoiceNumber)}/copy`,
    {
      method: "GET",
      headers: buildHeaders(),
    }
  );

  return parseResponse(response);
}