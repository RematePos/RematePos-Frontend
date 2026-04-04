const RAW_API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
const API_URL = RAW_API_URL.endsWith("/products")
  ? RAW_API_URL
  : `${RAW_API_URL}/products`;

const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return null;
};

export const getProducts = async () => {
  const response = await fetch(API_URL);
  const data = await handleResponse(response);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;

  return [];
};

export const createProduct = async (product) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  return handleResponse(response);
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`No se pudo eliminar el producto ${id}`);
  }

  return true;
};