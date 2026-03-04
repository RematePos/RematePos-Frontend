import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importamos Link para navegación
import ProductCard from '../components/ProductCard';  

const ProductsPage = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Martillo',
      price: 100,
      stock: 50,
      imageUrl: '/images/martillo.jpg',
    },
    {
      id: 2,
      name: 'Pintura',
      price: 200,
      stock: 30,
      imageUrl: '/images/pintura.jpg',
    },
    {
      id: 3,
      name: 'Taladro',
      price: 150,
      stock: 20,
      imageUrl: '/images/taladro.jpg',
    },
  ]);

  // Función para eliminar un producto (simulada)
  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
    console.log('Producto eliminado con ID:', productId);
  };

  return (
    <div>
      <h1>Lista de Productos</h1>
      <div className="products-list">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDeleteProduct}
            />
          ))
        ) : (
          <p>No hay productos disponibles</p>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;