import React, { useEffect, useState } from "react";
import { getInvoiceCopy, getRecentInvoices } from "../services/billingService";

export default function InvoiceCopyPage() {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceData, setInvoiceData] = useState(null);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [error, setError] = useState("");
  const [recentError, setRecentError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRecent, setLoadingRecent] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadRecentInvoices() {
      setLoadingRecent(true);
      setRecentError("");
      try {
        const data = await getRecentInvoices(8);
        if (isMounted) {
          setRecentInvoices(data);
        }
      } catch (err) {
        if (isMounted) {
          setRecentInvoices([]);
          setRecentError(
            err.message || "No fue posible cargar las facturas recientes."
          );
        }
      } finally {
        if (isMounted) {
          setLoadingRecent(false);
        }
      }
    }

    loadRecentInvoices();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatPrice = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  const formatDate = (value) => {
    if (!value) return "-";
    return new Intl.DateTimeFormat("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setError("");
    setInvoiceData(null);

    if (!invoiceNumber.trim()) {
      setError("Debes ingresar un numero de factura.");
      return;
    }

    setLoading(true);

    try {
      const data = await getInvoiceCopy(invoiceNumber.trim());
      setInvoiceData(data);
    } catch (err) {
      setError("No se encontro una factura con ese numero.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Copia de facturas</h2>
      <p style={styles.subtitle}>
        Consulta una factura registrada por su numero y revisa sus productos.
      </p>

      <form onSubmit={handleSearch} style={styles.form}>
        <input
          type="text"
          value={invoiceNumber}
          onChange={(event) => setInvoiceNumber(event.target.value)}
          placeholder="Ej: INV-20260505-6"
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Consultando..." : "Buscar factura"}
        </button>
      </form>

      {error && <div style={styles.error}>{error}</div>}

      {invoiceData && (
        <div style={styles.result}>
          <div style={styles.resultHeader}>
            <div>
              <span style={styles.kicker}>Factura</span>
              <h3 style={styles.resultTitle}>{invoiceData.invoiceNumber}</h3>
            </div>
            <strong style={styles.total}>{formatPrice(invoiceData.total)}</strong>
          </div>

          <div style={styles.summaryGrid}>
            <div>
              <span style={styles.label}>Compra</span>
              <strong>#{invoiceData.purchaseId}</strong>
            </div>
            <div>
              <span style={styles.label}>Cliente</span>
              <strong>{invoiceData.customerFullName || "-"}</strong>
            </div>
            <div>
              <span style={styles.label}>Documento</span>
              <strong>
                {invoiceData.customerDocumentType} {invoiceData.customerDocumentNumber}
              </strong>
            </div>
            <div>
              <span style={styles.label}>Fecha</span>
              <strong>{formatDate(invoiceData.issuedAt)}</strong>
            </div>
          </div>

          <div style={styles.totals}>
            <div style={styles.totalLine}>
              <span>Subtotal</span>
              <strong>{formatPrice(invoiceData.subtotal)}</strong>
            </div>
            <div style={styles.totalLine}>
              <span>IVA</span>
              <strong>{formatPrice(invoiceData.tax)}</strong>
            </div>
            <div style={styles.totalLine}>
              <span>Total</span>
              <strong>{formatPrice(invoiceData.total)}</strong>
            </div>
          </div>

          <div style={styles.itemsBox}>
            <strong>Productos comprados</strong>
            {Array.isArray(invoiceData.items) && invoiceData.items.length > 0 ? (
              <table style={styles.itemsTable}>
                <thead>
                  <tr>
                    <th style={styles.tableHeaderProduct}>PRODUCTO</th>
                    <th style={styles.tableHeaderCode}>ID</th>
                    <th style={styles.tableHeaderQty}>CANT</th>
                    <th style={styles.tableHeaderPrice}>PRECIO</th>
                    <th style={styles.tableHeaderSubtotal}>SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item) => (
                    <tr key={`${item.productId}-${item.productName}`}>
                      <td style={styles.tableDataProduct}>{item.productName || "Producto"}</td>
                      <td style={styles.tableDataCode}>{item.productId}</td>
                      <td style={styles.tableDataQty}>{item.quantity}</td>
                      <td style={styles.tableDataPrice}>{formatPrice(item.unitPrice)}</td>
                      <td style={styles.tableDataSubtotal}>{formatPrice(item.lineTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={styles.noData}>No hay productos para mostrar.</p>
            )}
          </div>
        </div>
      )}

      <div style={styles.recentSection}>
        <div style={styles.recentHeader}>
          <h3 style={styles.recentTitle}>Ultimas facturas</h3>
          {loadingRecent && <span style={styles.recentHint}>Cargando...</span>}
        </div>

        {recentInvoices.length > 0 ? (
          <div style={styles.recentGrid}>
            {recentInvoices.map((invoice) => (
              <button
                key={invoice.invoiceId || invoice.invoiceNumber}
                type="button"
                style={styles.recentCard}
                onClick={() => {
                  setInvoiceNumber(invoice.invoiceNumber);
                  setInvoiceData(invoice);
                  setError("");
                }}
              >
                <span style={styles.recentNumber}>{invoice.invoiceNumber}</span>
                <span style={styles.recentCustomer}>
                  {invoice.customerFullName || "Cliente no identificado"}
                </span>
                <span style={styles.recentMeta}>
                  Compra #{invoice.purchaseId} - {formatPrice(invoice.total)}
                </span>
                <span style={styles.recentMeta}>
                  Productos: {Array.isArray(invoice.items) ? invoice.items.length : 0}
                </span>
              </button>
            ))}
          </div>
        ) : (
          !loadingRecent && (
            <p style={recentError ? styles.recentError : styles.noData}>
              {recentError || "Todavia no hay facturas recientes para mostrar."}
            </p>
          )
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    borderRadius: "8px",
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
    borderRadius: "8px",
    border: "1px solid #d1d5db",
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
  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "16px",
  },
  result: {
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "18px",
  },
  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "14px",
    marginBottom: "14px",
  },
  kicker: {
    display: "block",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 800,
    textTransform: "uppercase",
  },
  resultTitle: {
    margin: "4px 0 0",
  },
  total: {
    fontSize: "22px",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "10px",
    marginBottom: "16px",
  },
  label: {
    display: "block",
    color: "#64748b",
    fontSize: "12px",
    marginBottom: "4px",
  },
  totals: {
    display: "grid",
    gap: "8px",
    marginBottom: "18px",
  },
  totalLine: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    maxWidth: "260px",
  },
  itemsBox: {
    display: "grid",
    gap: "10px",
  },
  itemsList: {
    display: "grid",
    gap: "8px",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    background: "#ffffff",
  },
  itemInfo: {
    display: "grid",
    gap: "4px",
  },
  productCode: {
    color: "#2563eb",
    fontSize: "12px",
    fontWeight: 800,
  },
  itemAmount: {
    textAlign: "right",
  },
  noData: {
    color: "#6b7280",
  },
  recentSection: {
    marginTop: "22px",
  },
  recentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  },
  recentTitle: {
    margin: 0,
    color: "#0f172a",
  },
  recentHint: {
    color: "#64748b",
    fontSize: "13px",
    fontWeight: 700,
  },
  recentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "10px",
  },
  recentCard: {
    display: "grid",
    gap: "6px",
    textAlign: "left",
    padding: "14px",
    border: "1px solid #dbeafe",
    borderRadius: "8px",
    background: "#f8fafc",
    color: "#0f172a",
    cursor: "pointer",
  },
  recentNumber: {
    color: "#1d4ed8",
    fontWeight: 900,
  },
  recentCustomer: {
    fontWeight: 800,
  },
  recentMeta: {
    color: "#64748b",
    fontSize: "13px",
  },
  recentError: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "12px",
    borderRadius: "8px",
  },
  itemsTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "8px",
    fontSize: "14px",
  },
  tableHeaderProduct: {
    padding: "10px",
    textAlign: "left",
    borderBottom: "2px solid #2563eb",
    fontWeight: "bold",
    fontSize: "12px",
    color: "#1d4ed8",
    textTransform: "uppercase",
  },
  tableHeaderCode: {
    padding: "10px",
    textAlign: "center",
    borderBottom: "2px solid #2563eb",
    fontWeight: "bold",
    fontSize: "12px",
    color: "#1d4ed8",
    textTransform: "uppercase",
    width: "60px",
  },
  tableHeaderQty: {
    padding: "10px",
    textAlign: "center",
    borderBottom: "2px solid #2563eb",
    fontWeight: "bold",
    fontSize: "12px",
    color: "#1d4ed8",
    textTransform: "uppercase",
    width: "70px",
  },
  tableHeaderPrice: {
    padding: "10px",
    textAlign: "right",
    borderBottom: "2px solid #2563eb",
    fontWeight: "bold",
    fontSize: "12px",
    color: "#1d4ed8",
    textTransform: "uppercase",
    width: "110px",
  },
  tableHeaderSubtotal: {
    padding: "10px",
    textAlign: "right",
    borderBottom: "2px solid #2563eb",
    fontWeight: "bold",
    fontSize: "12px",
    color: "#1d4ed8",
    textTransform: "uppercase",
    width: "120px",
  },
  tableDataProduct: {
    padding: "10px",
    textAlign: "left",
    borderBottom: "1px solid #e5e7eb",
  },
  tableDataCode: {
    padding: "10px",
    textAlign: "center",
    borderBottom: "1px solid #e5e7eb",
  },
  tableDataQty: {
    padding: "10px",
    textAlign: "center",
    borderBottom: "1px solid #e5e7eb",
  },
  tableDataPrice: {
    padding: "10px",
    textAlign: "right",
    borderBottom: "1px solid #e5e7eb",
  },
  tableDataSubtotal: {
    padding: "10px",
    textAlign: "right",
    borderBottom: "1px solid #e5e7eb",
    fontWeight: "bold",
  },
};
