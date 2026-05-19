import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createTenant } from "../services/tenantService";
import "./TenantPages.css";

const initialForm = {
  name: "",
  slug: "",
  ownerUsername: "",
  ownerEmail: "",
  ownerFullName: "",
  ownerPassword: "",
};

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function TenantCreatePage() {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "name" && !prev.slug ? { slug: slugify(value) } : {}),
    }));
  };

  const validate = () => {
    if (!form.name.trim()) return "El nombre del negocio es obligatorio.";
    if (!form.slug.trim()) return "El slug del negocio es obligatorio.";
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug.trim())) {
      return "El slug solo puede contener minusculas, numeros y guiones.";
    }
    if (!form.ownerUsername.trim()) return "El usuario owner es obligatorio.";
    if (!form.ownerEmail.trim()) return "El correo owner es obligatorio.";
    if (form.ownerPassword.length < 8) return "La contrasena debe tener minimo 8 caracteres.";
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");
      await createTenant({
        name: form.name.trim(),
        slug: form.slug.trim(),
        owner: {
          username: form.ownerUsername.trim(),
          email: form.ownerEmail.trim(),
          fullName: form.ownerFullName.trim(),
          password: form.ownerPassword,
        },
      });
      setForm(initialForm);
      setSuccess("Negocio y owner inicial creados correctamente.");
    } catch (err) {
      setError(err.message || "No fue posible crear el negocio.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="tenant-admin-page">
      <div className="tenant-admin-shell">
        <header className="tenant-admin-header">
          <div>
            <span className="tenant-admin-eyebrow">Plataforma</span>
            <h1 className="tenant-admin-title">Nuevo negocio</h1>
            <p className="tenant-admin-subtitle">
              Crea el tenant y su owner inicial. La contrasena solo se envia al
              backend y no se conserva en el navegador.
            </p>
          </div>
          <Link className="tenant-btn tenant-btn-muted" to="/platform/tenants">
            Volver a negocios
          </Link>
        </header>

        {error && <div className="tenant-error">{error}</div>}
        {success && <div className="tenant-success">{success}</div>}

        <section className="tenant-panel">
          <form className="tenant-form" onSubmit={handleSubmit}>
            <div className="tenant-form-section">
              <h2>Datos del negocio</h2>
              <div className="tenant-form-grid">
                <div className="tenant-field">
                  <label htmlFor="tenant-name">Nombre</label>
                  <input id="tenant-name" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="tenant-field">
                  <label htmlFor="tenant-slug">Slug</label>
                  <input id="tenant-slug" name="slug" value={form.slug} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="tenant-form-section">
              <h2>Owner inicial</h2>
              <div className="tenant-form-grid">
                <div className="tenant-field">
                  <label htmlFor="owner-username">Usuario</label>
                  <input id="owner-username" name="ownerUsername" value={form.ownerUsername} onChange={handleChange} required />
                </div>
                <div className="tenant-field">
                  <label htmlFor="owner-email">Correo</label>
                  <input id="owner-email" name="ownerEmail" type="email" value={form.ownerEmail} onChange={handleChange} required />
                </div>
                <div className="tenant-field">
                  <label htmlFor="owner-full-name">Nombre completo</label>
                  <input id="owner-full-name" name="ownerFullName" value={form.ownerFullName} onChange={handleChange} />
                </div>
                <div className="tenant-field">
                  <label htmlFor="owner-password">Contrasena temporal</label>
                  <input id="owner-password" name="ownerPassword" type="password" value={form.ownerPassword} onChange={handleChange} required autoComplete="new-password" />
                </div>
              </div>
            </div>

            <div className="tenant-form-actions">
              <Link className="tenant-btn tenant-btn-muted" to="/platform/tenants">
                Cancelar
              </Link>
              <button className="tenant-btn tenant-btn-primary" type="submit" disabled={saving}>
                {saving ? "Creando..." : "Crear negocio"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
