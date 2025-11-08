// Mini charts component for live telemetry visualization

"use client";

import { Telemetry } from "@/types";
import { getTranslations } from "@/lib/i18n";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { format } from "date-fns";

interface MiniChartsProps {
  telemetry: Telemetry[];
}

export default function MiniCharts({ telemetry }: MiniChartsProps) {
  const t = getTranslations("en");

  // Prepare data for each chart
  const velocityData = telemetry.map(t => ({
    time: t.t,
    value: t.velocity_kms
  }));

  const tempData = telemetry.map(t => ({
    time: t.t,
    value: t.bus_temp_c
  }));

  const batteryData = telemetry.map(t => ({
    time: t.t,
    value: t.battery_pct
  }));

  const latencyData = telemetry.map(t => ({
    time: t.t,
    value: t.comms_latency_ms
  }));

  const charts = [
    {
      title: t.dashboard.miniCharts.velocity,
      data: velocityData,
      color: "#60a5fa",
      unit: "km/s"
    },
    {
      title: t.dashboard.miniCharts.temperature,
      data: tempData,
      color: "#fb923c",
      unit: "°C"
    },
    {
      title: t.dashboard.miniCharts.battery,
      data: batteryData,
      color: "#22d3ee",
      unit: "%"
    },
    {
      title: t.dashboard.miniCharts.latency,
      data: latencyData,
      color: "#a78bfa",
      unit: "ms"
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-2 shadow-xl">
          <p className="text-xs text-gray-400">
            {format(new Date(payload[0].payload.time), "HH:mm:ss")}
          </p>
          <p className="text-sm font-bold text-white">
            {payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {charts.map((chart, index) => (
        <div
          key={index}
          className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-4 
                     shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <h3 className="text-sm font-semibold text-gray-300 mb-3">
            {chart.title}
          </h3>
          
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart.data}>
                <XAxis 
                  dataKey="time" 
                  tick={false}
                  axisLine={{ stroke: "#374151" }}
                />
                <YAxis 
                  tick={{ fill: "#9ca3af", fontSize: 10 }}
                  axisLine={{ stroke: "#374151" }}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={chart.color}
                  strokeWidth={2}
                  dot={false}
                  animationDuration={300}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {chart.data.length > 0 && (
            <div className="mt-2 text-xs text-gray-500 flex justify-between">
              <span>
                Min: {Math.min(...chart.data.map(d => d.value)).toFixed(1)} {chart.unit}
              </span>
              <span>
                Max: {Math.max(...chart.data.map(d => d.value)).toFixed(1)} {chart.unit}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
