export default function InfoBox() {
  return (
    <div
      style={{
        marginTop: "2rem",
        padding: "1rem",
        background: "rgba(59, 130, 246, 0.1)",
        border: "1px solid rgba(59, 130, 246, 0.2)",
        borderRadius: "8px",
      }}
    >
      <div style={{ display: "flex", gap: "1rem" }}>
        <div style={{ fontSize: "1.5rem" }}>ℹ️</div>
        <div>
          <div
            style={{
              fontWeight: 600,
              color: "var(--info)",
              marginBottom: "0.5rem",
            }}
          >
            Requisitos de la factura
          </div>
          <ul
            style={{
              color: "var(--secondary-300)",
              fontSize: "0.875rem",
              lineHeight: 1.8,
              paddingLeft: "1.5rem",
            }}
          >
            <li>Datos del proveedor (nombre, dirección, país)</li>
            <li>Datos del importador (NIT, razón social)</li>
            <li>Detalle de mercancía (descripción, cantidad, valor)</li>
            <li>Información de transporte (incoterm, país de origen)</li>
            <li>Valores totales y moneda de transacción</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
