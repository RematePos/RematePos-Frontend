import React, { useState } from "react";
import { getInvoiceCopy } from "../services/billingService";

export default function InvoiceCopyPage() {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceData, setInvoiceData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setInvoiceData(null);

    if (!invoiceNumber.trim()) {
      setError("Debes ingresar un número de factura.");
      return;
    }

    setLoading(true);

    try {
      const data = await getInvoiceCopy(invoiceNumber.trim());
      setInvoiceData(data);
    } catch (err) {
      setError(err.message || "No fue posible consultar la copia de la factura.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Copia de facturas</h2>
      <p style={styles.subtitle}>
        Consulta una factura registrada y muestra su copia en pantalla.
      </p>

      <form onSubmit={handleSearch} style={styles.form}>
        <input
          type="text"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          placeholder="Número de factura"
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Consultando..." : "Buscar factura"}
        </button>
      </form>

      {error && <div style={styles.error}>{error}</div>}

      {invoiceData && (
        <div style={styles.result}>
          <h3 style={styles.resultTitle}>Detalle de la factura</h3>

          <p><strong>Número:</strong> {invoiceData.invoiceNumber || "-"}</p>
          <p><strong>Cliente:</strong> {invoiceData.customerName || "-"}</p>
          <p><strong>Fecha:</strong> {invoiceData.date || "-"}</p>
          <p><strong>Total:</strong> {invoiceData.total || "-"}</p>

          <div style={styles.itemsBox}>
            <strong>Productos:</strong>
            {Array.isArray(invoiceData.items) && invoiceData.items.length > 0 ? (
              <ul style={styles.list}>
                {invoiceData.items.map((item, index) => (
                  <li key={`${item.productCode || "item"}-${index}`}>
                    {item.productName || "Producto"} - Cantidad: {item.quantity} - Valor: {item.price}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={styles.noData}>No hay productos para mostrar.</p>
            )}
          </div>
        </div>
      )}
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
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  input: {
    flex: "1 1 260px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
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
  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "16px",
  },
  result: {
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "18px",
  },
  resultTitle: {
    marginTop: 0,
  },
  itemsBox: {
    marginTop: "16px",
  },
  list: {
    paddingLeft: "20px",
  },
  noData: {
    color: "#6b7280",
  },
};