// KPI Grid component showing key mission metrics

"use client";

import { Telemetry } from "@/types";
import { getTranslations } from "@/lib/i18n";

interface KpiGridProps {
  telemetry: Telemetry;
}

export default function KpiGrid({ telemetry }: KpiGridProps) {
  const t = getTranslations("en");

  const kpis = [
    {
      label: t.dashboard.kpis.distance,
      value: telemetry.distance_km.toFixed(0),
      unit: "km",
      trend: "down" as const,
      color: "text-green-400"
    },
    {
      label: t.dashboard.kpis.velocity,
      value: telemetry.velocity_kms.toFixed(2),
      unit: "km/s",
      trend: "flat" as const,
      color: "text-blue-400"
    },
    {
      label: t.dashboard.kpis.fuel,
      value: telemetry.fuel_pct.toFixed(1),
      unit: "%",
      trend: "down" as const,
      color: telemetry.fuel_pct > 50 ? "text-green-400" : "text-yellow-400"
    },
    {
      label: t.dashboard.kpis.temperature,
      value: telemetry.bus_temp_c.toFixed(1),
      unit: "°C",
      trend: "flat" as const,
      color: "text-orange-400"
    },
    {
      label: t.dashboard.kpis.battery,
      value: telemetry.battery_pct.toFixed(1),
      unit: "%",
      trend: "flat" as const,
      color: "text-cyan-400"
    },
    {
      label: t.dashboard.kpis.latency,
      value: telemetry.comms_latency_ms.toFixed(0),
      unit: "ms",
      trend: "flat" as const,
      color: telemetry.comms_latency_ms < 500 ? "text-green-400" : "text-yellow-400"
    }
  ];

  const getTrendIcon = (trend: "up" | "down" | "flat") => {
    switch (trend) {
      case "up": return "↗";
      case "down": return "↘";
      default: return "→";
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-4 
                     shadow-lg hover:shadow-xl transition-all duration-200 
                     hover:border-gray-700 touch-manipulation"
        >
          <div className="text-xs text-gray-400 font-medium mb-2">
            {kpi.label}
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-bold ${kpi.color}`}>
                {kpi.value}
              </span>
              {kpi.unit && (
                <span className="text-sm text-gray-500">
                  {kpi.unit}
                </span>
              )}
            </div>
            <span className="text-lg text-gray-600" aria-label={`Trend: ${kpi.trend}`}>
              {getTrendIcon(kpi.trend)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
