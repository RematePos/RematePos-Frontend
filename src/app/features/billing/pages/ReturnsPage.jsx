import React, { useMemo, useState } from "react";
import { getInvoiceCopy, processReturn } from "../services/billingService";

export default function ReturnsPage() {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceData, setInvoiceData] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [loadingReturn, setLoadingReturn] = useState(false);

  const selectedItem = useMemo(() => {
    if (!invoiceData?.items || !selectedProductId) return null;
    return invoiceData.items.find(
      (item) => String(item.productId) === String(selectedProductId)
    );
  }, [invoiceData, selectedProductId]);

  const formatPrice = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  const handleSearchInvoice = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setInvoiceData(null);
    setSelectedProductId("");

    const cleanInvoiceNumber = invoiceNumber.trim();
    if (!cleanInvoiceNumber) {
      setError("Ingresa el numero de factura.");
      return;
    }

    setLoadingInvoice(true);

    try {
      const data = await getInvoiceCopy(cleanInvoiceNumber);
      setInvoiceData(data);
      const firstItem = Array.isArray(data.items) ? data.items[0] : null;
      setSelectedProductId(firstItem ? String(firstItem.productId) : "");
      setQuantity("1");
    } catch (err) {
      setError("No se encontro una factura con ese numero.");
    } finally {
      setLoadingInvoice(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!invoiceData) {
      setError("Primero busca la factura.");
      return;
    }

    if (!selectedItem) {
      setError("Selecciona el producto que se va a devolver.");
      return;
    }

    const returnQuantity = Number(quantity);
    if (!Number.isInteger(returnQuantity) || returnQuantity < 1) {
      setError("La cantidad debe ser mayor a cero.");
      return;
    }

    if (returnQuantity > Number(selectedItem.quantity || 0)) {
      setError("No puedes devolver mas unidades que las compradas.");
      return;
    }

    if (!reason.trim()) {
      setError("Ingresa el motivo de la devolucion.");
      return;
    }

    setLoadingReturn(true);

    try {
      const result = await processReturn({
        invoiceNumber: invoiceData.invoiceNumber,
        productId: selectedItem.productId,
        quantity: returnQuantity,
        reason: reason.trim(),
      });

      setMessage(
        `Devolucion registrada. Producto #${result.productId} (${result.productName}) retorno ${result.returnedQuantity} unidad(es) al inventario.`
      );
      setReason("");
      setQuantity("1");
    } catch (err) {
      setError(err.message || "No fue posible registrar la devolucion.");
    } finally {
      setLoadingReturn(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Devoluciones</h2>
      <p style={styles.subtitle}>
        Busca la factura y selecciona el producto comprado que vuelve al inventario.
      </p>

      <form onSubmit={handleSearchInvoice} style={styles.searchRow}>
        <input
          type="text"
          value={invoiceNumber}
          onChange={(event) => setInvoiceNumber(event.target.value)}
          placeholder="Ej: INV-20260506-11"
          style={styles.input}
        />
        <button type="submit" disabled={loadingInvoice} style={styles.button}>
          {loadingInvoice ? "Buscando..." : "Buscar factura"}
        </button>
      </form>

      {invoiceData && (
        <form onSubmit={handleSubmit} style={styles.returnBox}>
          <div style={styles.invoiceHeader}>
            <div>
              <span style={styles.kicker}>Factura</span>
              <strong>{invoiceData.invoiceNumber}</strong>
            </div>
            <div>
              <span style={styles.kicker}>Cliente</span>
              <strong>{invoiceData.customerFullName || "-"}</strong>
            </div>
            <div>
              <span style={styles.kicker}>Total</span>
              <strong>{formatPrice(invoiceData.total)}</strong>
            </div>
          </div>

          <div style={styles.itemsList}>
            {invoiceData.items.map((item) => {
              const active = String(item.productId) === String(selectedProductId);
              return (
                <button
                  key={`${item.productId}-${item.productName}`}
                  type="button"
                  onClick={() => {
                    setSelectedProductId(String(item.productId));
                    setQuantity("1");
                  }}
                  style={{
                    ...styles.itemButton,
                    ...(active ? styles.itemButtonActive : {}),
                  }}
                >
                  <span>
                    <strong>{item.productName}</strong>
                    <small>Codigo #{item.productId}</small>
                  </span>
                  <span style={styles.itemMeta}>
                    <small>Cantidad {item.quantity}</small>
                    <strong>{formatPrice(item.lineTotal)}</strong>
                  </span>
                </button>
              );
            })}
          </div>

          <div style={styles.formGrid}>
            <label style={styles.field}>
              <span>Cantidad a devolver</span>
              <input
                type="number"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                min="1"
                max={selectedItem?.quantity || 1}
                style={styles.input}
              />
            </label>

            <label style={styles.fieldWide}>
              <span>Motivo</span>
              <textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Ej: Producto defectuoso, cambio solicitado, error en compra"
                rows="4"
                style={styles.textarea}
              />
            </label>
          </div>

          <button type="submit" disabled={loadingReturn} style={styles.button}>
            {loadingReturn ? "Registrando..." : "Registrar devolucion"}
          </button>
        </form>
      )}

      {message && <div style={styles.success}>{message}</div>}
      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
}

const styles = {
  card: {
    background: "rgba(15, 23, 42, 0.92)",
    borderRadius: "18px",
    padding: "24px",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    boxShadow: "0 16px 38px rgba(2, 6, 23, 0.22)",
  },
  title: {
    marginTop: 0,
    color: "#f8fafc",
  },
  subtitle: {
    color: "#cbd5e1",
    marginBottom: "20px",
  },
  searchRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "12px",
    marginBottom: "18px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    background: "rgba(15, 23, 42, 0.92)",
    color: "#f8fafc",
  },
  button: {
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #6366f1, #818cf8)",
    color: "#fff",
    padding: "12px 18px",
    fontWeight: "700",
    cursor: "pointer",
  },
  returnBox: {
    display: "grid",
    gap: "16px",
  },
  invoiceHeader: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid rgba(148, 163, 184, 0.18)",
  },
  kicker: {
    display: "block",
    color: "#d6d3cc",
    fontSize: "12px",
    fontWeight: 800,
    textTransform: "uppercase",
    marginBottom: "4px",
  },
  itemsList: {
    display: "grid",
    gap: "10px",
  },
  itemButton: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    textAlign: "left",
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    background: "rgba(15, 23, 42, 0.82)",
    color: "#f8fafc",
    cursor: "pointer",
  },
  itemButtonActive: {
    borderColor: "rgba(34, 197, 94, 0.45)",
    background: "rgba(21, 128, 61, 0.18)",
  },
  itemMeta: {
    display: "grid",
    justifyItems: "end",
    gap: "4px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(160px, 240px) 1fr",
    gap: "12px",
  },
  field: {
    display: "grid",
    gap: "8px",
    color: "#f8fafc",
    fontWeight: 700,
  },
  fieldWide: {
    display: "grid",
    gap: "8px",
    color: "#f8fafc",
    fontWeight: 700,
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    background: "rgba(15, 23, 42, 0.92)",
    color: "#f8fafc",
    resize: "vertical",
  },
  success: {
    marginTop: "14px",
    background: "rgba(21, 128, 61, 0.18)",
    color: "#f8fafc",
    padding: "12px",
    borderRadius: "8px",
  },
  error: {
    marginTop: "14px",
    background: "rgba(127, 29, 29, 0.42)",
    color: "#fecaca",
    padding: "12px",
    borderRadius: "8px",
  },
};
