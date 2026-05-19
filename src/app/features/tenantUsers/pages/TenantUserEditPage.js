import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import {
  listTenantUsers,
  updateTenantUser,
} from "../services/tenantUserService";
import {
  findTenantUser,
  getCurrentTenantId,
  isTenantOwnerUser,
  TENANT_USER_ROLES,
} from "./tenantUserHelpers";
import "./TenantUserPages.css";

export default function TenantUserEditPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();
  const tenantId = getCurrentTenantId(auth.user);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    role: "CASHIER",
    active: true,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const currentUser = useMemo(() => findTenantUser(users, userId), [users, userId]);
  const blockingError =
    error &&
    !loading &&
    (error.includes("No hay un negocio activo") ||
      error.includes("Usuario no encontrado") ||
      error.includes("No es posible editar al propietario principal"));

  useEffect(() => {
    const load = async () => {
      if (!tenantId) {
        setError("No hay un negocio activo en la sesion.");
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await listTenantUsers(tenantId);
        const nextUsers = Array.isArray(data) ? data : [];
        setUsers(nextUsers);
        const selected = findTenantUser(nextUsers, userId);
        if (!selected) {
          setError("Usuario no encontrado en el negocio activo.");
          return;
        }
        if (isTenantOwnerUser(selected)) {
          setError("No es posible editar al propietario principal desde esta pantalla.");
          return;
        }
        setForm({
          email: selected.email || "",
          fullName: selected.fullName || "",
          role: TENANT_USER_ROLES.some((role) => role.value === selected.role)
            ? selected.role
            : "CASHIER",
          active: Boolean(selected.active),
        });
      } catch (err) {
        setError(err.message || "No fue posible cargar el usuario.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [tenantId, userId]);

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    if (!tenantId) return "No hay un negocio activo en la sesion.";
    if (!form.email.trim()) return "El correo es obligatorio.";
    if (!TENANT_USER_ROLES.some((role) => role.value === form.role)) {
      return "El rol seleccionado no esta permitido.";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      setError("");
      await updateTenantUser(tenantId, userId, {
        email: form.email.trim(),
        fullName: form.fullName.trim(),
        role: form.role,
        active: form.active,
      });
      navigate("/settings/users", { replace: true });
    } catch (err) {
      setError(err.message || "No fue posible actualizar el usuario.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="tenant-users-page">
      <div className="tenant-users-shell">
        <header className="tenant-users-header">
          <div>
            <span className="tenant-users-eyebrow">Configuracion</span>
            <h1 className="tenant-users-title">Editar usuario</h1>
            <p className="tenant-users-subtitle">
              Actualiza correo, nombre, rol y estado de un usuario del negocio.
            </p>
          </div>
          <Link className="tenant-user-btn" to="/settings/users">
            Volver a usuarios
          </Link>
        </header>

        {error && <div className="tenant-users-error">{error}</div>}

        {blockingError && (
          <section className="tenant-users-panel tenant-users-panel-compact">
            <div className="tenant-users-state">
              <p className="tenant-users-control-title">Edicion bloqueada</p>
              <p className="tenant-users-control-text">{error}</p>
              <Link className="tenant-user-btn tenant-user-btn-secondary" to="/settings/users">
                Volver a usuarios
              </Link>
            </div>
          </section>
        )}

        {!blockingError && (
        <section className="tenant-users-panel">
          {loading ? (
            <div className="tenant-users-state">Cargando usuario...</div>
          ) : (
            <form className="tenant-users-form" onSubmit={handleSubmit}>
              {currentUser && (
                <div className="tenant-users-state">
                  Usuario: <strong>{currentUser.username}</strong>
                </div>
              )}

              <div className="tenant-users-form-grid">
                <div className="tenant-users-field">
                  <label htmlFor="edit-email">Correo</label>
                  <input id="edit-email" name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="tenant-users-field">
                  <label htmlFor="edit-full-name">Nombre completo</label>
                  <input id="edit-full-name" name="fullName" value={form.fullName} onChange={handleChange} />
                </div>
                <div className="tenant-users-field">
                  <label htmlFor="edit-role">Rol</label>
                  <select id="edit-role" name="role" value={form.role} onChange={handleChange}>
                    {TENANT_USER_ROLES.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="tenant-users-check">
                  <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
                  Usuario activo
                </label>
              </div>

              <div className="tenant-users-form-actions">
                <Link className="tenant-user-btn" to="/settings/users">
                  Cancelar
                </Link>
                <button className="tenant-user-btn tenant-user-btn-primary" type="submit" disabled={saving || !tenantId}>
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          )}
        </section>
        )}
      </div>
    </div>
  );
}
