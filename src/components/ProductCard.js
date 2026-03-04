import React from 'react';
import { Link } from 'react-router-dom';  // Asegúrate de importar Link

const ProductCard = ({ product, onDelete }) => {
  return (
    <div className="product-card">
      <img className="product-image" src={product.imageUrl} alt={product.name} />
      
      <h3>{product.name}</h3>
      <p><b>Precio:</b> ${product.price}</p>
      <p><b>Stock:</b> {product.stock}</p>

      <div className="product-actions">
        {/* Botón para editar producto */}
        <Link to={`/editar-producto/${product.id}`}>
          <button className="btn btn-primary">Editar</button>
        </Link>
        {/* Botón para eliminar producto */}
        <button className="btn btn-danger" onClick={() => onDelete(product.id)}>Eliminar</button>
      </div>
    </div>
  );
};

export default ProductCard;