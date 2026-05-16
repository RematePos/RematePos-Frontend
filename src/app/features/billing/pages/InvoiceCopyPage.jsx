import React, { useEffect, useMemo, useState } from "react";
import { getInvoiceCopy, getRecentInvoices } from "../services/billingService";

export default function InvoiceCopyPage() {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceData, setInvoiceData] = useState(null);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [recentPageSize, setRecentPageSize] = useState(10);
  const [recentCurrentPage, setRecentCurrentPage] = useState(1);
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
        const data = await getRecentInvoices(50);
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

  const totalRecentPages = Math.max(
    1,
    Math.ceil(recentInvoices.length / recentPageSize)
  );

  const paginatedRecentInvoices = useMemo(() => {
    const start = (recentCurrentPage - 1) * recentPageSize;
    const end = start + recentPageSize;
    return recentInvoices.slice(start, end);
  }, [recentCurrentPage, recentInvoices, recentPageSize]);

  const recentVisibleFrom =
    recentInvoices.length === 0 ? 0 : (recentCurrentPage - 1) * recentPageSize + 1;
  const recentVisibleTo = Math.min(
    recentCurrentPage * recentPageSize,
    recentInvoices.length
  );

  useEffect(() => {
    setRecentCurrentPage(1);
  }, [recentPageSize]);

  useEffect(() => {
    if (recentCurrentPage > totalRecentPages) {
      setRecentCurrentPage(totalRecentPages);
    }
  }, [recentCurrentPage, totalRecentPages]);

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
          <>
            <div style={styles.recentGrid}>
              {paginatedRecentInvoices.map((invoice) => (
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
            <div style={styles.recentPagination}>
              <span style={styles.recentHint}>
                Mostrando {recentVisibleFrom}-{recentVisibleTo} de {recentInvoices.length} registros
              </span>
              <span style={styles.recentHint}>
                Página {recentCurrentPage} de {totalRecentPages}
              </span>

              <div style={styles.recentPaginationActions}>
                <select
                  value={recentPageSize}
                  onChange={(event) => setRecentPageSize(Number(event.target.value))}
                  style={styles.pageSizeSelect}
                >
                  {[10, 20, 50].map((option) => (
                    <option key={option} value={option}>
                      {option} registros
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  style={styles.pageButton}
                  onClick={() => setRecentCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={recentCurrentPage === 1}
                >
                  Anterior
                </button>

                <button
                  type="button"
                  style={styles.pageButtonPrimary}
                  onClick={() =>
                    setRecentCurrentPage((prev) => Math.min(prev + 1, totalRecentPages))
                  }
                  disabled={recentCurrentPage === totalRecentPages}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
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
    background: `
      radial-gradient(circle at 8% 14%, rgba(99, 102, 241, 0.08), transparent 38%),
      linear-gradient(180deg, rgba(10, 15, 27, 0.96) 0%, rgba(10, 15, 27, 0.92) 100%)
    `,
    borderRadius: "18px",
    padding: "32px",
    boxShadow: "0 24px 48px rgba(2, 6, 23, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
  },
  title: {
    marginTop: 0,
    marginBottom: "8px",
    color: "#f8fafc",
    fontSize: "clamp(1.8rem, 2vw, 2rem)",
    fontWeight: "800",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: "0.95rem",
    lineHeight: "1.6",
    marginBottom: "24px",
    letterSpacing: "0.2px",
  },
  form: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "24px",
    padding: "20px",
    borderRadius: "14px",
    background: `
      radial-gradient(circle at 8% 14%, rgba(99, 102, 241, 0.06), transparent 38%),
      linear-gradient(180deg, rgba(10, 15, 27, 0.92) 0%, rgba(10, 15, 27, 0.88) 100%)
    `,
    border: "1px solid rgba(148, 163, 184, 0.18)",
    boxShadow: "0 12px 24px rgba(2, 6, 23, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
  },
  input: {
    flex: "1 1 260px",
    padding: "10px 14px",
    minHeight: "42px",
    borderRadius: "10px",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    background: "rgba(15, 23, 42, 0.8)",
    color: "#f8fafc",
    fontSize: "0.95rem",
    letterSpacing: "0.2px",
    transition: "all 180ms cubic-bezier(0.4, 0, 0.2, 1)",
    outline: "none",
  },
  button: {
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #6366f1 0%, #5b5fef 48%, #22d3ee 100%)",
    color: "#fff",
    padding: "10px 20px",
    minHeight: "42px",
    fontWeight: "700",
    fontSize: "0.95rem",
    letterSpacing: "0.2px",
    cursor: "pointer",
    boxShadow: "0 14px 32px rgba(79, 70, 229, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
    transition: "all 180ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
  error: {
    background: "rgba(239, 68, 68, 0.12)",
    color: "#fca5a5",
    padding: "12px 14px",
    borderRadius: "10px",
    marginBottom: "16px",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  result: {
    background: `
      radial-gradient(circle at 8% 14%, rgba(99, 102, 241, 0.06), transparent 38%),
      linear-gradient(180deg, rgba(10, 15, 27, 0.94) 0%, rgba(10, 15, 27, 0.9) 100%)
    `,
    border: "1px solid rgba(148, 163, 184, 0.18)",
    borderRadius: "14px",
    padding: "24px",
    boxShadow: "0 12px 24px rgba(2, 6, 23, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
    animation: "fadeInUp 300ms ease-out",
  },
  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
    paddingBottom: "16px",
    marginBottom: "20px",
  },
  kicker: {
    display: "block",
    color: "#818cf8",
    fontSize: "0.8rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "4px",
  },
  resultTitle: {
    margin: "0",
    color: "#f8fafc",
    fontSize: "1.4rem",
    fontWeight: "700",
  },
  total: {
    fontSize: "1.6rem",
    fontWeight: "800",
    color: "#22d3ee",
    letterSpacing: "-0.3px",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
    marginBottom: "20px",
  },
  label: {
    display: "block",
    color: "#94a3b8",
    fontSize: "0.8rem",
    fontWeight: "600",
    letterSpacing: "0.3px",
    marginBottom: "4px",
    textTransform: "uppercase",
  },
  totals: {
    display: "grid",
    gap: "10px",
    marginBottom: "20px",
    padding: "16px",
    background: "rgba(99, 102, 241, 0.06)",
    border: "1px solid rgba(99, 102, 241, 0.2)",
    borderRadius: "10px",
  },
  totalLine: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "center",
  },
  itemsBox: {
    display: "grid",
    gap: "10px",
    marginTop: "8px",
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
    border: "1px solid rgba(148, 163, 184, 0.12)",
    borderRadius: "10px",
    background: `
      radial-gradient(circle at 8% 14%, rgba(99, 102, 241, 0.06), transparent 38%),
      linear-gradient(180deg, rgba(10, 15, 27, 0.92) 0%, rgba(10, 15, 27, 0.88) 100%)
    `,
    transition: "all 180ms ease",
  },
  itemInfo: {
    display: "grid",
    gap: "4px",
  },
  productCode: {
    color: "#c7d2fe",
    fontSize: "0.8rem",
    fontWeight: 700,
    letterSpacing: "0.2px",
  },
  itemAmount: {
    textAlign: "right",
    color: "#22d3ee",
    fontWeight: "600",
  },
  noData: {
    color: "#94a3b8",
    textAlign: "center",
    padding: "20px",
    fontSize: "0.9rem",
  },
  recentSection: {
    marginTop: "28px",
  },
  recentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
    paddingBottom: "12px",
    borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
  },
  recentTitle: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "1.1rem",
    fontWeight: "700",
    letterSpacing: "-0.3px",
  },
  recentHint: {
    color: "#94a3b8",
    fontSize: "0.85rem",
    fontWeight: 500,
  },
  recentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "12px",
    marginBottom: "16px",
  },
  recentCard: {
    display: "grid",
    gap: "6px",
    textAlign: "left",
    padding: "14px",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    borderRadius: "10px",
    background: `
      radial-gradient(circle at 8% 14%, rgba(99, 102, 241, 0.08), transparent 38%),
      linear-gradient(180deg, rgba(10, 15, 27, 0.92) 0%, rgba(10, 15, 27, 0.88) 100%)
    `,
    color: "#f8fafc",
    cursor: "pointer",
    boxShadow: "0 8px 16px rgba(2, 6, 23, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.02)",
    transition: "all 180ms ease",
  },
  recentCardHover: {
    borderColor: "rgba(99, 102, 241, 0.4)",
    boxShadow: "0 12px 24px rgba(2, 6, 23, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
    transform: "translateY(-1px)",
  },
  recentNumber: {
    color: "#c7d2fe",
    fontWeight: 700,
    fontSize: "0.9rem",
    letterSpacing: "-0.2px",
  },
  recentCustomer: {
    fontWeight: 600,
    color: "#f8fafc",
    fontSize: "0.9rem",
  },
  recentMeta: {
    color: "#94a3b8",
    fontSize: "0.8rem",
    letterSpacing: "0.1px",
  },
  recentError: {
    background: "rgba(239, 68, 68, 0.12)",
    color: "#fca5a5",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    fontSize: "0.9rem",
  },
  itemsTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "12px",
    fontSize: "0.9rem",
  },
  tableHeaderProduct: {
    padding: "10px",
    textAlign: "left",
    borderBottom: "2px solid rgba(99, 102, 241, 0.6)",
    fontWeight: "bold",
    fontSize: "12px",
    color: "#c7d2fe",
    textTransform: "uppercase",
  },
  tableHeaderCode: {
    padding: "10px",
    textAlign: "center",
    borderBottom: "2px solid rgba(99, 102, 241, 0.6)",
    fontWeight: "bold",
    fontSize: "12px",
    color: "#c7d2fe",
    textTransform: "uppercase",
    width: "60px",
  },
  tableHeaderQty: {
    padding: "10px",
    textAlign: "center",
    borderBottom: "2px solid rgba(99, 102, 241, 0.6)",
    fontWeight: "bold",
    fontSize: "12px",
    color: "#c7d2fe",
    textTransform: "uppercase",
    width: "70px",
  },
  tableHeaderPrice: {
    padding: "10px",
    textAlign: "right",
    borderBottom: "2px solid rgba(99, 102, 241, 0.6)",
    fontWeight: "bold",
    fontSize: "12px",
    color: "#c7d2fe",
    textTransform: "uppercase",
    width: "110px",
  },
  tableHeaderSubtotal: {
    padding: "10px",
    textAlign: "right",
    borderBottom: "2px solid rgba(99, 102, 241, 0.6)",
    fontWeight: "bold",
    fontSize: "12px",
    color: "#c7d2fe",
    textTransform: "uppercase",
    width: "120px",
  },
  tableDataProduct: {
    padding: "10px",
    textAlign: "left",
    borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
  },
  tableDataCode: {
    padding: "10px",
    textAlign: "center",
    borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
  },
  tableDataQty: {
    padding: "10px",
    textAlign: "center",
    borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
  },
  tableDataPrice: {
    padding: "10px",
    textAlign: "right",
    borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
  },
  tableDataSubtotal: {
    padding: "10px",
    textAlign: "right",
    borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
    fontWeight: "bold",
  },
  recentPagination: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center",
    marginTop: "14px",
    paddingTop: "14px",
    borderTop: "1px solid rgba(148, 163, 184, 0.12)",
  },
  recentPaginationActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  pageSizeSelect: {
    minHeight: "42px",
    padding: "10px 12px",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    borderRadius: "12px",
    background: "rgba(15, 23, 42, 0.92)",
    color: "#f8fafc",
  },
  pageButton: {
    minHeight: "42px",
    padding: "10px 14px",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    borderRadius: "12px",
    background: "rgba(30, 41, 59, 0.88)",
    color: "#cbd5e1",
    fontWeight: "700",
    cursor: "pointer",
  },
  pageButtonPrimary: {
    minHeight: "42px",
    padding: "10px 14px",
    border: "1px solid rgba(99, 102, 241, 0.28)",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #7c3aed 0%, #6366f1 40%, #38bdf8 120%)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow:
      "0 10px 20px rgba(79, 70, 229, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.18)",
  },
};
