import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import { createTenantUser } from "../services/tenantUserService";
import { getCurrentTenantId, TENANT_USER_ROLES } from "./tenantUserHelpers";
import "./TenantUserPages.css";

const initialForm = {
  username: "",
  email: "",
  fullName: "",
  password: "",
  role: "CASHIER",
};

export default function TenantUserCreatePage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const tenantId = getCurrentTenantId(auth.user);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!tenantId) return "No hay un negocio activo en la sesion.";
    if (!form.username.trim()) return "El usuario es obligatorio.";
    if (!form.email.trim()) return "El correo es obligatorio.";
    if (form.password.length < 8) return "La contrasena debe tener minimo 8 caracteres.";
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
      await createTenantUser(tenantId, {
        username: form.username.trim(),
        email: form.email.trim(),
        fullName: form.fullName.trim(),
        password: form.password,
        role: form.role,
      });
      setForm(initialForm);
      navigate("/settings/users", { replace: true });
    } catch (err) {
      setError(err.message || "No fue posible crear el usuario.");
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
            <h1 className="tenant-users-title">Nuevo usuario</h1>
            <p className="tenant-users-subtitle">
              Crea un cajero o administrador del negocio activo.
            </p>
          </div>
          <Link className="tenant-user-btn" to="/settings/users">
            Volver a usuarios
          </Link>
        </header>

        {error && <div className="tenant-users-error">{error}</div>}

        <section className="tenant-users-panel">
          <form className="tenant-users-form" onSubmit={handleSubmit}>
            <div className="tenant-users-form-grid">
              <div className="tenant-users-field">
                <label htmlFor="tenant-user-username">Usuario</label>
                <input id="tenant-user-username" name="username" value={form.username} onChange={handleChange} required />
              </div>
              <div className="tenant-users-field">
                <label htmlFor="tenant-user-email">Correo</label>
                <input id="tenant-user-email" name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="tenant-users-field">
                <label htmlFor="tenant-user-full-name">Nombre completo</label>
                <input id="tenant-user-full-name" name="fullName" value={form.fullName} onChange={handleChange} />
              </div>
              <div className="tenant-users-field">
                <label htmlFor="tenant-user-password">Contrasena temporal</label>
                <input id="tenant-user-password" name="password" type="password" value={form.password} onChange={handleChange} required autoComplete="new-password" />
              </div>
              <div className="tenant-users-field">
                <label htmlFor="tenant-user-role">Rol</label>
                <select id="tenant-user-role" name="role" value={form.role} onChange={handleChange}>
                  {TENANT_USER_ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="tenant-users-form-actions">
              <Link className="tenant-user-btn" to="/settings/users">
                Cancelar
              </Link>
              <button className="tenant-user-btn tenant-user-btn-primary" type="submit" disabled={saving || !tenantId}>
                {saving ? "Creando..." : "Crear usuario"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
