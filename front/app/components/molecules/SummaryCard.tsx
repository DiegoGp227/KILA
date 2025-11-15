interface ISummaryCard {
  status: "success" | "error" | "warning";
  title: string;
  description: string;
  icon: string;
  errors: number;
  warnings: number;
  passed: number;
}

export default function SummaryCard({
  status,
  title,
  description,
  icon,
  errors,
  warnings,
  passed
}: ISummaryCard) {
  return (
    <div className={`summary-card ${status}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="text-5xl">{icon}</div>
        <div>
          <h3
            className={`text-2xl font-bold mb-1 ${
              status === "error"
                ? "text-error"
                : status === "success"
                ? "text-success"
                : "text-warning"
            }`}
          >
            {title}
          </h3>
          <p className="text-secondary-400 text-sm">{description}</p>
        </div>
      </div>
      <div className="flex gap-8">
        <div>
          <div className="text-error text-2xl font-bold">{errors}</div>
          <div className="text-secondary-400 text-xs">Errores Críticos</div>
        </div>
        <div>
          <div className="text-warning text-2xl font-bold">{warnings}</div>
          <div className="text-secondary-400 text-xs">Advertencias</div>
        </div>
        <div>
          <div className="text-success text-2xl font-bold">{passed}</div>
          <div className="text-secondary-400 text-xs">Validaciones OK</div>
        </div>
      </div>
    </div>
  );
}
