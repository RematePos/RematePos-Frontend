import React from "react";

const paymentLabels = {
  CASH: "Efectivo interno",
  CARD_MANUAL: "Tarjeta manual / datáfono",
  NEQUI: "Nequi sandbox",
  PSE: "PSE sandbox",
};

const SaleReceipt = ({ formatPrice, saleResult }) => {
  if (!saleResult?.purchase) return null;

  const { invoice, purchase } = saleResult;
  const invoiceNumber = invoice?.invoiceNumber || purchase.invoiceNumber || "Pendiente";
  const items = Array.isArray(purchase.items)
    ? purchase.items
    : Array.isArray(invoice?.items)
      ? invoice.items
      : [];

  return (
    <div className="receipt-box">
      <div className="receipt-header">
        <div>
          <span>Venta completada</span>
          <strong>Compra #{purchase.purchaseId}</strong>
        </div>
        <div>
          <span>Factura</span>
          <strong>{invoiceNumber}</strong>
        </div>
      </div>

      <div className="receipt-message">
        Venta pagada, inventario actualizado y factura solicitada correctamente.
      </div>

      <div className="receipt-summary-grid">
        <div>
          <span>Cliente</span>
          <strong>{purchase.customerFullName || "Cliente no identificado"}</strong>
        </div>
        <div>
          <span>Documento</span>
          <strong>
            {purchase.customerDocumentType || "-"} {purchase.customerDocumentNumber || ""}
          </strong>
        </div>
        <div>
          <span>Método</span>
          <strong>
            {paymentLabels[purchase.paymentMethod] || purchase.paymentMethod || "-"}
          </strong>
        </div>
        <div>
          <span>Estado pago</span>
          <strong>{purchase.paymentStatus || purchase.providerStatus || "-"}</strong>
        </div>
      </div>

      {purchase.paymentReference && (
        <div className="receipt-row">
          <span>Referencia</span>
          <strong>{purchase.paymentReference}</strong>
        </div>
      )}

      {purchase.cashReceived && (
        <div className="receipt-row">
          <span>Efectivo</span>
          <strong>
            {formatPrice(purchase.cashReceived)} recibido /{" "}
            {formatPrice(purchase.changeAmount)} cambio
          </strong>
        </div>
      )}

      <div className="receipt-items">
        <div className="receipt-items-header">
          <span>Producto</span>
          <span>Cant.</span>
          <span>Precio</span>
          <span>Subtotal</span>
        </div>
        {items.map((item) => (
          <div className="receipt-item-row" key={`${item.productId}-${item.productName}`}>
            <span>
              <strong>{item.productName || "Producto"}</strong>
              <small>Código #{item.productId}</small>
            </span>
            <span>{item.quantity}</span>
            <span>{formatPrice(item.unitPrice)}</span>
            <span>{formatPrice(item.lineTotal)}</span>
          </div>
        ))}
      </div>

      <div className="receipt-totals">
        <div>
          <span>Subtotal</span>
          <strong>{formatPrice(purchase.subtotal)}</strong>
        </div>
        <div>
          <span>IVA</span>
          <strong>{formatPrice(purchase.tax)}</strong>
        </div>
        <div className="receipt-total-row">
          <span>Total</span>
          <strong>{formatPrice(purchase.total)}</strong>
        </div>
      </div>
    </div>
  );
};

export default SaleReceipt;
