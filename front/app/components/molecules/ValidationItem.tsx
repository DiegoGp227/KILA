interface IValidationItem {
  type: "error" | "warning" | "success";
  title: string;
  description: string;
  normReference?: string;
  onDetailClick?: () => void;
}

export default function ValidationItem({
  type,
  title,
  description,
  normReference,
  onDetailClick
}: IValidationItem) {
  const getIcon = () => {
    switch (type) {
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "success":
        return "✓";
    }
  };

  return (
    <div className={`validation-item ${type}`}>
      <div className="flex justify-between items-start gap-4">
        <div className={`status-icon ${type}`}>{getIcon()}</div>
        <div className="flex-1">
          <div className="font-semibold text-white mb-1">{title}</div>
          <div
            className="text-secondary-400 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: description }}
          />
          {normReference && (
            <div className="norm-reference">{normReference}</div>
          )}
        </div>
        {onDetailClick && (
          <button className="btn btn-ghost" onClick={onDetailClick}>
            Ver Detalle
          </button>
        )}
      </div>
    </div>
  );
}
