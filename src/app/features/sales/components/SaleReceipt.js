import React from "react";
import "./SaleReceipt.css";

const SaleReceipt = ({ saleResult, customer, cart, formatPrice }) => {
  if (!saleResult) return null;

  const { purchase, invoice } = saleResult;
  const invoiceNumber =
    invoice?.invoiceNumber || purchase?.invoiceNumber || "Pendiente";

  // Use cart items to show product details if available
  const items = cart && cart.length > 0 ? cart : [];

  // Calculate totals from purchase or items
  const subtotal = purchase?.subtotal || 
    items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = purchase?.tax || subtotal * 0.19;
  const total = purchase?.total || subtotal + tax;

  return (
    <div className="sale-receipt">
      <div className="receipt-container">
        {/* Receipt Header */}
        <div className="receipt-header-section">
          <div className="receipt-title">
            <h3>VENTA COMPLETADA</h3>
            <p className="receipt-number">Venta #{purchase?.purchaseId}</p>
          </div>
        </div>

        {/* Customer Section */}
        {customer && (
          <div className="receipt-customer-section">
            <div className="customer-info">
              <div className="info-row">
                <span className="label">CLIENTE:</span>
                <span className="value">
                  {customer?.firstName} {customer?.lastName}
                </span>
              </div>
              {customer?.documentNumber && (
                <div className="info-row">
                  <span className="label">DOCUMENTO:</span>
                  <span className="value">
                    {customer?.documentType} {customer?.documentNumber}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Invoice Number */}
        <div className="receipt-invoice-section">
          <div className="info-row">
            <span className="label">FACTURA:</span>
            <span className="value">{invoiceNumber}</span>
          </div>
        </div>

        {/* Items Section */}
        {items.length > 0 && (
          <div className="receipt-items-section">
            <table className="receipt-items-table">
              <thead>
                <tr>
                  <th className="col-product">PRODUCTO</th>
                  <th className="col-qty">CANT</th>
                  <th className="col-price">PRECIO</th>
                  <th className="col-subtotal">SUBTOTAL</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="col-product">
                      <div className="product-name">{item.name}</div>
                      {item.categoryName && (
                        <div className="product-category">{item.categoryName}</div>
                      )}
                    </td>
                    <td className="col-qty text-center">{item.quantity}</td>
                    <td className="col-price text-right">
                      {formatPrice(item.price)}
                    </td>
                    <td className="col-subtotal text-right">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Totals Section */}
        <div className="receipt-totals-section">
          <div className="totals-row">
            <span className="label">SUBTOTAL:</span>
            <span className="value">{formatPrice(subtotal)}</span>
          </div>
          <div className="totals-row">
            <span className="label">IVA (19%):</span>
            <span className="value">{formatPrice(tax)}</span>
          </div>
          <div className="totals-row total-final">
            <span className="label">TOTAL:</span>
            <span className="value">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Payment Section */}
        <div className="receipt-payment-section">
          <div className="info-row">
            <span className="label">MÉTODO DE PAGO:</span>
            <span className="value">
              {purchase?.paymentMethod === "CASH"
                ? "EFECTIVO"
                : purchase?.paymentMethod || "No especificado"}
            </span>
          </div>
          <div className="info-row">
            <span className="label">ESTADO DE PAGO:</span>
            <span className="value payment-status">
              {purchase?.paymentStatus}
            </span>
          </div>
        </div>

        {/* Cash Details (if applicable) */}
        {purchase?.cashReceived && (
          <div className="receipt-cash-section">
            <div className="info-row">
              <span className="label">EFECTIVO RECIBIDO:</span>
              <span className="value">
                {formatPrice(purchase.cashReceived)}
              </span>
            </div>
            <div className="info-row">
              <span className="label">CAMBIO:</span>
              <span className="value change-amount">
                {formatPrice(purchase.changeAmount)}
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="receipt-footer">
          <p>Gracias por su compra</p>
        </div>
      </div>
    </div>
  );
};

export default SaleReceipt;
