export const TENANT_USER_ROLES = [
  { value: "CASHIER", label: "Cajero" },
  { value: "BUSINESS_ADMIN", label: "Administrador del negocio" },
];

export const getCurrentTenantId = (user) =>
  user?.tenant?.tenantId || user?.tenant?.id || user?.tenantId || null;

export const findTenantUser = (users, userId) =>
  users.find((user) => String(user.userId) === String(userId));
