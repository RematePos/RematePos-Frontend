import React, { createContext, useContext, useReducer } from "react";
import { getProducts } from "../services/productService";

const ProductContext = createContext();

const initialState = {
  items: [],
  loading: false,
  error: null,
  filters: { search: "" },
  page: 1,
  pageSize: 10,
  selected: null
};

function reducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true };

    case "SUCCESS":
      return { ...state, loading: false, items: action.payload };

    case "ERROR":
      return { ...state, loading: false, error: action.payload };

    case "FILTER":
      return { ...state, filters: action.payload, page: 1 };

    case "PAGE":
      return { ...state, page: action.payload };

    case "SELECT":
      return { ...state, selected: action.payload };

    default:
      return state;
  }
}

export function ProductProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadProducts = async () => {
    dispatch({ type: "LOADING" });

    try {
      const data = await getProducts();

      const filtered = data.filter(p =>
        p.name?.toLowerCase().includes(state.filters.search.toLowerCase())
      );

      dispatch({ type: "SUCCESS", payload: filtered });

    } catch {
      dispatch({ type: "ERROR", payload: "Error cargando productos" });
    }
  };

  return (
    <ProductContext.Provider
      value={{ state, dispatch, loadProducts }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProductStore = () => useContext(ProductContext);