"use client";

interface DataPoint {
  date: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
}

export default function LineChart({
  data,
  height = 200,
  color = "var(--primary-500)"
}: LineChartProps) {
  // Check if data is valid
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-secondary-400"
        style={{ height: `${height}px` }}
      >
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p>No hay validaciones aún</p>
          <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
            Los datos aparecerán después de la primera validación
          </p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), 1);

  // Log for debugging
  console.log("LineChart data:", data);
  console.log("LineChart maxValue:", maxValue);
  const width = 100;
  const padding = 10;

  // Calculate points for the line
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
    const y = height - ((point.value / maxValue) * (height - 2 * padding) + padding);
    return `${x},${y}`;
  }).join(' ');

  // Create area path
  const areaPoints = data.length > 0
    ? `${padding},${height} ` + points + ` ${width - padding},${height}`
    : '';

  return (
    <div style={{ position: "relative", height: `${height}px` }}>
      {/* Y-axis labels */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          paddingRight: "8px",
        }}
      >
        <span className="text-secondary-400" style={{ fontSize: "0.75rem" }}>
          {maxValue}
        </span>
        <span className="text-secondary-400" style={{ fontSize: "0.75rem" }}>
          {Math.floor(maxValue / 2)}
        </span>
        <span className="text-secondary-400" style={{ fontSize: "0.75rem" }}>
          0
        </span>
      </div>

      {/* Chart area */}
      <div style={{ marginLeft: "40px", height: "100%" }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: "100%", height: "100%", overflow: "visible" }}
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={padding}
              y1={padding + (i * (height - 2 * padding) / 4)}
              x2={width - padding}
              y2={padding + (i * (height - 2 * padding) / 4)}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="0.5"
            />
          ))}

          {/* Area gradient */}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          {data.length > 1 && (
            <polygon
              points={areaPoints}
              fill="url(#lineGradient)"
            />
          )}

          {/* Line */}
          {data.length > 1 && (
            <polyline
              points={points}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data points */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
            const y = height - ((point.value / maxValue) * (height - 2 * padding) + padding);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1.5"
                fill={color}
                stroke="var(--bg-secondary)"
                strokeWidth="1"
              />
            );
          })}
        </svg>
      </div>

      {/* X-axis labels */}
      <div
        style={{
          marginLeft: "40px",
          display: "flex",
          justifyContent: "space-between",
          marginTop: "8px",
        }}
      >
        {data.map((point, index) => {
          // Show only first, middle, and last labels
          if (index === 0 || index === Math.floor(data.length / 2) || index === data.length - 1) {
            return (
              <span
                key={index}
                className="text-secondary-400"
                style={{ fontSize: "0.75rem" }}
              >
                {point.date}
              </span>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
