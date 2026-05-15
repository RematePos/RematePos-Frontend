import React from "react";

const CheckoutPanel = ({
  cart,
  cashReceived,
  changePreview,
  customer,
  customerForm,
  customerName,
  customerSearch,
  evidenceNote,
  formatPrice,
  paymentMethod,
  paymentReference,
  processing,
  saleResult,
  showCustomerForm,
  onClearCustomer,
  onCreateCustomer,
  onCustomerFormChange,
  onCustomerSearch,
  onCustomerSearchChange,
  onFinalConsumer,
  onPaymentMethodChange,
  onProcessSale,
  onSetCashReceived,
  onSetEvidenceNote,
  onSetPaymentReference,
  onToggleCustomerForm,
}) => {
  return (
    <aside className="pos-panel checkout-panel">
      <div className="panel-heading">
        <div>
          <span>Cliente y pago</span>
          <h2>Finalizar</h2>
        </div>
      </div>

      {customer ? (
        <div className="selected-customer">
          <div>
            <span>Cliente</span>
            <strong>{customerName || "Cliente registrado"}</strong>
            <small>
              {customer.documentType} {customer.documentNumber}
            </small>
          </div>
          <button className="pos-ghost-button" onClick={onClearCustomer} type="button">
            Cambiar
          </button>
        </div>
      ) : (
        <form className="customer-search" onSubmit={onCustomerSearch}>
          <label>Buscar por documento</label>
          <div className="inline-fields">
            <select
              className="pos-input select-compact"
              value={customerSearch.documentType}
              onChange={(event) =>
                onCustomerSearchChange({
                  ...customerSearch,
                  documentType: event.target.value,
                })
              }
            >
              <option value="CC">CC</option>
              <option value="TI">TI</option>
              <option value="CE">CE</option>
              <option value="PAS">PAS</option>
              <option value="NIT">NIT</option>
            </select>
            <input
              className="pos-input"
              value={customerSearch.documentNumber}
              onChange={(event) =>
                onCustomerSearchChange({
                  ...customerSearch,
                  documentNumber: event.target.value,
                })
              }
              placeholder="Numero"
            />
          </div>
          <button className="pos-primary-button" type="submit">
            Buscar cliente
          </button>
          <button className="pos-secondary-button" onClick={onFinalConsumer} type="button">
            Consumidor final
          </button>
        </form>
      )}

      {!customer && (
        <button className="pos-secondary-button" onClick={onToggleCustomerForm} type="button">
          {showCustomerForm ? "Ocultar registro" : "Registrar cliente"}
        </button>
      )}

      {showCustomerForm && !customer && (
        <form className="quick-customer-form" onSubmit={onCreateCustomer}>
          <div className="inline-fields">
            <select
              className="pos-input select-compact"
              value={customerForm.documentType}
              onChange={(event) =>
                onCustomerFormChange({
                  ...customerForm,
                  documentType: event.target.value,
                })
              }
            >
              <option value="CC">CC</option>
              <option value="TI">TI</option>
              <option value="CE">CE</option>
              <option value="NIT">NIT</option>
            </select>
            <input
              className="pos-input"
              value={customerForm.documentNumber}
              onChange={(event) =>
                onCustomerFormChange({
                  ...customerForm,
                  documentNumber: event.target.value,
                })
              }
              placeholder="Documento"
            />
          </div>
          <input
            className="pos-input"
            value={customerForm.firstName}
            onChange={(event) =>
              onCustomerFormChange({
                ...customerForm,
                firstName: event.target.value,
              })
            }
            placeholder="Nombre"
          />
          <input
            className="pos-input"
            value={customerForm.lastName}
            onChange={(event) =>
              onCustomerFormChange({
                ...customerForm,
                lastName: event.target.value,
              })
            }
            placeholder="Apellido"
          />
          <input
            className="pos-input"
            value={customerForm.email}
            onChange={(event) =>
              onCustomerFormChange({
                ...customerForm,
                email: event.target.value,
              })
            }
            placeholder="Correo"
            type="email"
          />
          <button className="pos-primary-button" type="submit">
            Crear y seleccionar
          </button>
        </form>
      )}

      <div className="payment-box">
        <label>Metodo de pago</label>
        <div className="payment-switch">
          <button
            className={paymentMethod === "CASH" ? "active" : ""}
            onClick={() => onPaymentMethodChange("CASH")}
            type="button"
          >
            Efectivo
          </button>
          <button
            className={paymentMethod === "CARD_MANUAL" ? "active" : ""}
            onClick={() => onPaymentMethodChange("CARD_MANUAL")}
            type="button"
          >
            Tarjeta
          </button>
          <button
            className={paymentMethod === "NEQUI" ? "active" : ""}
            onClick={() => onPaymentMethodChange("NEQUI")}
            type="button"
          >
            Nequi
          </button>
          <button
            className={paymentMethod === "PSE" ? "active" : ""}
            onClick={() => onPaymentMethodChange("PSE")}
            type="button"
          >
            PSE
          </button>
        </div>

        {paymentMethod === "CASH" && (
          <div className="cash-box">
            <input
              className="pos-input"
              value={cashReceived}
              onChange={(event) => onSetCashReceived(event.target.value)}
              placeholder="Efectivo recibido"
              type="number"
              min="0"
            />
            <div className="change-line">
              <span>Cambio</span>
              <strong>{formatPrice(changePreview)}</strong>
            </div>
          </div>
        )}

        {paymentMethod === "CARD_MANUAL" && (
          <input
            className="pos-input"
            value={paymentReference}
            onChange={(event) => onSetPaymentReference(event.target.value)}
            placeholder="Referencia o autorizacion del datafono"
          />
        )}

        <textarea
          className="pos-input textarea"
          value={evidenceNote}
          onChange={(event) => onSetEvidenceNote(event.target.value)}
          placeholder="Nota de evidencia"
        />
      </div>

      <button
        className="pos-checkout-button"
        disabled={processing || !customer || !cart.length}
        onClick={onProcessSale}
        type="button"
      >
        {processing ? "Procesando..." : "Cobrar y facturar"}
      </button>

      {saleResult && (
        <div className="receipt-box">
          <div className="receipt-header">
            <span>Venta completada</span>
            <strong>#{saleResult.purchase.purchaseId}</strong>
          </div>
          <div>
            <span>Pago</span>
            <strong>
              {saleResult.purchase.paymentMethod} - {saleResult.purchase.paymentStatus}
            </strong>
          </div>
          {saleResult.purchase.cashReceived && (
            <div>
              <span>Efectivo</span>
              <strong>
                {formatPrice(saleResult.purchase.cashReceived)} recibido /{" "}
                {formatPrice(saleResult.purchase.changeAmount)} cambio
              </strong>
            </div>
          )}
          <div>
            <span>Factura</span>
            <strong>
              {saleResult.invoice?.invoiceNumber ||
                saleResult.purchase.invoiceNumber ||
                "Pendiente"}
            </strong>
          </div>
          <div>
            <span>Total</span>
            <strong>{formatPrice(saleResult.purchase.total)}</strong>
          </div>
        </div>
      )}
    </aside>
  );
};

export default CheckoutPanel;
