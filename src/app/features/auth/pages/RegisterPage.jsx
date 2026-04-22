import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/AuthService";

export default function RegisterPage() {
  const navigate = useNavigate();

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
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.leftPanel}>
          <div style={styles.brandBadge}>rematePOS</div>
          <h1 style={styles.leftTitle}>Crea tu cuenta</h1>
          <p style={styles.leftText}>
            Regístrate para acceder al sistema y gestionar ventas, inventario y
            facturación de forma rápida y organizada.
          </p>

          <div style={styles.featureList}>
            <div style={styles.featureItem}>✅ Registro rápido y sencillo</div>
            <div style={styles.featureItem}>✅ Acceso seguro al sistema</div>
            <div style={styles.featureItem}>✅ Interfaz amigable y clara</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.header}>
            <h2 style={styles.title}>Registro</h2>
            <p style={styles.subtitle}>
              Completa tus datos para crear una nueva cuenta.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nombre completo</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Ej: Carlos Andrés"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Usuario</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Escribe tu usuario"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Contraseña</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirmar contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repite la contraseña"
                style={styles.input}
              />
            </div>

            {message && <div style={styles.success}>{message}</div>}
            {error && <div style={styles.error}>{error}</div>}

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Registrando..." : "Crear cuenta"}
            </button>
          </form>

          <div style={styles.footer}>
            <span style={styles.footerText}>¿Ya tienes cuenta?</span>
            <Link to="/login" style={styles.link}>
              Inicia sesión aquí
            </Link>
          </div>
        </div>
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