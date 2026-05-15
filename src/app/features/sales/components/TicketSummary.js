import React from "react";

const TicketSummary = ({
  cart,
  totals,
  formatPrice,
  onClearCart,
  onRemoveItem,
  onUpdateQuantity,
}) => {
  return (
    <section className="pos-panel ticket-panel">
      <div className="panel-heading">
        <div>
          <span>Venta actual</span>
          <h2>Carrito</h2>
        </div>
        <button
          className="pos-ghost-button"
          disabled={!cart.length}
          onClick={onClearCart}
          type="button"
        >
          Limpiar
        </button>
      </div>

      <div className="ticket-items">
        {cart.map((item) => (
          <div className="ticket-item" key={item.id}>
            <div>
              <strong>{item.name}</strong>
              <span>{formatPrice(item.price)} unidad</span>
            </div>
            <input
              className="qty-input"
              max={item.stock}
              min="1"
              onChange={(event) => onUpdateQuantity(item.id, event.target.value)}
              type="number"
              value={item.quantity}
            />
            <strong>{formatPrice(item.price * item.quantity)}</strong>
            <button
              className="pos-remove-button"
              onClick={() => onRemoveItem(item.id)}
              type="button"
            >
              Quitar
            </button>
          </div>
        ))}

        {!cart.length && (
          <div className="pos-empty-state">Agrega productos desde el inventario.</div>
        )}
      </div>

      <div className="totals-box">
        <div>
          <span>Subtotal</span>
          <strong>{formatPrice(totals.subtotal)}</strong>
        </div>
        <div>
          <span>IVA 19%</span>
          <strong>{formatPrice(totals.tax)}</strong>
        </div>
        <div className="total-row">
          <span>Total</span>
          <strong>{formatPrice(totals.total)}</strong>
        </div>
      </div>
    </section>
  );
};

export default TicketSummary;
