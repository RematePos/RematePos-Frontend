import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import {
  activateTenant,
  listTenants,
  suspendTenant,
} from "../services/tenantService";
import "./TenantPages.css";

const getTenantStatus = (tenant) =>
  (tenant.tenantStatus || tenant.status || "ACTIVE").toUpperCase();

export default function TenantListPage() {
  const auth = useAuth();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyTenantId, setBusyTenantId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canCreateTenant =
    auth.hasRole("PLATFORM_SUPER_ADMIN") || auth.hasPermission("TENANTS_CREATE");
  const canSuspendTenant =
    auth.hasRole("PLATFORM_SUPER_ADMIN") || auth.hasPermission("TENANTS_SUSPEND");

  const loadTenants = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await listTenants();
      setTenants(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "No fue posible cargar los negocios.");
      setTenants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  const handleStatusChange = async (tenant) => {
    const tenantId = tenant.tenantId || tenant.id;
    const status = getTenantStatus(tenant);
    const nextAction = status === "ACTIVE" ? suspendTenant : activateTenant;

    try {
      setBusyTenantId(tenantId);
      setError("");
      setSuccess("");
      await nextAction(tenantId);
      setSuccess(status === "ACTIVE" ? "Negocio suspendido." : "Negocio activado.");
      await loadTenants();
    } catch (err) {
      setError(err.message || "No fue posible actualizar el negocio.");
    } finally {
      setBusyTenantId(null);
    }
  };

  return (
    <div className="tenant-admin-page">
      <div className="tenant-admin-shell">
        <header className="tenant-admin-header">
          <div>
            <span className="tenant-admin-eyebrow">Plataforma</span>
            <h1 className="tenant-admin-title">Negocios</h1>
            <p className="tenant-admin-subtitle">
              Administra tenants activos de RematePOS, revisa su estado y crea el
              owner inicial para nuevos negocios.
            </p>
          </div>

          <div className="tenant-admin-actions">
            <button className="tenant-btn tenant-btn-muted" onClick={loadTenants} disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
            {canCreateTenant && (
              <Link className="tenant-btn tenant-btn-primary" to="/platform/tenants/new">
                Nuevo negocio
              </Link>
            )}
          </div>
        </header>

        {error && <div className="tenant-error">{error}</div>}
        {success && <div className="tenant-success">{success}</div>}

        <section className="tenant-panel">
          {loading ? (
            <div className="tenant-state">Cargando negocios...</div>
          ) : tenants.length === 0 ? (
            <div className="tenant-empty">No hay negocios registrados.</div>
          ) : (
            <table className="tenant-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Slug</th>
                  <th>Estado</th>
                  {canSuspendTenant && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant) => {
                  const tenantId = tenant.tenantId || tenant.id;
                  const status = getTenantStatus(tenant);
                  const isActive = status === "ACTIVE";
                  return (
                    <tr key={tenantId}>
                      <td>{tenant.tenantName || tenant.name || "Sin nombre"}</td>
                      <td>{tenant.tenantSlug || tenant.slug}</td>
                      <td>
                        <span className={`tenant-status tenant-status-${status.toLowerCase()}`}>
                          {status}
                        </span>
                      </td>
                      {canSuspendTenant && (
                        <td>
                          <button
                            className={isActive ? "tenant-btn tenant-btn-danger" : "tenant-btn tenant-btn-primary"}
                            onClick={() => handleStatusChange(tenant)}
                            disabled={busyTenantId === tenantId}
                          >
                            {busyTenantId === tenantId
                              ? "Guardando..."
                              : isActive
                              ? "Suspender"
                              : "Activar"}
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
