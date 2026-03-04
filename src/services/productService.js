const API_URL = 'http://localhost:5000/products';

export const getProducts = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error cargando productos');
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error('Producto no encontrado');
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addProduct = async (product) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Error creando producto');
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateProduct = async (id, product) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Error actualizando producto');
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error eliminando producto');
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};