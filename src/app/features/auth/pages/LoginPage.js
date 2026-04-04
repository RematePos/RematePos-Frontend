import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setError("Debes completar correo y contraseña.");
      return;
    }

    setError("");
    navigate("/products");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <span className="login-badge">Acceso</span>
        <h1>Iniciar sesión</h1>
        <p>Ingresa al sistema RematePOS.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-group">
            <label>Correo</label>
            <input
              type="email"
              name="email"
              placeholder="correo@empresa.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="login-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;