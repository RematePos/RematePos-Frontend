import React, { useEffect } from "react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmación",
  message = "¿Seguro que deseas continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  danger = false,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = () => onClose?.();
  const handleContentClick = (e) => e.stopPropagation();

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.(); // opcional: cierra el modal después de confirmar
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={handleContentClick}
      >
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            {cancelText}
          </button>

          <button
            className={`btn ${danger ? "btn-danger" : "btn-primary"}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;