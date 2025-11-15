"use client";

import { useTranslation } from "@/app/i18n/LanguageContext";

interface DonutChartProps {
  approved: number;
  rejected: number;
  warning: number;
  size?: number;
}

export default function DonutChart({
  approved,
  rejected,
  warning,
  size = 200
}: DonutChartProps) {
  const t = useTranslation();
  const total = approved + rejected + warning;

  if (total === 0) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ height: `${size}px` }}
      >
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-secondary-400 text-sm">{t.common.noData}</p>
        </div>
      </div>
    );
  }

  const approvedPercent = (approved / total) * 100;
  const rejectedPercent = (rejected / total) * 100;
  const warningPercent = (warning / total) * 100;

  // Calculate SVG circle paths
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const center = 100;

  // Calculate dash offsets for each segment
  const approvedDash = (approvedPercent / 100) * circumference;
  const rejectedDash = (rejectedPercent / 100) * circumference;
  const warningDash = (warningPercent / 100) * circumference;

  const approvedOffset = 0;
  const rejectedOffset = -approvedDash;
  const warningOffset = -(approvedDash + rejectedDash);

  return (
    <div className="flex flex-col items-center">
      {/* Donut Chart */}
      <div style={{ position: "relative", width: `${size}px`, height: `${size}px` }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="30"
          />

          {/* Approved segment */}
          {approved > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="var(--success)"
              strokeWidth="30"
              strokeDasharray={`${approvedDash} ${circumference}`}
              strokeDashoffset={approvedOffset}
              strokeLinecap="round"
            />
          )}

          {/* Rejected segment */}
          {rejected > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="var(--error)"
              strokeWidth="30"
              strokeDasharray={`${rejectedDash} ${circumference}`}
              strokeDashoffset={rejectedOffset}
              strokeLinecap="round"
            />
          )}

          {/* Warning segment */}
          {warning > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="var(--warning)"
              strokeWidth="30"
              strokeDasharray={`${warningDash} ${circumference}`}
              strokeDashoffset={warningOffset}
              strokeLinecap="round"
            />
          )}
        </svg>

        {/* Center text */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>
            {total}
          </div>
          <div className="text-secondary-400" style={{ fontSize: "0.875rem" }}>
            {t.common.total}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 w-full space-y-2">
        {approved > 0 && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "2px",
                  backgroundColor: "var(--success)",
                }}
              />
              <span className="text-secondary-300" style={{ fontSize: "0.875rem" }}>
                {t.common.approvedPlural}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-success font-bold">{approved}</span>
              <span className="text-secondary-400" style={{ fontSize: "0.75rem" }}>
                ({approvedPercent.toFixed(0)}%)
              </span>
            </div>
          </div>
        )}

        {rejected > 0 && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "2px",
                  backgroundColor: "var(--error)",
                }}
              />
              <span className="text-secondary-300" style={{ fontSize: "0.875rem" }}>
                {t.common.rejectedPlural}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-error font-bold">{rejected}</span>
              <span className="text-secondary-400" style={{ fontSize: "0.75rem" }}>
                ({rejectedPercent.toFixed(0)}%)
              </span>
            </div>
          </div>
        )}

        {warning > 0 && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "2px",
                  backgroundColor: "var(--warning)",
                }}
              />
              <span className="text-secondary-300" style={{ fontSize: "0.875rem" }}>
                {t.common.withWarnings}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-warning font-bold">{warning}</span>
              <span className="text-secondary-400" style={{ fontSize: "0.75rem" }}>
                ({warningPercent.toFixed(0)}%)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
