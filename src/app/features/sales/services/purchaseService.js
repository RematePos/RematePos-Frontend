const RAW_API_URL =
  process.env.REACT_APP_API_GATEWAY_URL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:8080";

const normalizeApiRoot = (value) => {
  const base = value.replace(/\/+$/, "");

  if (base.endsWith("/api/v1")) {
    return base;
  }

  return `${base}/api/v1`;
};

const API_ROOT = normalizeApiRoot(RAW_API_URL);
const PURCHASE_BASE_URL = `${API_ROOT}/purchases`;
const INVOICE_BASE_URL = `${API_ROOT}/invoices`;

const jsonHeaders = {
  "Content-Type": "application/json",
};

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
        `No fue posible completar la operación. Código: ${response.status}`
    );
  }

  return data;
}

export async function checkoutPurchase(payload) {
  const response = await fetch(`${PURCHASE_BASE_URL}/checkout`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function registerPurchasePayment(purchaseId, payload) {
  const response = await fetch(`${PURCHASE_BASE_URL}/${purchaseId}/pay`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function createGatewayPayment(purchaseId, payload) {
  const response = await fetch(`${PURCHASE_BASE_URL}/${purchaseId}/gateway-payment`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function approveSandboxPayment(payload) {
  const response = await fetch(`${PURCHASE_BASE_URL}/payments/webhook/sandbox`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function getPurchaseHistory(documentType, documentNumber) {
  const params = new URLSearchParams({
    type: documentType,
    number: documentNumber,
  });

  const response = await fetch(`${PURCHASE_BASE_URL}/history?${params.toString()}`, {
    method: "GET",
    headers: jsonHeaders,
  });
  const data = await parseResponse(response);

  return Array.isArray(data) ? data : [];
}

export async function getInvoiceByPurchaseId(purchaseId) {
  const response = await fetch(`${INVOICE_BASE_URL}/purchase/${purchaseId}`, {
    method: "GET",
    headers: jsonHeaders,
  });

  return parseResponse(response);
}
