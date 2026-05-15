import React, { useMemo, useState } from "react";
import { getInvoiceCopy, processReturn } from "../services/billingService";

export default function ReturnsPage() {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceData, setInvoiceData] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [reason, setReason] = useState("");
  const [returnType, setReturnType] = useState("CASH_REFUND");
  const [blockedProductIds, setBlockedProductIds] = useState({});
  const [lastReturnResult, setLastReturnResult] = useState(null);
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

  const returnQuantity = Number(quantity);
  const estimatedRefund =
    selectedItem && Number.isFinite(returnQuantity) && returnQuantity > 0
      ? Number(selectedItem.unitPrice || 0) * returnQuantity
      : 0;
  const selectedProductBlocked = Boolean(
    selectedProductId && blockedProductIds[String(selectedProductId)]
  );

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
    setReturnType("CASH_REFUND");
    setBlockedProductIds({});
    setLastReturnResult(null);

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

    if (!Number.isInteger(returnQuantity) || returnQuantity < 1) {
      setError("La cantidad debe ser mayor a cero.");
      return;
    }

    if (selectedProductBlocked) {
      setError("Este producto ya no tiene unidades disponibles para devolver.");
      return;
    }

    if (returnQuantity > Number(selectedItem.quantity || 0)) {
      setError("No puedes devolver mas unidades que las compradas.");
      return;
    }

    if (returnType === "PRODUCT_EXCHANGE") {
      setError(
        "El cambio por producto requiere soporte backend para producto reemplazo, stock y auditoria. Queda pendiente para una HU posterior."
      );
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

      setLastReturnResult(result);
      if (
        Number(result.totalReturnedQuantity || 0) >=
        Number(result.purchasedQuantity || selectedItem.quantity || 0)
      ) {
        setBlockedProductIds((prev) => ({
          ...prev,
          [String(selectedItem.productId)]: true,
        }));
      }

      setMessage(
        `Devolucion registrada. Producto #${result.productId} (${result.productName}) retorno ${result.returnedQuantity} unidad(es) al inventario. Total devuelto: ${result.totalReturnedQuantity}/${result.purchasedQuantity}.`
      );
      setReason("");
      setQuantity("1");
    } catch (err) {
      const detail = err.message || "No fue posible registrar la devolucion.";
      if (detail.includes("available purchased quantity: 0")) {
        setBlockedProductIds((prev) => ({
          ...prev,
          [String(selectedItem.productId)]: true,
        }));
        setError("Este producto ya no tiene unidades disponibles para devolver.");
      } else {
        setError(detail);
      }
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
                    setMessage("");
                    setError("");
                    setLastReturnResult(null);
                  }}
                  style={{
                    ...styles.itemButton,
                    ...(active ? styles.itemButtonActive : {}),
                    ...(blockedProductIds[String(item.productId)]
                      ? styles.itemButtonBlocked
                      : {}),
                  }}
                >
                  <span>
                    <strong>{item.productName}</strong>
                    <small>Codigo #{item.productId}</small>
                  </span>
                  <span style={styles.itemMeta}>
                    <small>Cantidad {item.quantity}</small>
                    {blockedProductIds[String(item.productId)] && (
                      <small style={styles.warningText}>Sin saldo disponible</small>
                    )}
                    <strong>{formatPrice(item.lineTotal)}</strong>
                  </span>
                </button>
              );
            })}
          </div>

          <section style={styles.flowPanel}>
            <span style={styles.kicker}>Tipo de devolucion</span>
            <div style={styles.returnTypeGrid}>
              <button
                type="button"
                onClick={() => setReturnType("CASH_REFUND")}
                style={{
                  ...styles.returnTypeButton,
                  ...(returnType === "CASH_REFUND" ? styles.returnTypeActive : {}),
                }}
              >
                Devolucion en efectivo
              </button>
              <button
                type="button"
                onClick={() => setReturnType("PRODUCT_EXCHANGE")}
                style={{
                  ...styles.returnTypeButton,
                  ...(returnType === "PRODUCT_EXCHANGE"
                    ? styles.returnTypeActive
                    : {}),
                }}
              >
                Cambio por producto
              </button>
            </div>

            {returnType === "CASH_REFUND" ? (
              <p style={styles.flowHint}>
                La API actual registra la devolucion de inventario. La salida de
                caja por efectivo queda pendiente hasta implementar caja.
              </p>
            ) : (
              <div style={styles.pendingBox}>
                <strong>Cambio por producto pendiente</strong>
                <p>
                  Requiere soporte backend para producto reemplazo, ajuste de
                  stock y auditoria de la devolucion.
                </p>
                <select disabled style={styles.input}>
                  <option>Producto reemplazo pendiente de HU backend</option>
                </select>
              </div>
            )}
          </section>

          {selectedProductBlocked && (
            <div style={styles.warningBox}>
              Este producto ya no tiene unidades disponibles para devolver.
            </div>
          )}

          {selectedItem && (
            <div style={styles.refundBox}>
              <span>Valor estimado a devolver</span>
              <strong>{formatPrice(estimatedRefund)}</strong>
            </div>
          )}

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

          {lastReturnResult && (
            <div style={styles.returnResult}>
              <strong>Resultado de devolucion</strong>
              <span>Producto #{lastReturnResult.productId}</span>
              <span>
                Devuelto: {lastReturnResult.totalReturnedQuantity}/
                {lastReturnResult.purchasedQuantity}
              </span>
              <span>{lastReturnResult.message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={
              loadingReturn ||
              selectedProductBlocked ||
              returnType === "PRODUCT_EXCHANGE"
            }
            style={styles.button}
          >
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
    background: "#202426",
    borderRadius: "8px",
    padding: "24px",
    border: "1px solid #35506d",
    boxShadow: "0 16px 38px rgba(0,0,0,0.16)",
  },
  title: {
    marginTop: 0,
    color: "#f8fafc",
  },
  subtitle: {
    color: "#d6d3cc",
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
    border: "1px solid #405675",
    background: "#303334",
    color: "#f8fafc",
  },
  button: {
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
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
    border: "1px solid #405675",
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
    border: "1px solid #405675",
    background: "#25292b",
    color: "#f8fafc",
    cursor: "pointer",
  },
  itemButtonActive: {
    borderColor: "#22c55e",
    background: "#123c2b",
  },
  itemButtonBlocked: {
    opacity: 0.72,
    borderColor: "#7f1d1d",
  },
  itemMeta: {
    display: "grid",
    justifyItems: "end",
    gap: "4px",
  },
  warningText: {
    color: "#fca5a5",
    fontWeight: 800,
  },
  flowPanel: {
    display: "grid",
    gap: "10px",
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid #405675",
    background: "#25292b",
  },
  returnTypeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "10px",
  },
  returnTypeButton: {
    border: "1px solid #405675",
    borderRadius: "8px",
    background: "#303334",
    color: "#f8fafc",
    padding: "12px",
    fontWeight: 800,
    cursor: "pointer",
  },
  returnTypeActive: {
    borderColor: "#22c55e",
    background: "#123c2b",
  },
  flowHint: {
    margin: 0,
    color: "#d6d3cc",
    lineHeight: 1.45,
  },
  pendingBox: {
    display: "grid",
    gap: "8px",
    color: "#f8fafc",
  },
  warningBox: {
    color: "#fecaca",
    background: "#7f1d1d",
    border: "1px solid #fca5a5",
    borderRadius: "8px",
    padding: "12px",
    fontWeight: 800,
  },
  refundBox: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "12px",
    borderRadius: "8px",
    color: "#ecfdf5",
    background: "#0f6b3a",
    fontWeight: 800,
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
    border: "1px solid #405675",
    background: "#303334",
    color: "#f8fafc",
    resize: "vertical",
  },
  returnResult: {
    display: "grid",
    gap: "4px",
    padding: "12px",
    borderRadius: "8px",
    color: "#ecfdf5",
    background: "#064e3b",
    border: "1px solid #22c55e",
  },
  success: {
    marginTop: "14px",
    background: "#0f6b3a",
    color: "#f8fafc",
    padding: "12px",
    borderRadius: "8px",
  },
  error: {
    marginTop: "14px",
    background: "#7f1d1d",
    color: "#fee2e2",
    padding: "12px",
    borderRadius: "8px",
  },
};
