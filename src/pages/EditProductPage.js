import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Para obtener el ID del producto y navegar
import { getProductById, updateProduct } from '../services/api';

const EditProductPage = () => {
  const { productId } = useParams();  // Obtenemos el ID del producto desde la URL
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Llamamos a la API para obtener los datos del producto
    const fetchProduct = async () => {
      const productData = await getProductById(productId);
      setProduct(productData);
    };
    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      ...product,
      // Aquí puedes actualizar los valores del formulario
    };
    await updateProduct(productId, updatedProduct);
    navigate('/productos');  // Redirige a la lista de productos después de la actualización
  };

  if (!product) return <p>Cargando...</p>;

  return (
    <div className="form-container">
      <h2>Editar Producto</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input
          type="text"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />
        
        <label>Precio:</label>
        <input
          type="number"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
        />
        
        <label>Stock:</label>
        <input
          type="number"
          value={product.stock}
          onChange={(e) => setProduct({ ...product, stock: e.target.value })}
        />
        
        <label>Imagen URL:</label>
        <input
          type="text"
          value={product.imageUrl}
          onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })}
        />
        
        <button type="submit" className="btn btn-success">Guardar</button>
      </form>
    </div>
  );
};

export default EditProductPage;