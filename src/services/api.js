const API_URL = 'http://localhost:5000/products';

// Obtener todos los productos
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

// Obtener un producto por su ID
export const getProductById = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error('Producto no encontrado');
    return await res.json();
  } catch (error) {
    console.error('Error obteniendo producto por ID:', error);
    throw error;
  }
};

// Agregar un nuevo producto
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
    console.error('Error al crear producto:', error);
    throw error;
  }
};

// Actualizar un producto
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
    console.error('Error al actualizar producto:', error);
    throw error;
  }
};

// Eliminar un producto
export const deleteProduct = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error eliminando producto');
    return true;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
};