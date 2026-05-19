import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";

const getPostLoginPath = (session, fallback) => {
  const roles = session?.roles || [];
  const permissions = session?.permissions || [];

  if (roles.includes("PLATFORM_SUPER_ADMIN")) {
    return "/platform/tenants";
  }

  if (
    permissions.includes("USERS_CREATE") ||
    permissions.includes("USERS_UPDATE") ||
    roles.includes("BUSINESS_OWNER") ||
    roles.includes("BUSINESS_ADMIN")
  ) {
    return "/settings/users";
  }

  if (
    permissions.includes("SALES_CREATE") ||
    permissions.includes("PRODUCTS_READ")
  ) {
    return fallback || "/sales";
  }

  return fallback || "/account";
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  useEffect(() => {
    document.body.classList.add("auth-route");
    const header = document.querySelector("#root > header") || document.querySelector("header");
    const previousDisplay = header ? header.style.display : "";

    if (header) {
      header.style.display = "none";
    }

    return () => {
      if (header) {
        header.style.display = previousDisplay;
      }
      document.body.classList.remove("auth-route");
    };
  }, []);

  useEffect(() => {
    if (auth.isAuthenticated) {
      const target = getPostLoginPath(
        {
          roles: auth.roles,
          permissions: auth.permissions,
        },
        null
      );
      navigate(target, { replace: true });
    }
  }, [auth.isAuthenticated, auth.permissions, auth.roles, navigate]);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const session = await auth.login(form);
      const previousTarget = location.state?.from?.pathname;
      const target = getPostLoginPath(session, previousTarget);
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.message || "No fue posible iniciar sesion.");
    }
  };

  return (
    <div className="auth-page auth-page--login">
      <div className="auth-shell">
        <section className="auth-panel auth-panel-hero">
          <div className="auth-brand">
            <span className="auth-brand-mark">R</span>
            <div>
              <strong>rematePOS</strong>
              <span>SaaS visual lab</span>
            </div>
          </div>

          <div className="auth-hero-copy">
            <p className="auth-eyebrow">Acceso seguro</p>
            <h1>Bienvenido de nuevo</h1>
            <p>
              Entra a un entorno POS conectado con autenticacion real, permisos por rol y contexto de negocio.
            </p>
          </div>

          <ul className="auth-benefits">
            <li>JWT validado por gateway</li>
            <li>Roles y permisos reales</li>
            <li>Inventario por negocio</li>
            <li>Ventas protegidas</li>
          </ul>
        </section>

        <section className="auth-panel auth-panel-form">
          <div className="auth-form-head">
            <p className="auth-eyebrow">Inicia sesion</p>
            <h2>Iniciar sesion</h2>
            <p>Ingresa tus credenciales para acceder a rematePOS.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-label" htmlFor="login-username">
                Usuario
              </label>
              <input
                id="login-username"
                type="text"
                name="username"
                placeholder="Escribe tu usuario"
                value={form.username}
                onChange={handleChange}
                required
                className="auth-input"
                autoComplete="username"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="login-password">
                Contrasena
              </label>
              <input
                id="login-password"
                type="password"
                name="password"
                placeholder="Escribe tu contrasena"
                value={form.password}
                onChange={handleChange}
                required
                className="auth-input"
                autoComplete="current-password"
              />
            </div>

            {error && <div className="auth-alert auth-alert-error">{error}</div>}

            <button type="submit" disabled={auth.loading} className="auth-button auth-button-primary">
              {auth.loading ? "Ingresando..." : "Entrar"}
            </button>
          </form>

          <div className="auth-footer">
            <span>No tienes cuenta?</span>
            <Link to="/register">Registrate aqui</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
