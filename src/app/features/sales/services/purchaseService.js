import api from "../../../services/api";

export async function checkoutPurchase(payload) {
  return api.post("/purchases/checkout", payload);
}

export async function registerPurchasePayment(purchaseId, payload) {
  return api.post(`/purchases/${purchaseId}/pay`, payload);
}

export async function createGatewayPayment(purchaseId, payload) {
  return api.post(`/purchases/${purchaseId}/gateway-payment`, payload);
}

export async function approveSandboxPayment(payload) {
  return api.post("/purchases/payments/webhook/sandbox", payload);
}

export async function getPurchaseHistory(documentType, documentNumber) {
  const params = new URLSearchParams({
    type: documentType,
    number: documentNumber,
  });

  const data = await api.get(`/purchases/history?${params.toString()}`);
  return Array.isArray(data) ? data : [];
}

export async function getInvoiceByPurchaseId(purchaseId) {
  return api.get(`/invoices/purchase/${purchaseId}`);
}
