import { Link, useLocation, useNavigate } from "react-router-dom";

function AppHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  const isProducts = location.pathname.startsWith("/products");
  const isHome = location.pathname === "/";

  return (
    <header className="app-header">
      <div className="app-header__container">
        <div className="app-brand">
          <div className="app-brand__logo">
            <span>R</span>
          </div>

          <div className="app-brand__content">
            <h1>RematePOS</h1>
            <p>Sistema de inventario y facturación</p>
          </div>
        </div>

        <div className="app-header__right">
          <nav className="app-nav">
            <Link
              to="/"
              className={`app-nav__link ${isHome ? "active" : ""}`}
            >
              Inicio
            </Link>

            <Link
              to="/products"
              className={`app-nav__link ${isProducts ? "active" : ""}`}
            >
              Productos
            </Link>

            <span className="app-nav__pill">Inventario</span>
            <span className="app-nav__pill">Facturación</span>
          </nav>

          <div className="app-header__actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate(-1)}
            >
              ← Atrás
            </button>

            <Link to="/" className="btn btn-soft">
              ⌂ Inicio
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;