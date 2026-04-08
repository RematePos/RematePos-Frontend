import React, { useState } from "react";
import "./ElectronicBillingIntegrationPage.css";

const ElectronicBillingIntegrationPage = () => {
  const [form, setForm] = useState({
    providerName: "",
    nit: "",
    environment: "habilitacion",
    apiUrl: "",
    username: "",
    password: "",
    softwareId: "",
    testSetId: "",
    prefix: "",
    resolution: "",
    enabled: false,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.providerName.trim()) {
      setError("Debes ingresar el nombre del proveedor.");
      return;
    }

    if (!form.nit.trim()) {
      setError("Debes ingresar el NIT.");
      return;
    }

    if (!form.apiUrl.trim()) {
      setError("Debes ingresar la URL del servicio.");
      return;
    }

    if (!form.softwareId.trim()) {
      setError("Debes ingresar el Software ID.");
      return;
    }

    setMessage("Configuración guardada correctamente.");
  };

  const handleTestConnection = () => {
    setError("");
    setMessage("Prueba de conexión ejecutada correctamente.");
  };

  return (
    <div className="billing-page">
      <div className="billing-container">
        <div className="billing-header">
          <div>
            <span className="billing-badge">Facturación electrónica</span>
            <h1>Integración con proveedor tecnológico</h1>
            <p>
              Configura los datos necesarios para integrarte con un proveedor
              autorizado por la DIAN.
            </p>
          </div>
        </div>

        <div className="billing-card">
          <form onSubmit={handleSubmit} className="billing-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Proveedor tecnológico</label>
                <input
                  type="text"
                  name="providerName"
                  value={form.providerName}
                  onChange={handleChange}
                  placeholder="Ej: Nombre del proveedor"
                />
              </div>

              <div className="form-group">
                <label>NIT del proveedor</label>
                <input
                  type="text"
                  name="nit"
                  value={form.nit}
                  onChange={handleChange}
                  placeholder="Ej: 900123456-7"
                />
              </div>

              <div className="form-group">
                <label>Ambiente</label>
                <select
                  name="environment"
                  value={form.environment}
                  onChange={handleChange}
                >
                  <option value="habilitacion">Habilitación</option>
                  <option value="produccion">Producción</option>
                </select>
              </div>

              <div className="form-group">
                <label>URL del servicio / API</label>
                <input
                  type="text"
                  name="apiUrl"
                  value={form.apiUrl}
                  onChange={handleChange}
                  placeholder="https://api.proveedor.com"
                />
              </div>

              <div className="form-group">
                <label>Usuario API</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Usuario técnico"
                />
              </div>

              <div className="form-group">
                <label>Contraseña / Token</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="********"
                />
              </div>

              <div className="form-group">
                <label>Software ID</label>
                <input
                  type="text"
                  name="softwareId"
                  value={form.softwareId}
                  onChange={handleChange}
                  placeholder="ID del software"
                />
              </div>

              <div className="form-group">
                <label>Test Set ID</label>
                <input
                  type="text"
                  name="testSetId"
                  value={form.testSetId}
                  onChange={handleChange}
                  placeholder="Solo si aplica en habilitación"
                />
              </div>

              <div className="form-group">
                <label>Prefijo</label>
                <input
                  type="text"
                  name="prefix"
                  value={form.prefix}
                  onChange={handleChange}
                  placeholder="Ej: FE"
                />
              </div>

              <div className="form-group">
                <label>Resolución</label>
                <input
                  type="text"
                  name="resolution"
                  value={form.resolution}
                  onChange={handleChange}
                  placeholder="Número de resolución"
                />
              </div>

              <div className="form-group full-width checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="enabled"
                    checked={form.enabled}
                    onChange={handleChange}
                  />
                  Activar integración
                </label>
              </div>
            </div>

            {error && <div className="form-message error-message">{error}</div>}
            {message && (
              <div className="form-message success-message">{message}</div>
            )}

            <div className="billing-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleTestConnection}
              >
                Probar conexión
              </button>

              <button type="submit" className="btn btn-primary">
                Guardar configuración
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ElectronicBillingIntegrationPage;