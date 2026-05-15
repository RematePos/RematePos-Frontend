import React, { useEffect, useState } from "react";
import "./QuickCategoryModal.css";

const initialForm = {
  name: "",
  description: "",
};

const QuickCategoryModal = ({
  isOpen,
  saving,
  error,
  success,
  onClose,
  onCreate,
}) => {
  const [form, setForm] = useState(initialForm);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setForm(initialForm);
      setValidationError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const name = form.name.trim();

    if (!name) return "El nombre de la categoría es obligatorio.";
    if (name.length < 2) return "El nombre debe tener al menos 2 caracteres.";
    if (name.length > 100) return "El nombre no puede superar 100 caracteres.";

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const message = validate();
    if (message) {
      setValidationError(message);
      return;
    }

    setValidationError("");
    const created = await onCreate({
      name: form.name.trim(),
      description: form.description.trim(),
    });

    if (created) {
      setForm(initialForm);
    }
  };

  return (
    <div className="quick-category-overlay" role="presentation" onClick={onClose}>
      <div
        className="quick-category-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-category-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="quick-category-header">
          <div>
            <span className="quick-category-badge">Categoría</span>
            <h2 id="quick-category-title">Nueva categoría</h2>
            <p>Crea una categoría sin salir del registro de producto.</p>
          </div>
          <button
            type="button"
            className="quick-category-close"
            onClick={onClose}
            aria-label="Cerrar modal de categoría"
            disabled={saving}
          >
            x
          </button>
        </div>

        <form className="quick-category-form" onSubmit={handleSubmit}>
          <label htmlFor="quick-category-name">Nombre</label>
          <input
            id="quick-category-name"
            name="name"
            type="text"
            placeholder="Ej: Ferretería"
            value={form.name}
            onChange={handleChange}
            autoFocus
          />

          <label htmlFor="quick-category-description">Descripción</label>
          <textarea
            id="quick-category-description"
            name="description"
            rows="4"
            placeholder="Descripción opcional"
            value={form.description}
            onChange={handleChange}
          />

          {(validationError || error) && (
            <div className="quick-category-message error">
              {validationError || error}
            </div>
          )}

          {success && (
            <div className="quick-category-message success">{success}</div>
          )}

          <div className="quick-category-actions">
            <button
              type="button"
              className="quick-category-button secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="quick-category-button primary"
              disabled={saving}
            >
              {saving ? "Creando..." : "Crear categoría"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickCategoryModal;
