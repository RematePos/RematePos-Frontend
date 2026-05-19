import React, { useCallback, useEffect, useState } from "react";
import analyticsService from "../services/analyticsService";
import Loader from "../../../shared/components/Loader";
import Table from "../../../shared/components/Table";
import "./AnalyticsDashboard.css";

const EMPTY_DASHBOARD = {
  totalSales: 0,
  invoices: 0,
  revenue: 0,
  lowStockCount: 0,
  topProducts: [],
  lowStockProducts: [],
  restockPredictions: [],
  salesTrend: [],
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "0";
  if (typeof value === "number") return new Intl.NumberFormat("es-CO").format(value);
  return String(value);
};

const isEmptyModePayload = (payload) =>
  Boolean(
    payload?.status === "NO_DATA" ||
      payload?.status === "DEMO" ||
      payload?.mode === "DEMO" ||
      payload?.demo === true ||
      payload?.empty === true
  );

const normalizeDashboard = (payload) => {
  if (!payload || isEmptyModePayload(payload)) {
    return {
      dashboard: EMPTY_DASHBOARD,
      note: "Sin datos suficientes todavía",
    };
  }

  return {
    dashboard: {
      ...EMPTY_DASHBOARD,
      ...payload,
      topProducts: Array.isArray(payload.topProducts) ? payload.topProducts : [],
      lowStockProducts: Array.isArray(payload.lowStockProducts)
        ? payload.lowStockProducts
        : [],
      restockPredictions: Array.isArray(payload.restockPredictions)
        ? payload.restockPredictions
        : [],
      salesTrend: Array.isArray(payload.salesTrend) ? payload.salesTrend : [],
    },
    note: "",
  };
};

const getFriendlyErrorState = (error) => {
  const status = Number(error?.status) || 0;

  if (status === 404) {
    return {
      variant: "pending",
      title: "Analítica aún no conectada",
      message:
        "El módulo de Analytics ya está preparado, pero falta conectar el servicio al Gateway para consultar datos reales del negocio.",
      statusLabel: "Pendiente de integración Gateway",
    };
  }

  if (status === 403) {
    return {
      variant: "forbidden",
      title: "No tienes permisos para ver analítica",
      message: "Tu sesión no cuenta con el acceso necesario para esta sección.",
      statusLabel: "Acceso restringido",
    };
  }

  if (status === 401) {
    return {
      variant: "session",
      title: "Tu sesión expiró",
      message: "Vuelve a iniciar sesión para continuar.",
      statusLabel: "Sesión inválida",
    };
  }

  return {
    variant: "error",
    title: "No fue posible cargar la analítica",
    message: "Intenta de nuevo en unos minutos.",
    statusLabel: "Error controlado",
  };
};

const MetricCard = ({ title, value, tone = "default" }) => (
  <div className={`analytics-card analytics-card-${tone}`}>
    <div className="analytics-card-title">{title}</div>
    <div className="analytics-card-value">{formatValue(value)}</div>
  </div>
);

const StatusHero = ({ variant, title, message, statusLabel, onRetry }) => (
  <section className={`analytics-hero analytics-hero-${variant}`}>
    <div className="analytics-hero-badge">{statusLabel}</div>
    <h2>{title}</h2>
    <p>{message}</p>
    {onRetry && (
      <div className="analytics-hero-actions">
        <button type="button" className="analytics-btn analytics-btn-primary" onClick={onRetry}>
          Reintentar
        </button>
      </div>
    )}
  </section>
);

const Section = ({ title, children, subtle = false }) => (
  <section className={`analytics-section ${subtle ? "analytics-section-subtle" : ""}`}>
    <h3>{title}</h3>
    {children}
  </section>
);

export default function AnalyticsDashboardPage() {
  const [reloadIndex, setReloadIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(EMPTY_DASHBOARD);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState({
    variant: null,
    title: "",
    message: "",
    statusLabel: "",
  });

  const isDemo = process.env.REACT_APP_DEMO === "true";

  const clearState = useCallback(() => {
    setLoading(true);
    setStatus({ variant: null, title: "", message: "", statusLabel: "" });
    setNote("");
  }, []);

  useEffect(() => {
    let active = true;

    async function load() {
      clearState();

      try {
        const data = await analyticsService.getDashboard();
        if (!active) return;

        const normalized = normalizeDashboard(data);
        setDashboard(normalized.dashboard);
        setNote(normalized.note);
        setLoading(false);
      } catch (err) {
        if (!active) return;

        setDashboard(EMPTY_DASHBOARD);
        setNote("");
        setStatus(getFriendlyErrorState(err));
        setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [clearState, reloadIndex]);

  if (loading) return <Loader message="Cargando analítica..." />;

  if (status.variant) {
    return (
      <section className="analytics-container analytics-shell">
        <div className="analytics-shell-head">
          <span className="analytics-eyebrow">Analítica</span>
          <h1>Dashboard del negocio</h1>
          <p>Lectura ejecutiva para seguimiento de ventas, inventario y reposición.</p>
        </div>

        <StatusHero
          variant={status.variant}
          title={status.title}
          message={status.message}
          statusLabel={status.statusLabel}
          onRetry={status.variant === "pending" || status.variant === "error" ? () => setReloadIndex((value) => value + 1) : undefined}
        />
      </section>
    );
  }

  return (
    <section className="analytics-container analytics-shell">
      <div className="analytics-shell-head">
        <span className="analytics-eyebrow">Analítica</span>
        <h1>Dashboard del negocio</h1>
        <p>Lectura ejecutiva para seguimiento de ventas, inventario y reposición.</p>
      </div>

      {(isDemo || note) && (
        <div className={`analytics-notice ${isDemo ? "analytics-notice-demo" : ""}`}>
          {isDemo ? "Modo DEMO: datos de ejemplo" : note}
        </div>
      )}

      <div className="analytics-cards">
        <MetricCard title="Ventas totales" value={dashboard.totalSales} tone="blue" />
        <MetricCard title="Facturas" value={dashboard.invoices} tone="violet" />
        <MetricCard title="Ingresos" value={dashboard.revenue} tone="emerald" />
        <MetricCard title="Productos bajo stock" value={dashboard.lowStockCount} tone="rose" />
      </div>

      <Section title="Productos más vendidos">
        <Table
          columns={[
            { key: "name", label: "Producto" },
            { key: "sold", label: "Vendidos" },
          ]}
          data={dashboard.topProducts}
        />
      </Section>

      <Section title="Productos con bajo stock">
        <Table
          columns={[
            { key: "name", label: "Producto" },
            { key: "stock", label: "Stock" },
          ]}
          data={dashboard.lowStockProducts}
        />
      </Section>

      <Section title="Predicción de reposición">
        <Table
          columns={[
            { key: "name", label: "Producto" },
            { key: "expectedDate", label: "Fecha estimada" },
          ]}
          data={dashboard.restockPredictions}
        />
      </Section>

      <Section title="Tendencia de ventas" subtle>
        {dashboard.salesTrend && dashboard.salesTrend.length > 0 ? (
          <Table
            columns={[
              { key: "period", label: "Periodo" },
              { key: "value", label: "Ventas" },
            ]}
            data={dashboard.salesTrend}
          />
        ) : (
          <p className="analytics-empty-inline">No hay datos de tendencia disponibles.</p>
        )}
      </Section>
    </section>
  );
}
