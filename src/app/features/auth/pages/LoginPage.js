import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/AuthService";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("auth-route");
    const header = document.querySelector('#root > header') || document.querySelector('header');
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

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "No fue posible iniciar sesión.");
    } finally {
      setLoading(false);
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
            <p className="auth-eyebrow">Acceso premium</p>
            <h1>Bienvenido de nuevo</h1>
            <p>
              Entra a un entorno POS con foco, velocidad y una experiencia visual
              construida para vender.
            </p>
          </div>

          <ul className="auth-benefits">
            <li>Acceso seguro</li>
            <li>Control de inventario</li>
            <li>Facturación centralizada</li>
            <li>Ventas rápidas</li>
          </ul>
        </section>

        <section className="auth-panel auth-panel-form">
          <div className="auth-form-head">
            <p className="auth-eyebrow">Inicia sesión</p>
            <h2>Iniciar sesión</h2>
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
                Contraseña
              </label>
              <input
                id="login-password"
                type="password"
                name="password"
                placeholder="Escribe tu contraseña"
                value={form.password}
                onChange={handleChange}
                required
                className="auth-input"
                autoComplete="current-password"
              />
            </div>

            {error && <div className="auth-alert auth-alert-error">{error}</div>}

            <button type="submit" disabled={loading} className="auth-button auth-button-primary">
              {loading ? "Ingresando..." : "Entrar"}
            </button>
          </form>

          <div className="auth-footer">
            <span>¿No tienes cuenta?</span>
            <Link to="/register">Regístrate aquí</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #eaf2ff 0%, #f8fbff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  container: {
    width: "100%",
    maxWidth: "1100px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    background: "#ffffff",
    borderRadius: "28px",
    overflow: "hidden",
    boxShadow: "0 20px 45px rgba(15, 23, 42, 0.12)",
  },
  leftPanel: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    color: "#ffffff",
    padding: "48px 40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  brandBadge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.14)",
    fontWeight: "800",
    marginBottom: "20px",
    width: "fit-content",
  },
  leftTitle: {
    margin: 0,
    fontSize: "38px",
    fontWeight: "800",
  },
  leftText: {
    marginTop: "16px",
    fontSize: "16px",
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.9)",
  },
  featureList: {
    marginTop: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  featureItem: {
    background: "rgba(255,255,255,0.10)",
    padding: "14px 16px",
    borderRadius: "14px",
    fontWeight: "600",
  },
  card: {
    padding: "42px 38px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  header: {
    marginBottom: "22px",
  },
  title: {
    margin: 0,
    fontSize: "32px",
    color: "#0f172a",
  },
  subtitle: {
    marginTop: "10px",
    color: "#64748b",
    lineHeight: 1.6,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "8px",
    fontWeight: "700",
    color: "#334155",
  },
  input: {
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "14px",
    background: "#f8fafc",
  },
  button: {
    marginTop: "8px",
    border: "none",
    borderRadius: "14px",
    background: "#2563eb",
    color: "#ffffff",
    padding: "14px 18px",
    fontWeight: "800",
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 10px 18px rgba(37, 99, 235, 0.22)",
  },
  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "12px 14px",
    borderRadius: "12px",
    fontSize: "14px",
  },
  footer: {
    marginTop: "22px",
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  footerText: {
    color: "#64748b",
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "700",
  },
};

void styles;