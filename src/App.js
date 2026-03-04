import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import './styles/styles.css';  // Importa los estilos aquí

import ProductsPage from './pages/ProductsPage';
import NewProductPage from './pages/NewProductPage';
import EditProductPage from './pages/EditProductPage';
import DeleteModalProduct from './pages/DeleteModalProduct';
import { getProductById, deleteProduct } from './services/api';

export default function App() {
  const [productToDelete, setProductToDelete] = useState(null);

  const openDeleteModal = async (productId) => {
    const product = await getProductById(productId);
    setProductToDelete(product);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      console.log(`Producto con ID ${id} eliminado`);
      setProductToDelete(null); // Cierra el modal después de la eliminación
    } catch (error) {
      console.error('Error al eliminar el producto', error);
    }
  };

  return (
    <Router>
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <h1>RematePOS</h1>
          <p>Sistema de inventario y facturación</p>
        </header>

        {/* Botón para agregar un producto */}
        <div className="add-product-btn-container">
          <Link to="/nuevo-producto">
            <button className="btn btn-success">Agregar Producto</button>
          </Link>
        </div>

        {/* Lista de productos y rutas */}
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/nuevo-producto" element={<NewProductPage />} />
          <Route
            path="/editar-producto/:productId"
            element={<EditProductPage />}
          />
          <Route
            path="/eliminar-producto/:productId"
            element={<DeleteModalProduct
              isOpen={productToDelete !== null}
              onClose={() => setProductToDelete(null)}
              onConfirm={() => handleDeleteProduct(productToDelete.id)}
            />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Botones de servicios disponibles próximamente */}
        <div className="services-buttons">
          <h2>Servicios disponibles próximamente</h2>
          <div className="service-btn-container">
            <button className="btn btn-primary">Inventario</button>
            <button className="btn btn-primary">Facturación</button>
            <button className="btn btn-primary">Reportes</button>
          </div>
        </div>
      </div>
    </Router>
  );
}