import api from "../../../services/api";

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export const getProducts = async () => {
  return normalizeList(await api.get("/products"));
};

export const createProduct = async (product) => {
  return api.post("/products", product);
};

export const deleteProduct = async (id) => {
  await api.delete(`/products/${id}`);
  return true;
};

export const getCategoryOptions = async () => {
  return normalizeList(await api.get("/categories/options"));
};

export const getCategories = async () => {
  return normalizeList(await api.get("/categories"));
};

export const createCategory = async (category) => {
  const id = await api.post("/categories", category);
  return Number(id);
};

export const updateCategory = async (category) => {
  await api.put("/categories", category);
  return true;
};
