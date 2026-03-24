import React from "react";

const Loader = ({ message = "Cargando..." }) => {
  return (
    <div className="shared-loader-container">
      <div className="shared-loader"></div>
      <p>{message}</p>
    </div>
  );
};

export default Loader;