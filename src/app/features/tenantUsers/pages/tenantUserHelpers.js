export const TENANT_USER_ROLES = [
  { value: "CASHIER", label: "Cajero" },
  { value: "BUSINESS_ADMIN", label: "Administrador del negocio" },
];

export const TENANT_USER_ROLE_LABELS = {
  CASHIER: "Cajero",
  BUSINESS_ADMIN: "Administrador del negocio",
  BUSINESS_OWNER: "Propietario principal",
};

export const getCurrentTenantId = (user) =>
  user?.tenant?.tenantId || user?.tenant?.id || user?.tenantId || null;

export const getCurrentUserId = (user) =>
  user?.userId || user?.id || user?.tenantUserId || user?.accountId || null;

export const findTenantUser = (users, userId) =>
  users.find((user) => String(user.userId) === String(userId));

export const isTenantOwnerUser = (user) => user?.role === "BUSINESS_OWNER";

export const isSameTenantUser = (user, currentUser) => {
  const userId = getCurrentUserId(user);
  const currentUserId = getCurrentUserId(currentUser);

  if (!userId || !currentUserId) return false;

  return String(userId) === String(currentUserId);
};

export const canEditTenantUserRow = (user) =>
  ["CASHIER", "BUSINESS_ADMIN"].includes(user?.role);

export const canToggleTenantUserRow = (user, currentUser) =>
  canEditTenantUserRow(user) && !isSameTenantUser(user, currentUser);

export const getTenantUserRoleLabel = (role) =>
  TENANT_USER_ROLE_LABELS[role] || role || "Sin rol";
