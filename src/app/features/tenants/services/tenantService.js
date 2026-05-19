import api from "../../../services/api";

export const listTenants = () => api.get("/tenants");

export const createTenant = (payload) => api.post("/tenants", payload);

export const getTenant = (tenantId) => api.get(`/tenants/${tenantId}`);

export const suspendTenant = (tenantId) =>
  api.patch(`/tenants/${tenantId}/suspend`);

export const activateTenant = (tenantId) =>
  api.patch(`/tenants/${tenantId}/activate`);
