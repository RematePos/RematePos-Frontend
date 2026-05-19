import api from "../../../services/api";

export const listTenantUsers = (tenantId) => api.get(`/tenants/${tenantId}/users`);

export const createTenantUser = (tenantId, payload) =>
  api.post(`/tenants/${tenantId}/users`, payload);

export const updateTenantUser = (tenantId, userId, payload) =>
  api.patch(`/tenants/${tenantId}/users/${userId}`, payload);

export const disableTenantUser = (tenantId, userId) =>
  api.patch(`/tenants/${tenantId}/users/${userId}/disable`);

export const enableTenantUser = (tenantId, userId) =>
  api.patch(`/tenants/${tenantId}/users/${userId}/enable`);
