import React, { useMemo, useState } from "react";

const CONSUMIDOR_FINAL = "222222222222";

export default function BillingCheckoutPage() {
  const [documentNumber, setDocumentNumber] = useState("");
  const [customerData, setCustomerData] = useState(null);
  const [message, setMessage] = useState("");

  const cashierName = useMemo(() => {
    try {
      const storedUser =
        sessionStorage.getItem("user") || localStorage.getItem("user");

      if (!storedUser) return "Cajero no identificado";

      const parsed = JSON.parse(storedUser);

      return (
        parsed.fullName ||
        parsed.name ||
        parsed.username ||
        parsed.userName ||
        "Cajero no identificado"
      );
    } catch (error) {
      return "Cajero no identificado";
    }
  }, []);

  const productCount = useMemo(() => {
    try {
      const storedCart =
        sessionStorage.getItem("cartItems") || localStorage.getItem("cartItems");

      if (!storedCart) return 0;

      const parsed = JSON.parse(storedCart);

      if (!Array.isArray(parsed)) return 0;

      return parsed.reduce((acc, item) => {
        const quantity = Number(item.quantity || item.qty || 1);
        return acc + (Number.isNaN(quantity) ? 0 : quantity);
      }, 0);
    } catch (error) {
      return 0;
    }
  }, []);

  const handleContinue = () => {
    const finalDocument = documentNumber.trim() || CONSUMIDOR_FINAL;

    const finalCustomer = {
      documentNumber: finalDocument,
      type:
        finalDocument === CONSUMIDOR_FINAL
          ? "Consumidor final"
          : "Cliente por identificar",
    };

    setCustomerData(finalCustomer);

    sessionStorage.setItem("billingCustomer", JSON.stringify(finalCustomer));

    if (finalDocument === CONSUMIDOR_FINAL) {
      setMessage(
        "No se digitó documento. Se asignó automáticamente consumidor final."
      );
    } else {
      setMessage("Documento asignado correctamente para la facturación.");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.topGrid}>
        <div style={styles.infoCard}>
          <span style={styles.infoLabel}>Cajero</span>
          <strong style={styles.infoValue}>{cashierName}</strong>
        </div>

        <div style={styles.infoCard}>
          <span style={styles.infoLabel}>Productos en la venta</span>
          <strong style={styles.infoValue}>{productCount}</strong>
        </div>
      </div>

      <div style={styles.mainCard}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Identificación del cliente</h2>
            <p style={styles.subtitle}>
              Digita el NIT o la cédula del cliente. Si no escribes nada, el
              sistema continuará con consumidor final.
            </p>
          </div>

          <div style={styles.badge}>POS Facturación</div>
        </div>

        <div style={styles.formBox}>
          <label style={styles.label}>NIT o cédula</label>

          <div style={styles.inputRow}>
            <input
              type="text"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              placeholder="Ej: 1076905019"
              style={styles.input}
            />

            <button type="button" onClick={handleContinue} style={styles.button}>
              Continuar
            </button>
          </div>

          <div style={styles.helpBox}>
            Si dejas el campo vacío, se usará automáticamente:
            <strong> {CONSUMIDOR_FINAL}</strong>
          </div>

          {message && <div style={styles.success}>{message}</div>}
        </div>

        <div style={styles.summaryCard}>
          <h3 style={styles.summaryTitle}>Resumen para facturar</h3>

          <div style={styles.summaryGrid}>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Tipo</span>
              <span style={styles.summaryValue}>
                {customerData?.type || "-"}
              </span>
            </div>

            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Documento</span>
              <span style={styles.summaryValue}>
                {customerData?.documentNumber || "-"}
              </span>
            </div>

            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Cajero</span>
              <span style={styles.summaryValue}>{cashierName}</span>
            </div>

            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Productos</span>
              <span style={styles.summaryValue}>{productCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  topGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
  },
  infoCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "18px 20px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 22px rgba(15, 23, 42, 0.06)",
  },
  infoLabel: {
    display: "block",
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "8px",
    fontWeight: "600",
  },
  infoValue: {
    fontSize: "22px",
    color: "#0f172a",
    fontWeight: "800",
  },
  mainCard: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "24px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 16px 38px rgba(15, 23, 42, 0.08)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginBottom: "22px",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    color: "#0f172a",
  },
  subtitle: {
    marginTop: "8px",
    color: "#64748b",
    lineHeight: 1.5,
    maxWidth: "760px",
  },
  badge: {
    background: "#eff6ff",
    color: "#1d4ed8",
    padding: "8px 14px",
    borderRadius: "999px",
    border: "1px solid #bfdbfe",
    fontSize: "13px",
    fontWeight: "700",
  },
  formBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "20px",
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "10px",
    fontWeight: "700",
    color: "#0f172a",
  },
  inputRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "12px",
  },
  input: {
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    background: "#ffffff",
  },
  button: {
    border: "none",
    borderRadius: "14px",
    background: "#2563eb",
    color: "#ffffff",
    padding: "0 20px",
    minWidth: "140px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(37, 99, 235, 0.22)",
  },
  helpBox: {
    marginTop: "14px",
    padding: "12px 14px",
    borderRadius: "12px",
    background: "#fff7ed",
    color: "#9a3412",
    border: "1px solid #fed7aa",
    fontSize: "14px",
  },
  success: {
    marginTop: "14px",
    background: "#ecfdf5",
    color: "#166534",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #bbf7d0",
  },
  summaryCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "20px",
  },
  summaryTitle: {
    marginTop: 0,
    marginBottom: "16px",
    fontSize: "18px",
    color: "#0f172a",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },
  summaryItem: {
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "14px",
  },
  summaryLabel: {
    display: "block",
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "6px",
    textTransform: "uppercase",
    fontWeight: "700",
  },
  summaryValue: {
    color: "#0f172a",
    fontSize: "15px",
    fontWeight: "700",
    wordBreak: "break-word",
  },
};