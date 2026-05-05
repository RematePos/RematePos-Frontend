import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  getPosProducts,
  registerPosSale,
} from "../../sales/services/SalesService";

const CONSUMER_FINAL_DOCUMENT = "222222222222";

export default function BillingCheckoutPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    try {
      const saved = sessionStorage.getItem("posCart");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  });
  const [search, setSearch] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [processingSale, setProcessingSale] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const billingCustomer = useMemo(() => {
    try {
      const stored = sessionStorage.getItem("billingCustomer");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  }, []);

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

  useEffect(() => {
    sessionStorage.setItem("posCart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      setError("");

      try {
        const data = await getPosProducts();
        const items = Array.isArray(data) ? data : data.items || [];

        setProducts(
          items.map((item, index) => ({
            id: item.id || item.productId || index + 1,
            code: item.code || item.sku || item.productCode || `P-${index + 1}`,
            name: item.name || item.productName || "Producto",
            price: Number(item.price || item.salePrice || 0),
            stock: Number(item.stock || item.quantityAvailable || 0),
          }))
        );
      } catch (err) {
        setError(err.message || "No fue posible cargar los productos.");
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return products;

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(term) ||
        product.code.toLowerCase().includes(term)
      );
    });
  }, [products, search]);

  const totalItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const totalAmount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity * item.price, 0);
  }, [cart]);

  if (!billingCustomer) {
    return <Navigate to="/billing" replace />;
  }

  const addToCart = (product) => {
    setError("");
    setMessage("");

    if (product.stock <= 0) {
      setError("El producto no tiene stock disponible.");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        if (existing.quantity >= product.stock) {
          setError("No puedes agregar más unidades que el stock disponible.");
          return prev;
        }

        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (productId) => {
    setError("");
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== productId) return item;
        if (item.quantity >= item.stock) return item;
        return { ...item, quantity: item.quantity + 1 };
      })
    );
  };

  const decreaseQuantity = (productId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleConfirmSale = async () => {
    setError("");
    setMessage("");

    if (!billingCustomer) {
      setError("Debes identificar un cliente antes de vender.");
      return;
    }

    if (cart.length === 0) {
      setError("El carrito está vacío.");
      return;
    }

    const confirmed = window.confirm(
      "¿Deseas confirmar la venta y registrar la transacción?"
    );

    if (!confirmed) return;

    setProcessingSale(true);

    try {
      const payload = {
        customerDocument:
          billingCustomer.documentNumber || CONSUMER_FINAL_DOCUMENT,
        customerName: billingCustomer.fullName || "Consumidor final",
        cashierName,
        items: cart.map((item) => ({
          productId: item.id,
          productCode: item.code,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        totalItems,
        totalAmount,
      };

      await registerPosSale(payload);

      setProducts((prevProducts) =>
        prevProducts.map((product) => {
          const soldItem = cart.find((item) => item.id === product.id);

          if (!soldItem) return product;

          return {
            ...product,
            stock: Math.max(product.stock - soldItem.quantity, 0),
          };
        })
      );

      setCart([]);
      sessionStorage.removeItem("posCart");
      setMessage("Venta registrada correctamente.");
    } catch (err) {
      setError(err.message || "No fue posible registrar la venta.");
    } finally {
      setProcessingSale(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.topGrid}>
        <div style={styles.topCard}>
          <span style={styles.cardLabel}>Cajero</span>
          <strong style={styles.cardValue}>{cashierName}</strong>
        </div>

        <div style={styles.topCard}>
          <span style={styles.cardLabel}>Cliente</span>
          <strong style={styles.cardValue}>
            {billingCustomer.fullName || "Consumidor final"}
          </strong>
        </div>

        <div style={styles.topCard}>
          <span style={styles.cardLabel}>Documento</span>
          <strong style={styles.cardValue}>
            {billingCustomer.documentNumber || CONSUMER_FINAL_DOCUMENT}
          </strong>
        </div>
      </div>

      {message && <div style={styles.success}>{message}</div>}
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.mainGrid}>
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <h2 style={styles.panelTitle}>Productos</h2>
            <input
              type="text"
              placeholder="Buscar por nombre o código"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {loadingProducts ? (
            <div style={styles.infoBox}>Cargando productos...</div>
          ) : filteredProducts.length === 0 ? (
            <div style={styles.infoBox}>No hay productos disponibles.</div>
          ) : (
            <div style={styles.productList}>
              {filteredProducts.map((product) => (
                <div key={product.id} style={styles.productCard}>
                  <div>
                    <div style={styles.productName}>{product.name}</div>
                    <div style={styles.productMeta}>Código: {product.code}</div>
                    <div style={styles.productMeta}>
                      Precio: ${product.price.toLocaleString("es-CO")}
                    </div>
                    <div style={styles.productMeta}>
                      Stock: {product.stock}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    style={{
                      ...styles.addButton,
                      opacity: product.stock > 0 ? 1 : 0.6,
                      cursor: product.stock > 0 ? "pointer" : "not-allowed",
                    }}
                  >
                    Agregar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <h2 style={styles.panelTitle}>Carrito POS</h2>
            <div style={styles.summaryMini}>
              {totalItems} producto(s)
            </div>
          </div>

          {cart.length === 0 ? (
            <div style={styles.infoBox}>No hay productos en el carrito.</div>
          ) : (
            <div style={styles.cartList}>
              {cart.map((item) => (
                <div key={item.id} style={styles.cartItem}>
                  <div style={styles.cartInfo}>
                    <div style={styles.productName}>{item.name}</div>
                    <div style={styles.productMeta}>
                      {item.code} · ${item.price.toLocaleString("es-CO")}
                    </div>
                  </div>

                  <div style={styles.qtyBox}>
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                      style={styles.qtyButton}
                    >
                      -
                    </button>

                    <span style={styles.qtyValue}>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id)}
                      style={styles.qtyButton}
                    >
                      +
                    </button>
                  </div>

                  <div style={styles.subtotal}>
                    ${(item.quantity * item.price).toLocaleString("es-CO")}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    style={styles.removeButton}
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={styles.totalBox}>
            <div style={styles.totalRow}>
              <span>Total de productos</span>
              <strong>{totalItems}</strong>
            </div>

            <div style={styles.totalRow}>
              <span>Total venta</span>
              <strong>${totalAmount.toLocaleString("es-CO")}</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConfirmSale}
            disabled={processingSale || cart.length === 0}
            style={{
              ...styles.confirmButton,
              opacity: !processingSale && cart.length > 0 ? 1 : 0.6,
              cursor:
                !processingSale && cart.length > 0 ? "pointer" : "not-allowed",
            }}
          >
            {processingSale ? "Registrando venta..." : "Confirmar venta"}
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
  topGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },
  topCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "18px 20px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.06)",
  },
  cardLabel: {
    display: "block",
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "8px",
    textTransform: "uppercase",
    fontWeight: "700",
  },
  cardValue: {
    fontSize: "18px",
    color: "#0f172a",
  },
  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "14px",
    borderRadius: "14px",
  },
  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "14px",
    borderRadius: "14px",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr",
    gap: "20px",
  },
  panel: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "22px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.08)",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "18px",
  },
  panelTitle: {
    margin: 0,
    color: "#0f172a",
  },
  searchInput: {
    minWidth: "240px",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
  },
  productList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  productCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    background: "#f8fafc",
  },
  productName: {
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "6px",
  },
  productMeta: {
    fontSize: "13px",
    color: "#64748b",
  },
  addButton: {
    border: "none",
    borderRadius: "12px",
    background: "#2563eb",
    color: "#ffffff",
    padding: "10px 16px",
    fontWeight: "700",
  },
  cartList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  cartItem: {
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "14px",
    display: "grid",
    gridTemplateColumns: "1.5fr auto auto auto",
    gap: "12px",
    alignItems: "center",
    background: "#f8fafc",
  },
  cartInfo: {
    minWidth: 0,
  },
  qtyBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  qtyButton: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    border: "none",
    background: "#0f172a",
    color: "#ffffff",
    fontWeight: "800",
    cursor: "pointer",
  },
  qtyValue: {
    minWidth: "24px",
    textAlign: "center",
    fontWeight: "700",
  },
  subtotal: {
    fontWeight: "800",
    color: "#0f172a",
  },
  removeButton: {
    border: "none",
    borderRadius: "10px",
    background: "#ef4444",
    color: "#ffffff",
    padding: "8px 12px",
    fontWeight: "700",
    cursor: "pointer",
  },
  totalBox: {
    marginTop: "18px",
    borderTop: "1px solid #e2e8f0",
    paddingTop: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#0f172a",
  },
  confirmButton: {
    width: "100%",
    marginTop: "18px",
    border: "none",
    borderRadius: "14px",
    background: "#16a34a",
    color: "#ffffff",
    padding: "14px 18px",
    fontWeight: "800",
    fontSize: "15px",
  },
  summaryMini: {
    background: "#e2e8f0",
    color: "#334155",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
  },
  infoBox: {
    background: "#f8fafc",
    border: "1px dashed #cbd5e1",
    borderRadius: "14px",
    padding: "16px",
    color: "#475569",
  },
};