interface IValidationStep {
  title: string;
  status: "pending" | "active" | "completed";
  statusMessage?: string;
}

export default function ValidationStep({
  title,
  status,
  statusMessage
}: IValidationStep) {
  const getIcon = () => {
    switch (status) {
      case "completed":
        return "✓";
      case "active":
        return "⏳";
      default:
        return "•";
    }
  };

  const getStatusText = () => {
    if (statusMessage) return statusMessage;
    switch (status) {
      case "completed":
        return "Completado";
      case "active":
        return "Validando...";
      default:
        return "Pendiente";
    }
  };

  return (
    <div
      className={`validation-step ${status === "active" ? "active" : ""} ${
        status === "completed" ? "completed" : ""
      }`}
    >
      <div className="step-icon">{getIcon()}</div>
      <div className="flex-1">
        <div
          className={`font-semibold ${
            status === "pending" ? "text-secondary-400" : "text-white"
          }`}
        >
          {title}
        </div>
        <div
          className={`text-xs ${
            status === "active" ? "text-primary-500" : "text-secondary-400"
          }`}
        >
          {getStatusText()}
        </div>
      </div>
    </div>
  );
}
