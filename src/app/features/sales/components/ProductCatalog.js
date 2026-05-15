import React from "react";

const ProductCatalog = ({
  products,
  productFilter,
  productsLoading,
  formatPrice,
  onAddProduct,
  onFilterChange,
  onRefresh,
}) => {
  return (
    <section className="pos-panel catalog-panel">
      <div className="panel-heading">
        <div>
          <span>Inventario</span>
          <h2>Productos</h2>
        </div>
        <button className="pos-ghost-button" onClick={onRefresh} type="button">
          Actualizar
        </button>
      </div>

      <input
        className="pos-input"
        value={productFilter}
        onChange={(event) => onFilterChange(event.target.value)}
        placeholder="Buscar producto o categoria"
      />

      <div className="product-table">
        {productsLoading && <div className="pos-empty-state">Cargando productos...</div>}

        {!productsLoading &&
          products.map((product) => {
            const stock = Number(product.stock || 0);

            return (
              <button
                className="product-row"
                key={product.id}
                onClick={() => onAddProduct(product)}
                disabled={stock <= 0}
                type="button"
              >
                <div className="product-avatar">
                  {String(product.name || "?").slice(0, 2).toUpperCase()}
                </div>
                <div className="product-main">
                  <strong>{product.name}</strong>
                  <span>{product.categoryName || "Sin categoria"}</span>
                </div>
                <div className="product-meta">
                  <strong>{formatPrice(product.price)}</strong>
                  <span className={stock <= 2 ? "stock-low" : ""}>
                    Stock {stock}
                  </span>
                </div>
              </button>
            );
          })}

        {!productsLoading && products.length === 0 && (
          <div className="pos-empty-state">No hay productos para mostrar.</div>
        )}
      </div>
    </section>
  );
};

export default ProductCatalog;
