import React from "react";
import Button from "./Button";

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="shared-modal-overlay">
      <div className="shared-modal">
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="shared-modal-actions">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;