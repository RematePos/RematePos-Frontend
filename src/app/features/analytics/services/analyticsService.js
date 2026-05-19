import api from "../../../services/api";

function detectStatus(message = "") {
  const normalized = String(message || "").toLowerCase();

  if (normalized.includes("no tienes permisos") || normalized.includes("403")) {
    return 403;
  }

  if (normalized.includes("tu sesion") || normalized.includes("unauthorized") || normalized.includes("401")) {
    return 401;
  }

  if (normalized.includes("not found") || normalized.includes("codigo: 404") || normalized.includes("404")) {
    return 404;
  }

  return undefined;
}

function wrapError(err) {
  const error = err instanceof Error ? err : new Error(String(err || "Error desconocido"));

  if (typeof error.status !== "number") {
    error.status = detectStatus(error.message);
  }

  throw error;
}

export async function getDashboard() {
  try {
    return await api.get("/analytics/dashboard");
  } catch (err) {
    wrapError(err);
  }
}

export async function getTopProducts() {
  try {
    return await api.get("/analytics/products/top");
  } catch (err) {
    wrapError(err);
  }
}

export async function getLowStockProducts() {
  try {
    return await api.get("/analytics/products/low-stock");
  } catch (err) {
    wrapError(err);
  }
}

export async function getRestockPredictions() {
  try {
    return await api.get("/analytics/predictions/restock");
  } catch (err) {
    wrapError(err);
  }
}

export async function getSalesTrend() {
  try {
    return await api.get("/analytics/sales/trend");
  } catch (err) {
    wrapError(err);
  }
}

const analyticsService = {
  getDashboard,
  getTopProducts,
  getLowStockProducts,
  getRestockPredictions,
  getSalesTrend,
};

export default analyticsService;
