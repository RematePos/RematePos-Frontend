import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { findCustomerByDocument } from "../services/billingService";

const CONSUMER_FINAL_DOCUMENT = "222222222222";

export default function CustomerIdentificationPage() {
  const navigate = useNavigate();

  const [documentNumber, setDocumentNumber] = useState("");
  const [customer, setCustomer] = useState(null);
  const [customerMode, setCustomerMode] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const resetMessages = () => {
    setMessage("");
    setError("");
  };

  const saveBillingCustomer = (customerData, mode) => {
    const context = {
      customer: customerData,
      customerMode: mode,
      selectedAt: new Date().toISOString(),
    };

    sessionStorage.setItem("billingCustomer", JSON.stringify(customerData));
    sessionStorage.setItem("billingCustomerContext", JSON.stringify(context));
  };

  const normalizeCustomer = (data, fallbackDocument) => {
    return {
      documentNumber:
        data.documentNumber ||
        data.document ||
        data.nit ||
        fallbackDocument,
      fullName:
        data.fullName ||
        data.name ||
        data.customerName ||
        data.businessName ||
        "Cliente registrado",
      email: data.email || "",
      phone: data.phone || "",
    };
  };

  const handleSearchCustomer = async (e) => {
    e.preventDefault();
    resetMessages();
    setCustomer(null);
    setCustomerMode(null);

    if (!documentNumber.trim()) {
      setError("Debes ingresar el NIT o la cédula del cliente.");
      return;
    }

    setLoading(true);

    try {
      const data = await findCustomerByDocument(documentNumber.trim());

      if (!data) {
        setError(
          "El cliente no está registrado. Puedes continuar como consumidor final."
        );
        return;
      }

      const customerData = normalizeCustomer(data, documentNumber.trim());

      setCustomer(customerData);
      setCustomerMode("registered");
      saveBillingCustomer(customerData, "registered");
      setMessage("Cliente encontrado correctamente.");
    } catch (err) {
      setError(err.message || "No fue posible consultar el cliente.");
    } finally {
      setLoading(false);
    }
  };

  const handleConsumerFinal = () => {
    resetMessages();

    const finalCustomer = {
      documentNumber: CONSUMER_FINAL_DOCUMENT,
      fullName: "Consumidor final",
      email: "",
      phone: "",
    };

    setCustomer(finalCustomer);
    setCustomerMode("consumerFinal");
    saveBillingCustomer(finalCustomer, "consumerFinal");
    setMessage("Se seleccionó consumidor final.");
  };

  const handleContinue = () => {
    resetMessages();

    if (!customer) {
      setError("Primero debes seleccionar un cliente o consumidor final.");
      return;
    }

    navigate("/billing/facturar");
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <span style={styles.step}>Paso 1</span>
            <h2 style={styles.title}>Identificación del cliente</h2>
            <p style={styles.subtitle}>
              Consulta el cliente por NIT o cédula. Si no existe, puedes
              continuar como consumidor final.
            </p>
          </div>
        </div>

        <form onSubmit={handleSearchCustomer} style={styles.form}>
          <div style={styles.inputBlock}>
            <label style={styles.label}>NIT o cédula</label>
            <input
              type="text"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              placeholder="Digite el NIT o la cédula"
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.primaryButton}>
            {loading ? "Consultando..." : "Buscar cliente"}
          </button>

          <button
            type="button"
            onClick={handleConsumerFinal}
            style={styles.secondaryButton}
          >
            Consumidor final
          </button>
        </form>

        {message && <div style={styles.success}>{message}</div>}
        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.customerBox}>
          <div style={styles.customerHeader}>
            <h3 style={styles.customerTitle}>Cliente seleccionado</h3>
            <span style={styles.badge}>
              {customerMode === "registered"
                ? "Registrado"
                : customerMode === "consumerFinal"
                ? "Consumidor final"
                : "Sin seleccionar"}
            </span>
          </div>

          <div style={styles.grid}>
            <div style={styles.item}>
              <span style={styles.itemLabel}>Documento</span>
              <span style={styles.itemValue}>
                {customer?.documentNumber || "-"}
              </span>
            </div>

            <div style={styles.item}>
              <span style={styles.itemLabel}>Nombre</span>
              <span style={styles.itemValue}>{customer?.fullName || "-"}</span>
            </div>

            <div style={styles.item}>
              <span style={styles.itemLabel}>Correo</span>
              <span style={styles.itemValue}>{customer?.email || "-"}</span>
            </div>

            <div style={styles.item}>
              <span style={styles.itemLabel}>Teléfono</span>
              <span style={styles.itemValue}>{customer?.phone || "-"}</span>
            </div>
          </div>

          {customerMode === "consumerFinal" && (
            <div style={styles.note}>
              Se usará el documento por defecto:
              <strong> {CONSUMER_FINAL_DOCUMENT}</strong>
            </div>
          )}
        </div>

        <div style={styles.footer}>
          <button
            type="button"
            onClick={handleContinue}
            style={styles.continueButton}
          >
            Continuar a facturar
          </button>
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
  card: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "28px",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e2e8f0",
  },
  header: {
    marginBottom: "22px",
  },
  step: {
    display: "inline-block",
    background: "#dbeafe",
    color: "#1d4ed8",
    fontWeight: "800",
    borderRadius: "999px",
    padding: "6px 12px",
    fontSize: "12px",
    marginBottom: "10px",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    color: "#0f172a",
  },
  subtitle: {
    marginTop: "8px",
    color: "#475569",
    lineHeight: 1.6,
  },
  form: {
    display: "grid",
    gridTemplateColumns: "1.8fr auto auto",
    gap: "14px",
    alignItems: "end",
    marginBottom: "18px",
  },
  inputBlock: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: "700",
    marginBottom: "8px",
    color: "#0f172a",
  },
  input: {
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "14px",
    background: "#f8fafc",
  },
  primaryButton: {
    height: "48px",
    border: "none",
    borderRadius: "14px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: "800",
    padding: "0 20px",
    cursor: "pointer",
  },
  secondaryButton: {
    height: "48px",
    border: "none",
    borderRadius: "14px",
    background: "#0f172a",
    color: "#ffffff",
    fontWeight: "800",
    padding: "0 20px",
    cursor: "pointer",
  },
  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "14px",
    borderRadius: "14px",
    marginBottom: "12px",
  },
  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "14px",
    borderRadius: "14px",
    marginBottom: "12px",
  },
  customerBox: {
    marginTop: "14px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "20px",
  },
  customerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
    flexWrap: "wrap",
    gap: "10px",
  },
  customerTitle: {
    margin: 0,
    fontSize: "18px",
    color: "#0f172a",
  },
  badge: {
    background: "#e2e8f0",
    color: "#334155",
    borderRadius: "999px",
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: "700",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },
  item: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "14px",
    border: "1px solid #e2e8f0",
  },
  itemLabel: {
    display: "block",
    fontSize: "12px",
    textTransform: "uppercase",
    color: "#64748b",
    marginBottom: "6px",
    fontWeight: "700",
  },
  itemValue: {
    fontSize: "15px",
    color: "#0f172a",
    fontWeight: "700",
  },
  note: {
    marginTop: "16px",
    padding: "12px",
    borderRadius: "10px",
    background: "#fff7ed",
    color: "#9a3412",
    fontSize: "14px",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "22px",
  },
  continueButton: {
    border: "none",
    borderRadius: "14px",
    background: "#16a34a",
    color: "#ffffff",
    padding: "14px 22px",
    fontWeight: "800",
    cursor: "pointer",
  },
};