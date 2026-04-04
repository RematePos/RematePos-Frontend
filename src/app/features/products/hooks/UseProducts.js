import { useProductStore } from "../store/ProductStore";

export function useProducts() {
  const { state, dispatch, loadProducts } = useProductStore();

  return {
    products: state.items || [],
    loading: state.loading,
    error: state.error,
    filters: state.filters || { search: "" },
    page: state.page || 1,
    pageSize: state.pageSize || 10,
    selected: state.selected || null,
    dispatch,
    loadProducts,
  };
}