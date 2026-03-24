import React from "react";
import { Link } from "react-router-dom";

const AppHeader = () => {
  return (
    <header className="app-header">
      <div className="app-header-top">
        <h1>RematePOS</h1>
        <p>Sistema de inventario y facturación</p>
      </div>

      <nav className="app-nav">
        <Link to="/">Inicio</Link>
        <Link to="/products">Productos</Link>
        <Link to="/inventory">Inventario</Link>
        <Link to="/sales">Facturación</Link>
      </nav>
    </header>
  );
};

export default AppHeader;