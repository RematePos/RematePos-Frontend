import React, { useEffect, useMemo, useState } from "react";
import "./CategoriesPage.css";
import {
  createCategory,
  getCategories,
  updateCategory,
} from "../../products/services/productService";

const defaultForm = {
  id: null,
  name: "",
  description: "",
};

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const getCategoryStatus = (status) => {
  const normalizedStatus = (status || "ACTIVE").toUpperCase();

  if (normalizedStatus === "INACTIVE") {
    return {
      className: "chip chip-inactive",
      label: "Inactiva",
    };
  }

  return {
    className: "chip chip-active",
    label: "Activa",
  };
};

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setCategories([]);
      setError("No se pudieron cargar las categorias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return categories;

    return categories.filter((category) => {
      const name = category?.name?.toLowerCase?.() || "";
      const description = category?.description?.toLowerCase?.() || "";
      return name.includes(term) || description.includes(term);
    });
  }, [categories, search]);

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / pageSize));

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredCategories.slice(start, end);
  }, [currentPage, filteredCategories, pageSize]);

  const visibleFrom =
    filteredCategories.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const visibleTo = Math.min(currentPage * pageSize, filteredCategories.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const resetForm = () => {
    setForm(defaultForm);
  };

  const openCreateModal = () => {
    resetForm();
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setForm({
      id: category.id,
      name: category.name || "",
      description: category.description || "",
    });
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const name = form.name.trim();

    if (!name) return "El nombre es obligatorio.";
    if (name.length < 2) return "El nombre debe tener al menos 2 caracteres.";
    if (name.length > 100) return "El nombre no puede superar 100 caracteres.";
    if ((form.description || "").length > 500) {
      return "La descripción no puede superar 500 caracteres.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        id: form.id,
        name: form.name.trim(),
        description: form.description.trim(),
      };

      if (form.id) {
        await updateCategory(payload);
        setSuccess("Categoría actualizada correctamente.");
      } else {
        await createCategory(payload);
        setSuccess("Categoría creada correctamente.");
      }

      await loadCategories();
      setTimeout(() => {
        closeModal();
      }, 450);
    } catch (err) {
      console.error(err);
      if ((err?.message || "").toLowerCase().includes("duplicate")) {
        setError("Ya existe una categoría con ese nombre.");
      } else {
        setError(err?.message || "No se pudo guardar la categoría.");
      }
      setSuccess("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="categories-page rp-page rp-fade-in">
      <div className="categories-container rp-page-shell">
        <header className="categories-header rp-page-header">
          <div>
            <span className="categories-badge rp-badge rp-badge-info">Inventario</span>
            <h1 className="rp-page-title">Gestión de categorías</h1>
            <p className="rp-page-subtitle">Administra categorías activas para productos del sistema POS.</p>
          </div>
          <button type="button" className="btn btn-primary rp-btn rp-btn-primary" onClick={openCreateModal}>
            + Nueva categoría
          </button>
        </header>

        <section className="categories-toolbar rp-card rp-table-toolbar">
          <input
            type="text"
            placeholder="Buscar categoría por nombre o descripción..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="rp-input rp-search"
          />
          <select className="rp-page-size" value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option} registros
              </option>
            ))}
          </select>
          <button type="button" className="btn btn-secondary rp-btn rp-btn-secondary" onClick={loadCategories} disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar"}
          </button>
        </section>

        {error && !isModalOpen && <div className="banner error rp-error-state">{error}</div>}
        {success && !isModalOpen && <div className="banner success rp-empty-state">{success}</div>}

        <section className="categories-card rp-table-shell">
          {loading ? (
            <div className="state-box rp-loading-state">Cargando categorías...</div>
          ) : filteredCategories.length === 0 ? (
            <div className="state-box rp-empty-state">No se encontraron registros.</div>
          ) : (
            <table className="categories-table rp-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCategories.map((category) => {
                  const status = getCategoryStatus(category.status);

                  return (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.description || "Sin descripción"}</td>
                      <td>
                        <span className={status.className}>{status.label}</span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-table"
                          onClick={() => openEditModal(category)}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          <div className="rp-pagination">
            <span className="rp-pagination-info">
              Mostrando {visibleFrom}-{visibleTo} de {filteredCategories.length} registros
            </span>

            <span className="rp-pagination-info">Página {currentPage} de {totalPages}</span>

            <div className="rp-inline-actions">
              <button type="button" className="btn btn-secondary rp-btn rp-btn-secondary" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                Anterior
              </button>
              <button type="button" className="btn btn-primary rp-btn rp-btn-primary" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                Siguiente
              </button>
            </div>
          </div>
        </section>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" role="presentation" onClick={closeModal}>
          <div className="modal-card" role="dialog" onClick={(event) => event.stopPropagation()}>
            <h2>{form.id ? "Editar categoría" : "Nueva categoría"}</h2>
            <p>
              {form.id
                ? "Actualiza los datos de la categoría seleccionada."
                : "Crea una categoría que estará disponible en inventario y ventas."}
            </p>

            <form onSubmit={handleSubmit} className="modal-form">
              <label htmlFor="category-name">Nombre</label>
              <input
                id="category-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: Aseo"
                autoFocus
              />

              <label htmlFor="category-description">Descripción</label>
              <textarea
                id="category-description"
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe la categoría"
              />

              {error && <div className="banner error">{error}</div>}
              {success && <div className="banner success">{success}</div>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Guardando..." : form.id ? "Guardar cambios" : "Crear categoría"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;

