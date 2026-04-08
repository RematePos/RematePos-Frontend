import React, { useState } from "react";
import "./AccountSettingsPage.css";

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
    setProfileError("");
    setProfileMessage("");

    if (!profileForm.username.trim()) {
      setProfileError("El nombre de usuario es obligatorio.");
      return;
    }

    if (!profileForm.email.trim()) {
      setProfileError("El correo es obligatorio.");
      return;
    }

    setProfileMessage("Datos de usuario actualizados correctamente.");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

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

              <button type="submit" className="btn btn-primary">
                Guardar cambios
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

              <button type="submit" className="btn btn-primary">
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