import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  getCurrentUser,
  getPermissions,
  getRoles,
  getToken,
  isAuthenticated as hasStoredSession,
  login as loginRequest,
  logout as clearSession,
} from "../services/AuthService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken());
  const [user, setUser] = useState(() => getCurrentUser());
  const [roles, setRoles] = useState(() => getRoles());
  const [permissions, setPermissions] = useState(() => getPermissions());
  const [loading, setLoading] = useState(false);

  const refreshSession = useCallback(() => {
    setToken(getToken());
    setUser(getCurrentUser());
    setRoles(getRoles());
    setPermissions(getPermissions());
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const session = await loginRequest(credentials);
      setToken(session.accessToken);
      setUser(session.user || null);
      setRoles(session.roles || []);
      setPermissions(session.permissions || []);
      return session;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
    setRoles([]);
    setPermissions([]);
  }, []);

  const hasRole = useCallback((role) => roles.includes(role), [roles]);
  const hasPermission = useCallback(
    (permission) => permissions.includes(permission),
    [permissions]
  );
  const hasAnyRole = useCallback(
    (requiredRoles = []) =>
      requiredRoles.length === 0 || requiredRoles.some((role) => roles.includes(role)),
    [roles]
  );
  const hasAnyPermission = useCallback(
    (requiredPermissions = []) =>
      requiredPermissions.length === 0 ||
      requiredPermissions.some((permission) => permissions.includes(permission)),
    [permissions]
  );

  const value = useMemo(
    () => ({
      user,
      roles,
      permissions,
      token,
      isAuthenticated: Boolean(token) && hasStoredSession(),
      loading,
      login,
      logout,
      refreshSession,
      hasRole,
      hasPermission,
      hasAnyRole,
      hasAnyPermission,
    }),
    [
      user,
      roles,
      permissions,
      token,
      loading,
      login,
      logout,
      refreshSession,
      hasRole,
      hasPermission,
      hasAnyRole,
      hasAnyPermission,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
