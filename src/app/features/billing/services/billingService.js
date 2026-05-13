const API_GATEWAY_URL =
  process.env.REACT_APP_API_GATEWAY_URL || "http://localhost:8080";

const API_BASE_URL = `${API_GATEWAY_URL.replace(/\/$/, "")}/api/v1`;
const CUSTOMER_BASE_URL = `${API_BASE_URL}/customers`;
const INVOICE_BASE_URL = `${API_BASE_URL}/invoices`;
const PURCHASE_BASE_URL = `${API_BASE_URL}/purchases`;

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
        `No fue posible completar la operacion. Codigo: ${response.status}`
    );
  }

  return data;
}

export async function findCustomerByDocument(documentNumber, documentType = "CC") {
  const cleanDocument = String(documentNumber || "").trim();
  const cleanType = String(documentType || "CC").trim().toUpperCase();

  if (!cleanDocument) {
    throw new Error("Debes ingresar un documento para consultar el cliente.");
  }

  const response = await fetch(
    `${CUSTOMER_BASE_URL}/document?type=${encodeURIComponent(
      cleanType
    )}&number=${encodeURIComponent(cleanDocument)}`,
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

export async function findCustomerById(customerId) {
  const cleanId = String(customerId || "").trim();

  if (!cleanId) {
    throw new Error("Debes ingresar un ID de cliente.");
  }

  const response = await fetch(`${CUSTOMER_BASE_URL}/${cleanId}`, {
    method: "GET",
    headers: buildHeaders(),
  });

  return parseResponse(response);
}

export async function getAllCustomers() {
  const response = await fetch(CUSTOMER_BASE_URL, {
    method: "GET",
    headers: buildHeaders(),
  });

  const data = await parseResponse(response);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;

  return [];
}

export async function createCustomer(payload) {
  const response = await fetch(CUSTOMER_BASE_URL, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function updateCustomer(customerId, payload) {
  const response = await fetch(`${CUSTOMER_BASE_URL}/${customerId}`, {
    method: "PUT",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function deleteCustomer(customerId) {
  const response = await fetch(`${CUSTOMER_BASE_URL}/${customerId}`, {
    method: "DELETE",
    headers: buildHeaders(),
  });

  return parseResponse(response);
}

export async function saveBillingStationConfig(payload) {
  const response = await fetch(`${CUSTOMER_BASE_URL}/billing/pos-config`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function processReturn(payload) {
  const response = await fetch(`${PURCHASE_BASE_URL}/returns`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function getInvoiceCopy(invoiceNumber) {
  const cleanInvoiceNumber = normalizeInvoiceNumber(invoiceNumber);

  if (!cleanInvoiceNumber) {
    throw new Error("Debes ingresar un numero de factura.");
  }

  try {
    const response = await fetch(
      `${INVOICE_BASE_URL}/number/${encodeURIComponent(cleanInvoiceNumber)}`,
      {
        method: "GET",
        headers: buildHeaders(),
      }
    );

    return await parseResponse(response);
  } catch (error) {
    const response = await fetch(
      `${PURCHASE_BASE_URL}/invoice/${encodeURIComponent(cleanInvoiceNumber)}`,
      {
        method: "GET",
        headers: buildHeaders(),
      }
    );

    return mapPurchaseToInvoice(await parseResponse(response));
  }
}

export async function getRecentInvoices(limit = 10) {
  const response = await fetch(
    `${INVOICE_BASE_URL}/recent?limit=${encodeURIComponent(limit)}`,
    {
      method: "GET",
      headers: buildHeaders(),
    }
  );

  const data = await parseResponse(response);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;

  return [];
}

export async function startBilling(payload) {
  const response = await fetch(`${CUSTOMER_BASE_URL}/billing/start`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

function normalizeInvoiceNumber(value) {
  const clean = String(value || "").trim().toUpperCase();
  if (clean.startsWith("NV-")) {
    return `I${clean}`;
  }
  return clean;
}

function mapPurchaseToInvoice(purchase) {
  return {
    invoiceId: purchase.invoiceId,
    invoiceNumber: purchase.invoiceNumber,
    purchaseId: purchase.purchaseId,
    customerId: purchase.customerId,
    customerDocumentType: purchase.customerDocumentType,
    customerDocumentNumber: purchase.customerDocumentNumber,
    customerFullName: purchase.customerFullName,
    subtotal: purchase.subtotal,
    tax: purchase.tax,
    total: purchase.total,
    issuedAt: purchase.paidAt || purchase.createdAt,
    paymentStatus: purchase.paymentStatus,
    status: purchase.status,
    items: Array.isArray(purchase.items) ? purchase.items : [],
  };
}
