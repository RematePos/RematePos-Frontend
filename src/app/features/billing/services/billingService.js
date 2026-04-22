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

export async function findCustomerByDocument(documentNumber) {
  const cleanDocument = String(documentNumber || "").trim();

  if (!cleanDocument) {
    throw new Error("Debes ingresar un documento para consultar el cliente.");
  }

  const response = await fetch(
    `${API_GATEWAY_URL}/customers/search?document=${encodeURIComponent(
      cleanDocument
    )}`,
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
  const cleanInvoiceNumber = String(invoiceNumber || "").trim();

  if (!cleanInvoiceNumber) {
    throw new Error("Debes ingresar un número de factura.");
  }

  const response = await fetch(
    `${API_GATEWAY_URL}/billing/invoices/${encodeURIComponent(
      cleanInvoiceNumber
    )}/copy`,
    {
      method: "GET",
      headers: buildHeaders(),
    }
  );

  return parseResponse(response);
}

export async function startBilling(payload) {
  const response = await fetch(`${API_GATEWAY_URL}/billing/start`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}