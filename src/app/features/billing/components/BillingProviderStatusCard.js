import React, { useMemo, useState } from "react";
import "./BillingProviderStatusCard.css";

const STATUS_LABELS = {
  VALIDATED_SIMULATED: "Validacion simulada",
  VALIDATED: "Validado por proveedor",
  PROVIDER_FAILED: "Error de proveedor",
  REJECTED: "Rechazado",
};

function getProviderMessage(provider) {
  if (provider === "MOCK_DIAN") {
    return "Documento simulado para demo, sin validez tributaria.";
  }

  if (provider === "ALANUBE_SANDBOX") {
    return "Documento enviado a ambiente sandbox del proveedor tecnologico.";
  }

  return "Proveedor de facturacion no especificado por el backend.";
}

function getStatusMessage(providerStatus) {
  if (providerStatus === "VALIDATED_SIMULATED") {
    return "Validacion simulada.";
  }

  if (providerStatus === "VALIDATED") {
    return "Validado por proveedor.";
  }

  if (providerStatus === "PROVIDER_FAILED") {
    return "No fue posible validar con el proveedor. Revisa configuracion o intenta nuevamente.";
  }

  return "Estado del proveedor no informado.";
}

function getTone(provider, providerStatus, fiscalValid) {
  if (providerStatus === "PROVIDER_FAILED" || providerStatus === "REJECTED") {
    return "danger";
  }

  if (provider === "MOCK_DIAN") {
    return "mock";
  }

  if (provider === "ALANUBE_SANDBOX") {
    return "sandbox";
  }

  if (fiscalValid) {
    return "success";
  }

  return "neutral";
}

function getStatusLabel(providerStatus) {
  if (!providerStatus) return "Sin estado";
  return STATUS_LABELS[providerStatus] || providerStatus;
}

const BillingProviderStatusCard = ({ invoice }) => {
  const [showXml, setShowXml] = useState(false);

  const provider = useMemo(
    () => String(invoice?.provider || "").trim().toUpperCase(),
    [invoice?.provider]
  );
  const providerEnvironment = invoice?.providerEnvironment || "No informado";
  const providerStatus = String(invoice?.providerStatus || "").trim().toUpperCase();
  const providerReference = invoice?.providerReference || "No informada";
  const cufe = invoice?.cufe || "";
  const cude = invoice?.cude || "";
  const qrCode = invoice?.qrCode || "";
  const pdfUrl = invoice?.pdfUrl || "";
  const xmlContent = invoice?.xmlContent || "";
  const fiscalValid = Boolean(invoice?.fiscalValid);
  const validationMessage = invoice?.validationMessage || "";

  if (!provider) {
    return (
      <section className="billing-provider-card billing-provider-card-neutral" aria-live="polite">
        <div className="billing-provider-header">
          <h4>Estado de facturacion electronica</h4>
          <span className="billing-provider-badge">Sin proveedor</span>
        </div>
        <p className="billing-provider-message">Sin informacion de proveedor.</p>
      </section>
    );
  }

  const tone = getTone(provider, providerStatus, fiscalValid);

  return (
    <section className={`billing-provider-card billing-provider-card-${tone}`} aria-live="polite">
      <div className="billing-provider-header">
        <h4>Estado de facturacion electronica</h4>
        <span className="billing-provider-badge">{getStatusLabel(providerStatus)}</span>
      </div>

      <div className="billing-provider-grid">
        <div>
          <span className="label">Proveedor</span>
          <strong>{provider}</strong>
        </div>
        <div>
          <span className="label">Ambiente</span>
          <strong>{providerEnvironment}</strong>
        </div>
        <div>
          <span className="label">Estado proveedor</span>
          <strong>{providerStatus || "Sin estado"}</strong>
        </div>
        <div>
          <span className="label">Referencia proveedor</span>
          <strong>{providerReference}</strong>
        </div>
        <div>
          <span className="label">Validez fiscal</span>
          <strong>{fiscalValid ? "Validado" : "No productivo"}</strong>
        </div>
        {cufe && (
          <div>
            <span className="label">CUFE</span>
            <strong className="truncate">{cufe}</strong>
          </div>
        )}
        {cude && (
          <div>
            <span className="label">CUDE</span>
            <strong className="truncate">{cude}</strong>
          </div>
        )}
      </div>

      <div className="billing-provider-messages">
        <p>{getProviderMessage(provider)}</p>
        <p>{getStatusMessage(providerStatus)}</p>
        {!fiscalValid && (
          <p className="warning">Este documento no tiene validez fiscal productiva.</p>
        )}
        {validationMessage && <p>{validationMessage}</p>}
      </div>

      <div className="billing-provider-actions">
        {qrCode && (
          <a href={qrCode} target="_blank" rel="noreferrer" className="action-link">
            Ver QR
          </a>
        )}
        {pdfUrl && (
          <a href={pdfUrl} target="_blank" rel="noreferrer" className="action-link">
            Ver PDF
          </a>
        )}
        {xmlContent && (
          <button
            type="button"
            className="action-button"
            onClick={() => setShowXml((prev) => !prev)}
          >
            {showXml ? "Ocultar XML" : "Ver XML"}
          </button>
        )}
      </div>

      {showXml && xmlContent && (
        <pre className="billing-provider-xml">{xmlContent}</pre>
      )}
    </section>
  );
};

export default BillingProviderStatusCard;
