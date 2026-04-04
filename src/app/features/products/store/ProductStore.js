import React, { createContext, useContext, useReducer } from "react";

const ProductContext = createContext();

const initialState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    search: "",
  },
  page: 1,
  pageSize: 10,
  selected: null,
};

function productReducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "SUCCESS":
      return {
        ...state,
        loading: false,
        items: Array.isArray(action.payload) ? action.payload : [],
        error: null,
      };

    case "ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload || "Ocurrió un error",
      };

    case "FILTER":
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
        page: 1,
      };

    case "PAGE":
      return {
        ...state,
        page: action.payload,
      };

    case "SELECT":
      return {
        ...state,
        selected: action.payload,
      };

    case "DELETE_PRODUCT":
      return {
        ...state,
        items: state.items.filter((product) => product.id !== action.payload),
        selected: null,
      };

    default:
      return state;
  }
}

export function ProductProvider({ children }) {
  const [state, dispatch] = useReducer(productReducer, initialState);

  const loadProducts = async () => {
    dispatch({ type: "LOADING" });

    try {
      // Simulación de datos
      const data = [
        { id: 1, name: "Laptop Lenovo", price: 2500000, stock: 10 },
        { id: 2, name: "Mouse Logitech", price: 80000, stock: 25 },
        { id: 3, name: "Teclado Redragon", price: 150000, stock: 12 },
        { id: 4, name: 'Monitor Samsung', price: 950000, stock: 8 },
        { id: 5, name: "Impresora Epson", price: 670000, stock: 6 },
      ];

      const search = state.filters.search?.toLowerCase() || "";

      const filtered = data.filter((product) =>
        product.name?.toLowerCase().includes(search)
      );

      setTimeout(() => {
        dispatch({ type: "SUCCESS", payload: filtered });
      }, 500);
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: "Error cargando productos",
      });
    }
  };

  return (
    <ProductContext.Provider value={{ state, dispatch, loadProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductStore() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProductStore must be used within ProductProvider");
  }

  return context;
}
