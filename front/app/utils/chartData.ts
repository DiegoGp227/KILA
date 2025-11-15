import { StoredValidation } from "../services/localStorage.service";

export interface ChartDataPoint {
  date: string;
  value: number;
}

/**
 * Group validations by day and count them
 */
export function getValidationsPerDay(
  validations: StoredValidation[],
  days: number = 7
): ChartDataPoint[] {
  const now = new Date();
  const dataPoints: ChartDataPoint[] = [];

  // Create array of last N days
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    // Count validations for this day
    const count = validations.filter((v) => {
      const vDate = new Date(v.timestamp);
      return vDate >= date && vDate < nextDate;
    }).length;

    // Format date label
    let label: string;
    if (i === 0) {
      label = "Hoy";
    } else if (i === 1) {
      label = "Ayer";
    } else {
      label = date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
      });
    }

    dataPoints.push({
      date: label,
      value: count,
    });
  }

  return dataPoints;
}

/**
 * Group validations by week
 */
export function getValidationsPerWeek(
  validations: StoredValidation[],
  weeks: number = 4
): ChartDataPoint[] {
  const now = new Date();
  const dataPoints: ChartDataPoint[] = [];

  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - (i * 7 + 7));
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    // Count validations for this week
    const count = validations.filter((v) => {
      const vDate = new Date(v.timestamp);
      return vDate >= weekStart && vDate < weekEnd;
    }).length;

    // Format week label
    const label = weekStart.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });

    dataPoints.push({
      date: label,
      value: count,
    });
  }

  return dataPoints;
}

/**
 * Group validations by month
 */
export function getValidationsPerMonth(
  validations: StoredValidation[],
  months: number = 3
): ChartDataPoint[] {
  const now = new Date();
  const dataPoints: ChartDataPoint[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

    // Count validations for this month
    const count = validations.filter((v) => {
      const vDate = new Date(v.timestamp);
      return vDate >= monthStart && vDate < monthEnd;
    }).length;

    // Format month label
    const label = monthStart.toLocaleDateString("es-ES", {
      month: "short",
    });

    dataPoints.push({
      date: label.charAt(0).toUpperCase() + label.slice(1),
      value: count,
    });
  }

  return dataPoints;
}

/**
 * Get time period based on total validations
 */
export function getOptimalTimePeriod(totalValidations: number): "day" | "week" | "month" {
  if (totalValidations < 10) return "day";
  if (totalValidations < 30) return "week";
  return "month";
}

/**
 * Get chart data based on time period
 */
export function getChartData(
  validations: StoredValidation[],
  period: "day" | "week" | "month"
): ChartDataPoint[] {
  switch (period) {
    case "day":
      return getValidationsPerDay(validations, 7);
    case "week":
      return getValidationsPerWeek(validations, 4);
    case "month":
      return getValidationsPerMonth(validations, 3);
    default:
      return getValidationsPerDay(validations, 7);
  }
}
