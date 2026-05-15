import React, { useState } from "react";
import "./AccountSettingsPage.css";

const ACCOUNT_PENDING_MESSAGE =
  "Esta pantalla sera conectada a autenticacion real, JWT y gestion segura de usuarios en una HU futura.";

const AccountSettingsPage = () => {
  const [profileForm, setProfileForm] = useState({
    username: "admin_rematepos",
    email: "admin@rematepos.com",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileMessage("");
    setProfileError(ACCOUNT_PENDING_MESSAGE);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    const accountSecurityEnabled =
      process.env.REACT_APP_ENABLE_ACCOUNT_SECURITY === "true";
    if (!accountSecurityEnabled) {
      setPasswordError(ACCOUNT_PENDING_MESSAGE);
      return;
    }

    if (!passwordForm.currentPassword.trim()) {
      setPasswordError("Debes ingresar la contraseña actual.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("La nueva contraseña debe tener mínimo 8 caracteres.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("La confirmación de contraseña no coincide.");
      return;
    }

    setPasswordMessage("Contraseña actualizada correctamente.");

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="account-page">
      <div className="account-container">
        <div className="account-header">
          <div>
            <span className="account-badge">Configuración</span>
            <h1>Cuenta y seguridad</h1>
            <p>Administra tu usuario, correo y contraseña del sistema.</p>
          </div>
        </div>

        <div className="account-warning">{ACCOUNT_PENDING_MESSAGE}</div>

        <div className="account-grid">
          <div className="account-card">
            <h2>Información de usuario</h2>
            <p className="card-description">
              Actualiza el nombre de usuario y el correo asociado a tu cuenta.
            </p>

            <form onSubmit={handleProfileSubmit} className="account-form">
              <div className="form-group">
                <label>Nombre de usuario</label>
                <input
                  type="text"
                  name="username"
                  value={profileForm.username}
                  onChange={handleProfileChange}
                  placeholder="Ej: admin_rematepos"
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  placeholder="correo@empresa.com"
                  disabled
                />
              </div>

              {profileError && (
                <div className="form-message error-message">{profileError}</div>
              )}

              {profileMessage && (
                <div className="form-message success-message">
                  {profileMessage}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-disabled"
                aria-label="Pendiente de autenticacion"
                disabled
              >
                Pendiente de autenticacion
              </button>
            </form>
          </div>

          <div className="account-card">
            <h2>Cambiar contraseña</h2>
            <p className="card-description">
              Protege tu cuenta con una contraseña segura y actualizada.
            </p>

            <form onSubmit={handlePasswordSubmit} className="account-form">
              <div className="form-group">
                <label>Contraseña actual</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="********"
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Nueva contraseña</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="********"
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Confirmar nueva contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="********"
                  disabled
                />
              </div>

              {passwordError && (
                <div className="form-message error-message">{passwordError}</div>
              )}

              {passwordMessage && (
                <div className="form-message success-message">
                  {passwordMessage}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-disabled"
                aria-label="Pendiente de autenticacion"
                disabled
              >
                Actualizar contraseña
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;
