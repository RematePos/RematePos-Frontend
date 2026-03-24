import React, { useEffect, useMemo, useState } from "react";
import Table from "../../../shared/components/Table";
import Loader from "../../../shared/components/Loader";
import Alert from "../../../shared/components/Alert";
import ConfirmModal from "../../../shared/components/ConfirmModal";
import Button from "../../../shared/components/Button";
import { ProductProvider } from "../store/ProductStore";
import { useProducts } from "../hooks/UseProducts";

const ProductsContent = () => {
  const { products, loading, error, filters, page, pageSize, selected, dispatch, loadProducts } =
    useProducts();

  const [alert, setAlert] = useState({ type: "", message: "" });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [filters, page]);

  const columns = [
    { key: "name", label: "Nombre" },
    { key: "price", label: "Precio" },
    { key: "stock", label: "Stock" },
  ];

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [products, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));

  const handleDeleteClick = (product) => {
    dispatch({ type: "SELECT", payload: product });
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    const updatedProducts = products.filter((p) => p.id !== selected?.id);

    dispatch({ type: "SUCCESS", payload: updatedProducts });

    setAlert({
      type: "success",
      message: "Producto eliminado correctamente.",
    });

    setShowModal(false);
    dispatch({ type: "SELECT", payload: null });
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    dispatch({ type: "SELECT", payload: null });
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

        <div style={{ margin: "16px 0" }}>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={filters.search}
            onChange={(e) =>
              dispatch({
                type: "FILTER",
                payload: { search: e.target.value },
              })
            }
            style={{
              width: "100%",
              maxWidth: "320px",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <Alert type={alert.type || (error ? "error" : "")} message={alert.message || error || ""} />

        <Table
          columns={columns}
          data={paginatedProducts}
          renderActions={(product) => (
            <div className="actions-row">
              <Button variant="secondary">Editar</Button>
              <Button variant="danger" onClick={() => handleDeleteClick(product)}>
                Eliminar
              </Button>
            </div>
          )}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "16px",
          }}
        >
          <Button
            variant="secondary"
            onClick={() => dispatch({ type: "PAGE", payload: page - 1 })}
            disabled={page === 1}
          >
            Anterior
          </Button>

          <span>
            Página {page} de {totalPages}
          </span>

          <Button
            variant="secondary"
            onClick={() => dispatch({ type: "PAGE", payload: page + 1 })}
            disabled={page >= totalPages}
          >
            Siguiente
          </Button>
        </div>

        <ConfirmModal
          isOpen={showModal}
          title="Confirmar eliminación"
          message={`¿Seguro que deseas eliminar "${selected?.name || ""}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </div>
  );
};

const ProductsPage = () => {
  return (
    <ProductProvider>
      <ProductsContent />
    </ProductProvider>
  );
};

export default ProductsPage;