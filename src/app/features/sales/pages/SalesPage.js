import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./SalesPage.css";
import CheckoutPanel from "../components/CheckoutPanel";
import ProductCatalog from "../components/ProductCatalog";
import TicketSummary from "../components/TicketSummary";
import { getProducts } from "../../products/services/productService";
import {
  createCustomer,
  findCustomerByDocument,
} from "../../billing/services/billingService";
import {
  approveSandboxPayment,
  checkoutPurchase,
  createGatewayPayment,
  getInvoiceByPurchaseId,
  registerPurchasePayment,
} from "../services/purchaseService";

const initialCustomerForm = {
  documentType: "CC",
  documentNumber: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "Neiva",
};

const SalesPage = () => {
  const [products, setProducts] = useState([]);
  const [productFilter, setProductFilter] = useState("");
  const [productsLoading, setProductsLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [customerSearch, setCustomerSearch] = useState({
    documentType: "CC",
    documentNumber: "",
  });
  const [customerForm, setCustomerForm] = useState(initialCustomerForm);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [cashReceived, setCashReceived] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [evidenceNote, setEvidenceNote] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [saleResult, setSaleResult] = useState(null);

  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    setError("");

    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setProducts([]);
      setError(err.message || "No fue posible cargar productos.");
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const totals = useMemo(() => {
    const subtotal = cart.reduce(
      (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
    const tax = subtotal * 0.19;

    return {
      subtotal,
      tax,
      total: subtotal + tax,
      items: cart.reduce((acc, item) => acc + Number(item.quantity || 0), 0),
    };
  }, [cart]);

  const filteredProducts = useMemo(() => {
    const term = productFilter.trim().toLowerCase();
    if (!term) return products;

    return products.filter((product) => {
      return [product.name, product.categoryName, product.description]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [products, productFilter]);

  const changePreview = useMemo(() => {
    if (paymentMethod !== "CASH") return 0;
    const received = Number(cashReceived || 0);
    return Math.max(received - totals.total, 0);
  }, [cashReceived, paymentMethod, totals.total]);

  const checkoutAlert = useMemo(() => {
    if (!error) return null;

    const warningMessages = new Set([
      "Selecciona o registra un cliente antes de vender.",
      "Selecciona un cliente antes de finalizar la venta.",
      "Agrega al menos un producto al carrito.",
      "Ingresa el efectivo recibido para calcular el cambio.",
      "El efectivo recibido debe cubrir el total de la venta.",
    ]);

    if (warningMessages.has(error)) {
      return {
        tone: "warning",
        title: "Accion requerida",
        message: error,
      };
    }

    return {
      tone: "danger",
      title: "No fue posible continuar",
      message: error,
    };
  }, [error]);

  const formatPrice = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  const clearStatus = () => {
    setMessage("");
    setError("");
  };

  const selectCustomer = (data) => {
    setCustomer(data);
    setSaleResult(null);
    setShowCustomerForm(false);
    setMessage("Cliente listo para facturar.");
  };

  const handleFinalConsumer = async () => {
    clearStatus();
    try {
      const customer = await findCustomerByDocument("222222222222", "CC");
      selectCustomer(customer);
    } catch (err) {
      setError("No fue posible seleccionar Consumidor Final. Verifica que exista el cliente 222222222222.");
    }
  };

  const handleCustomerSearch = async (event) => {
    event.preventDefault();
    clearStatus();

    if (!customerSearch.documentNumber.trim()) {
      setError("Ingresa el numero de documento.");
      return;
    }

    try {
      const found = await findCustomerByDocument(
        customerSearch.documentNumber.trim(),
        customerSearch.documentType
      );

      if (!found) {
        setShowCustomerForm(true);
        setCustomerForm((prev) => ({
          ...prev,
          documentType: customerSearch.documentType,
          documentNumber: customerSearch.documentNumber.trim(),
        }));
        setError("Cliente no encontrado. Puedes registrarlo sin salir de la venta.");
        return;
      }

      selectCustomer(found);
    } catch (err) {
      setError(err.message || "No fue posible buscar el cliente.");
    }
  };

  const handleCreateCustomer = async (event) => {
    event.preventDefault();
    clearStatus();

    const payload = {
      documentType: customerForm.documentType.trim(),
      documentNumber: customerForm.documentNumber.trim(),
      firstName: customerForm.firstName.trim(),
      lastName: customerForm.lastName.trim(),
      email: customerForm.email.trim(),
      phone: customerForm.phone.trim() || undefined,
      address: customerForm.address.trim() || undefined,
      city: customerForm.city.trim() || undefined,
    };

    if (
      !payload.documentNumber ||
      !payload.firstName ||
      !payload.lastName ||
      !payload.email
    ) {
      setError("Documento, nombre, apellido y correo son obligatorios.");
      return;
    }

    try {
      const created = await createCustomer(payload);
      let selected = {
        ...payload,
        id: created?.id || created?.message || created,
      };

      try {
        selected = await findCustomerByDocument(
          payload.documentNumber,
          payload.documentType
        );
      } catch (err) {
        // Keep local payload if read-after-write is not immediately available.
      }

      selectCustomer(selected);
      setCustomerForm(initialCustomerForm);
      setCustomerSearch({
        documentType: payload.documentType,
        documentNumber: payload.documentNumber,
      });
    } catch (err) {
      setError(err.message || "No fue posible crear el cliente.");
    }
  };

  const addToCart = (product) => {
    clearStatus();

    if (!customer) {
      setError("Selecciona o registra un cliente antes de vender.");
      return;
    }

    if (Number(product.stock || 0) <= 0) {
      setError("Este producto no tiene stock disponible.");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        if (existing.quantity >= Number(product.stock || 0)) {
          setError("No puedes vender mas unidades que el stock disponible.");
          return prev;
        }

        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price || 0),
          stock: Number(product.stock || 0),
          categoryName: product.categoryName,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (productId, value) => {
    const numericValue = Number(value || 0);

    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== productId) return item;
          const quantity = Math.min(Math.max(numericValue, 1), item.stock);
          return { ...item, quantity };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const validatePaymentBeforeCheckout = () => {
    if (paymentMethod !== "CASH") {
      return;
    }

    const received = Number(cashReceived || 0);
    if (!Number.isFinite(received) || received <= 0) {
      throw new Error("Ingresa el efectivo recibido para calcular el cambio.");
    }

    if (!Number.isFinite(received) || received < totals.total) {
      throw new Error("El efectivo recibido debe cubrir el total de la venta.");
    }
  };

  const processApprovedPayment = async (checkout) => {
    const cleanReference = paymentReference.trim();
    const cleanNote = evidenceNote.trim();

    if (paymentMethod === "CASH") {
      return registerPurchasePayment(checkout.purchaseId, {
        paymentMethod: "CASH",
        paidAmount: checkout.total,
        cashReceived: Number(cashReceived || 0),
        evidenceNote: cleanNote || "Pago en efectivo recibido en caja.",
      });
    }

    if (paymentMethod === "CARD_MANUAL") {
      if (!cleanReference) {
        throw new Error("Ingresa la referencia o autorizacion del datafono.");
      }

      return registerPurchasePayment(checkout.purchaseId, {
        paymentMethod: "CARD_MANUAL",
        paidAmount: checkout.total,
        paymentProvider: "OTHER",
        paymentReference: cleanReference,
        providerTransactionId: cleanReference,
        providerStatus: "CONFIRMED_BY_CASHIER",
        evidenceNote: cleanNote || "Pago con datafono registrado manualmente.",
      });
    }

    const pendingGatewayPayment = await createGatewayPayment(checkout.purchaseId, {
      paymentMethod,
      paymentProvider: "WOMPI",
      amount: checkout.total,
    });

    return approveSandboxPayment({
      reference: pendingGatewayPayment.paymentReference,
      providerTransactionId: pendingGatewayPayment.providerTransactionId,
      amount: pendingGatewayPayment.total,
      currency: "COP",
      status: "APPROVED",
      signature: "rematepos-sandbox",
    });
  };

  const processSale = async () => {
    clearStatus();
    setSaleResult(null);

    if (!customer) {
      setError("Selecciona un cliente antes de finalizar la venta.");
      return;
    }

    if (!cart.length) {
      setError("Agrega al menos un producto al carrito.");
      return;
    }

    setProcessing(true);

    try {
      validatePaymentBeforeCheckout();

      const checkout = await checkoutPurchase({
        documentType: customer.documentType,
        documentNumber: customer.documentNumber,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        notes: `Venta POS frontend ${new Date().toISOString()}`,
      });

      const paid = await processApprovedPayment(checkout);

      let invoice = null;
      try {
        invoice = await getInvoiceByPurchaseId(paid.purchaseId);
      } catch (err) {
        invoice = null;
      }

      setSaleResult({
        purchase: paid,
        invoice,
      });
      setCart([]);
      setCashReceived("");
      setPaymentReference("");
      setEvidenceNote("");
      setMessage("Venta pagada, inventario actualizado y factura solicitada correctamente.");
      await loadProducts();
    } catch (err) {
      setError(err.message || "No fue posible completar la venta.");
    } finally {
      setProcessing(false);
    }
  };

  const customerName = customer
    ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim()
    : "";

  return (
    <section className="sales-page">
      <div className="sales-shell">
        <div className="sales-toolbar">
          <div>
            <span className="sales-eyebrow">Punto de venta</span>
            <h1>Operacion de caja</h1>
          </div>
          <div className="toolbar-metrics">
            <div>
              <span>Items</span>
              <strong>{totals.items}</strong>
            </div>
            <div>
              <span>Total estimado</span>
              <strong>{formatPrice(totals.total)}</strong>
            </div>
          </div>
        </div>

        {message && <div className="sales-notice sales-notice-success">{message}</div>}

        {error && checkoutAlert?.tone === "danger" && (
          <div className="sales-notice sales-notice-error">{error}</div>
        )}

        <div className="sales-layout">
          <ProductCatalog
            products={filteredProducts}
            productFilter={productFilter}
            productsLoading={productsLoading}
            formatPrice={formatPrice}
            onAddProduct={addToCart}
            onFilterChange={setProductFilter}
            onRefresh={loadProducts}
          />

          <TicketSummary
            cart={cart}
            totals={totals}
            formatPrice={formatPrice}
            onClearCart={() => setCart([])}
            onRemoveItem={removeFromCart}
            onUpdateQuantity={updateQuantity}
          />

          <CheckoutPanel
            cart={cart}
            cashReceived={cashReceived}
            checkoutAlert={checkoutAlert}
            changePreview={changePreview}
            customer={customer}
            customerForm={customerForm}
            customerName={customerName}
            customerSearch={customerSearch}
            evidenceNote={evidenceNote}
            formatPrice={formatPrice}
            paymentMethod={paymentMethod}
            paymentReference={paymentReference}
            processing={processing}
            saleResult={saleResult}
            showCustomerForm={showCustomerForm}
            onClearCustomer={() => setCustomer(null)}
            onCreateCustomer={handleCreateCustomer}
            onCustomerFormChange={setCustomerForm}
            onCustomerSearch={handleCustomerSearch}
            onCustomerSearchChange={setCustomerSearch}
            onFinalConsumer={handleFinalConsumer}
            onPaymentMethodChange={setPaymentMethod}
            onProcessSale={processSale}
            onSetCashReceived={setCashReceived}
            onSetEvidenceNote={setEvidenceNote}
            onSetPaymentReference={setPaymentReference}
            onToggleCustomerForm={() => setShowCustomerForm((value) => !value)}
          />
        </div>
      </div>
    </section>
  );
};

export default SalesPage;
