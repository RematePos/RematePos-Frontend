import React from 'react';

const DeleteModalProduct = ({ isOpen, onClose, onConfirm, productName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>¿Estás seguro de eliminar el producto "{productName}"?</h3>
        <div>
          <button onClick={onConfirm}>Eliminar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModalProduct;