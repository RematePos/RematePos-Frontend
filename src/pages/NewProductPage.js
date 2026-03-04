import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewProductPage = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      name,
      price,
      stock,
      imageUrl,
    };

    // Simulando la creación de un producto (aquí deberías hacer la llamada a la API)
    console.log('Producto creado:', newProduct);

    // Redirigir al usuario a la página de productos después de crear el producto
    navigate('/productos');
  };

  return (
    <div className="form-container">
      <h2>Nuevo Producto</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Precio:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <label>Stock:</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />

        <label>Imagen URL:</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />

        <button type="submit" className="btn btn-primary">Guardar</button>
      </form>
      <button onClick={() => navigate('/productos')} className="volver-btn">Volver</button>
    </div>
  );
};

export default NewProductPage;