import api from "../../../services/api";

export async function getProducts() {
  return await api.get("/products");
}

export async function getProductById(id) {
  return await api.get(`/products/${id}`);
}

export async function createProduct(product) {
  return await api.post("/products", product);
}

export async function updateProduct(id, product) {
  return await api.put(`/products/${id}`, product);
}

export async function deleteProduct(id) {
  return await api.delete(`/products/${id}`);
}