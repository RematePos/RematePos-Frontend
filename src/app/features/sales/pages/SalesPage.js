import React, { useEffect, useMemo, useState } from "react";
import "./SalesPage.css";
import { getProducts } from "../../products/services/productService";

const SalesPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setProducts([]);
      }
    };

    load();
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const total = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + Number(item.price || 0) * item.quantity,
      0
    );
  }, [cart]);

  const formatPrice = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  return (
    <div className="sales-page">
      <div className="sales-container">
        <div className="sales-header">
          <div>
            <span className="sales-badge">Punto de venta</span>
            <h1>Ventas</h1>
            <p>Selecciona productos y arma una venta rápida.</p>
          </div>
        </div>

        <div className="sales-grid">
          <div className="sales-card">
            <h2>Productos disponibles</h2>

            <div className="product-list">
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product.id} className="product-item">
                    <div>
                      <strong>{product.name}</strong>
                      <p>{formatPrice(product.price)}</p>
                    </div>

                    <button onClick={() => addToCart(product)}>Agregar</button>
                  </div>
                ))
              ) : (
                <p>No hay productos disponibles.</p>
              )}
            </div>
          </div>

          <div className="sales-card">
            <h2>Resumen de venta</h2>

            <div className="cart-list">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                  </div>
                ))
              ) : (
                <p>No has agregado productos.</p>
              )}
            </div>

            <div className="sales-total">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>

            <button className="checkout-btn">Finalizar venta</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;