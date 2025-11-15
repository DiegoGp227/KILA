interface IStatCard {
  label: string;
  value: string | number;
  trend?: {
    direction: "up" | "down" | "neutral";
    value: string;
    isPositive?: boolean;
  };
  valueColor?: string;
}

export default function StatCard({ label, value, trend, valueColor = "var(--primary-500)" }: IStatCard) {
  const getTrendIcon = () => {
    switch (trend?.direction) {
      case "up":
        return "↑";
      case "down":
        return "↓";
      default:
        return "→";
    }
  };

  const getTrendColor = () => {
    if (!trend) return "";
    if (trend.isPositive === undefined) {
      // Auto-detect based on direction
      return trend.direction === "up" ? "text-success" : trend.direction === "down" ? "text-error" : "text-warning";
    }
    return trend.isPositive ? "text-success" : "text-error";
  };

  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color: valueColor }}>
        {value}
      </div>
      {trend && (
        <div className={`stat-trend ${getTrendColor()}`}>
          <span>{getTrendIcon()}</span>
          <span>{trend.value}</span>
        </div>
      )}
    </div>
  );
}
