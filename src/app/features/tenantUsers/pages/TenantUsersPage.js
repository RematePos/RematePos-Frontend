import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import {
  disableTenantUser,
  enableTenantUser,
  listTenantUsers,
} from "../services/tenantUserService";
import { getCurrentTenantId } from "./tenantUserHelpers";
import "./TenantUserPages.css";

export default function TenantUsersPage() {
  const auth = useAuth();
  const tenantId = getCurrentTenantId(auth.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyUserId, setBusyUserId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const canCreateUser =
    auth.hasPermission("USERS_CREATE") ||
    auth.hasRole("BUSINESS_OWNER") ||
    auth.hasRole("BUSINESS_ADMIN");
  const canUpdateUser =
    auth.hasPermission("USERS_UPDATE") ||
    auth.hasRole("BUSINESS_OWNER") ||
    auth.hasRole("BUSINESS_ADMIN");

  const loadUsers = useCallback(async () => {
    if (!tenantId) {
      setError("No hay un negocio activo en la sesion.");
      setUsers([]);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await listTenantUsers(tenantId);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setUsers([]);
      setError(err.message || "No fue posible cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleStatus = async (user) => {
    if (!tenantId || !canUpdateUser) return;
    const action = user.active ? disableTenantUser : enableTenantUser;

    try {
      setBusyUserId(user.userId);
      setError("");
      setSuccess("");
      await action(tenantId, user.userId);
      setSuccess(user.active ? "Usuario desactivado." : "Usuario reactivado.");
      await loadUsers();
    } catch (err) {
      setError(err.message || "No fue posible actualizar el usuario.");
    } finally {
      setBusyUserId(null);
    }
  };

  return (
    <div className="tenant-users-page">
      <div className="tenant-users-shell">
        <header className="tenant-users-header">
          <div>
            <span className="tenant-users-eyebrow">Configuracion</span>
            <h1 className="tenant-users-title">Usuarios del negocio</h1>
            <p className="tenant-users-subtitle">
              Administra cajeros y administradores que operan dentro del tenant
              activo de tu sesion.
            </p>
          </div>
          <div className="tenant-users-actions">
            <button className="tenant-user-btn" onClick={loadUsers} disabled={loading || !tenantId}>
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
            {canCreateUser && tenantId && (
              <Link className="tenant-user-btn tenant-user-btn-primary" to="/settings/users/new">
                Nuevo usuario
              </Link>
            )}
          </div>
        </header>

        {error && <div className="tenant-users-error">{error}</div>}
        {success && <div className="tenant-users-success">{success}</div>}

        <section className="tenant-users-panel">
          {loading ? (
            <div className="tenant-users-state">Cargando usuarios...</div>
          ) : users.length === 0 ? (
            <div className="tenant-users-empty">No hay usuarios registrados.</div>
          ) : (
            <table className="tenant-users-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Nombre</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  {canUpdateUser && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.userId}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.fullName}</td>
                    <td>
                      <span className="tenant-user-role">{user.role}</span>
                    </td>
                    <td>
                      <span className={`tenant-user-status ${user.active ? "tenant-user-active" : "tenant-user-inactive"}`}>
                        {user.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    {canUpdateUser && (
                      <td>
                        <div className="tenant-users-actions">
                          <Link className="tenant-user-btn" to={`/settings/users/${user.userId}/edit`}>
                            Editar
                          </Link>
                          <button
                            className={user.active ? "tenant-user-btn tenant-user-btn-danger" : "tenant-user-btn tenant-user-btn-primary"}
                            onClick={() => handleStatus(user)}
                            disabled={busyUserId === user.userId}
                          >
                            {busyUserId === user.userId
                              ? "Guardando..."
                              : user.active
                              ? "Desactivar"
                              : "Reactivar"}
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
