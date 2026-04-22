import React, { useState } from "react";
import { processReturn } from "../services/billingService";

export default function ReturnsPage() {
  const [form, setForm] = useState({
    invoiceNumber: "",
    productCode: "",
    quantity: "",
    reason: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (
      !form.invoiceNumber.trim() ||
      !form.productCode.trim() ||
      !form.quantity.trim() ||
      !form.reason.trim()
    ) {
      setError("Todos los campos de devolución son obligatorios.");
      return;
    }

    setLoading(true);

    try {
      await processReturn({
        invoiceNumber: form.invoiceNumber.trim(),
        productCode: form.productCode.trim(),
        quantity: Number(form.quantity),
        reason: form.reason.trim(),
      });

      setMessage("Devolución registrada correctamente.");
      setForm({
        invoiceNumber: "",
        productCode: "",
        quantity: "",
        reason: "",
      });
    } catch (err) {
      setError(err.message || "No fue posible registrar la devolución.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Devoluciones</h2>
      <p style={styles.subtitle}>
        Registra devoluciones a partir del número de factura.
      </p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="invoiceNumber"
          value={form.invoiceNumber}
          onChange={handleChange}
          placeholder="Número de factura"
          style={styles.input}
        />

        <input
          type="text"
          name="productCode"
          value={form.productCode}
          onChange={handleChange}
          placeholder="Código del producto"
          style={styles.input}
        />

        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Cantidad"
          min="1"
          style={styles.input}
        />

        <textarea
          name="reason"
          value={form.reason}
          onChange={handleChange}
          placeholder="Motivo de la devolución"
          rows="4"
          style={styles.textarea}
        />

        {message && <div style={styles.success}>{message}</div>}
        {error && <div style={styles.error}>{error}</div>}

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Procesando..." : "Registrar devolución"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  title: {
    marginTop: 0,
  },
  subtitle: {
    color: "#5b6472",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
  },
  textarea: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    resize: "vertical",
  },
  button: {
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#fff",
    padding: "12px 18px",
    fontWeight: "700",
    cursor: "pointer",
  },
  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "12px",
    borderRadius: "10px",
  },
  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "12px",
    borderRadius: "10px",
  },
};