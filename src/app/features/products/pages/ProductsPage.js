import React, { useEffect, useState } from "react";
import Table from "../../../shared/components/Table";
import Loader from "../../../shared/components/Loader";
import Alert from "../../../shared/components/Alert";
import ConfirmModal from "../../../shared/components/ConfirmModal";
import Button from "../../../shared/components/Button";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setProducts([
        { id: 1, name: "Laptop Lenovo", price: 2500000, stock: 10 },
        { id: 2, name: "Mouse Logitech", price: 80000, stock: 25 },
        { id: 3, name: "Teclado Redragon", price: 150000, stock: 12 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const columns = [
    { key: "name", label: "Nombre" },
    { key: "price", label: "Precio" },
    { key: "stock", label: "Stock" },
  ];

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    setProducts(products.filter((p) => p.id !== selectedProduct.id));
    setAlert({
      type: "success",
      message: "Producto eliminado correctamente.",
    });
    setShowModal(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return <Loader message="Cargando productos..." />;
  }

  return (
    <div className="page-container">
      <div className="page-card">
        <div className="page-header">
          <div>
            <h2 className="page-title">Gestión de productos</h2>
            <p className="page-subtitle">
              Consulta, registra, edita y elimina productos dentro de RematePOS.
            </p>
          </div>

          <Button variant="primary">Nuevo producto</Button>
        </div>

        <Alert type={alert.type} message={alert.message} />

        <Table
          columns={columns}
          data={products}
          renderActions={(product) => (
            <div className="actions-row">
              <Button variant="secondary">Editar</Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteClick(product)}
              >
                Eliminar
              </Button>
            </div>
          )}
        />

        <ConfirmModal
          isOpen={showModal}
          title="Confirmar eliminación"
          message={`¿Seguro que deseas eliminar "${selectedProduct?.name}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowModal(false)}
        />
      </div>
    </div>
  );
};

export default ProductsPage;