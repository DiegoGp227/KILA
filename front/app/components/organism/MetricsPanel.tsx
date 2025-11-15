interface IMetricsPanel {
  status: "success" | "error" | "warning";
  errors: number;
  warnings: number;
  passed: number;
  total: number;
  onNewValidation?: () => void;
}

export default function MetricsPanel({
  status,
  errors,
  warnings,
  passed,
  total,
  onNewValidation
}: IMetricsPanel) {
  const getStatusBadge = () => {
    switch (status) {
      case "success":
        return <span className="badge badge-success">Cumple</span>;
      case "error":
        return <span className="badge badge-error">No Cumple</span>;
      case "warning":
        return <span className="badge badge-warning">Advertencias</span>;
    }
  };

  return (
    <div className="metrics-panel fade-in">
      <h3 className="text-base font-bold text-white mb-4">
        Resumen de Validación
      </h3>
      <div className="metric-item">
        <span className="metric-label">Estado</span>
        {getStatusBadge()}
      </div>
      <div className="metric-item">
        <span className="metric-label">Errores</span>
        <span className="metric-value text-error">{errors}</span>
      </div>
      <div className="metric-item">
        <span className="metric-label">Advertencias</span>
        <span className="metric-value text-warning">{warnings}</span>
      </div>
      <div className="metric-item">
        <span className="metric-label">Validaciones</span>
        <span className="metric-value text-success">
          {passed}/{total}
        </span>
      </div>
      <div className="mt-4 pt-4 border-t border-secondary-700">
        <button
          className="btn btn-ghost w-full justify-center"
          onClick={onNewValidation}
        >
          <span>↻</span> Nueva Validación
        </button>
      </div>
    </div>
  );
}
