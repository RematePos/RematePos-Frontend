import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/AuthService";
import "./LoginPage.css";

export default function RegisterPage() {
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
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.username.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
      setError("Todos los campos son obligatorios.");
      return false;
    }

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setError("La contraseña y la confirmación no coinciden.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      await registerUser({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        username: form.username.trim(),
        password: form.password.trim(),
      });

      setMessage("Registro exitoso. Ahora puedes iniciar sesión.");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(err.message || "No fue posible completar el registro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page--register">
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
            <p className="auth-eyebrow">Crea tu acceso</p>
            <h1>Crea tu cuenta</h1>
            <p>
              Registra tu perfil en un sistema POS con estética oscura premium,
              claro, ágil y consistente.
            </p>
          </div>

          <ul className="auth-benefits">
            <li>Registro rápido y sencillo</li>
            <li>Acceso seguro al sistema</li>
            <li>Interfaz amigable y clara</li>
          </ul>
        </section>

        <section className="auth-panel auth-panel-form auth-panel-form--register">
          <div className="auth-form-head">
            <p className="auth-eyebrow">Registro</p>
            <h2>Registro</h2>
            <p>Completa tus datos para crear una nueva cuenta.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form auth-form--register">
            <div className="auth-grid auth-grid--two">
              <div className="auth-field">
                <label className="auth-label" htmlFor="fullName">
                  Nombre completo
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Ej: Carlos Andrés"
                  className="auth-input"
                />
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="email">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  className="auth-input"
                />
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="username">
                  Usuario
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Escribe tu usuario"
                  className="auth-input"
                  autoComplete="username"
                />
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="password">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  className="auth-input"
                  autoComplete="new-password"
                />
              </div>

              <div className="auth-field auth-field--full">
                <label className="auth-label" htmlFor="confirmPassword">
                  Confirmar contraseña
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repite la contraseña"
                  className="auth-input"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {message && <div className="auth-alert auth-alert-success">{message}</div>}
            {error && <div className="auth-alert auth-alert-error">{error}</div>}

            <button type="submit" disabled={loading} className="auth-button auth-button-primary">
              {loading ? "Registrando..." : "Crear cuenta"}
            </button>
          </form>

          <div className="auth-footer">
            <span>¿Ya tienes cuenta?</span>
            <Link to="/login">Inicia sesión aquí</Link>
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
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
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
    background: "rgba(255,255,255,0.18)",
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
    color: "rgba(255,255,255,0.92)",
  },
  featureList: {
    marginTop: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  featureItem: {
    background: "rgba(255,255,255,0.12)",
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
  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "12px 14px",
    borderRadius: "12px",
    fontSize: "14px",
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