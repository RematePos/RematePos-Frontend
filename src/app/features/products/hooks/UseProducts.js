import { useProductStore } from "../store/ProductStore";

export function useProducts() {
  return useProductStore();
}