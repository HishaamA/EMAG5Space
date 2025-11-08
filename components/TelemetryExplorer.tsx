// Telemetry Explorer with filters, table, charts, and CSV export

"use client";

import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import { TimeRange } from "@/types";
import { downloadCsv } from "@/lib/telemetry";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

export default function TelemetryExplorer() {
  const { selectedTimeRange, setTimeRange, getTelemetryForRange } = useAppStore();
  const t = getTranslations("en");

  const telemetryData = getTelemetryForRange(selectedTimeRange);
  
  const timeRanges: TimeRange[] = ["15m", "1h", "6h", "24h"];

  const handleExportCsv = () => {
    const filename = `telemetry_${selectedTimeRange}_${Date.now()}.csv`;
    downloadCsv(telemetryData, filename);
  };

  // Prepare chart data
  const chartData = telemetryData.map(t => ({
    time: format(new Date(t.t), "HH:mm:ss"),
    distance: t.distance_km,
    velocity: t.velocity_kms,
    fuel: t.fuel_pct,
    temp: t.bus_temp_c,
    battery: t.battery_pct,
    latency: t.comms_latency_ms
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-xs text-gray-400 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2 text-gray-100">
          {t.telemetry.title}
        </h2>
        <p className="text-sm text-gray-400">
          Explore and export mission telemetry data
        </p>
      </div>

      {/* Filters */}
      <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">
              {t.telemetry.timeRange}
            </label>
            <div className="flex flex-wrap gap-2">
              {timeRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                    touch-manipulation min-h-[44px]
                    ${selectedTimeRange === range
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }
                  `}
                >
                  {t.telemetry.ranges[range]}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleExportCsv}
            disabled={telemetryData.length === 0}
            className="px-6 py-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 
                       text-white font-semibold rounded-xl transition-all duration-200 
                       touch-manipulation min-h-[48px] disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            <span>📥</span>
            {t.telemetry.exportCsv}
          </button>
        </div>
      </div>

      {/* Charts */}
      {telemetryData.length > 0 ? (
        <div className="space-y-6">
          {/* Distance & Velocity Chart */}
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">
              Distance & Velocity
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fill: "#9ca3af", fontSize: 10 }}
                    stroke="#374151"
                  />
                  <YAxis 
                    yAxisId="left"
                    tick={{ fill: "#9ca3af", fontSize: 10 }}
                    stroke="#374151"
                    label={{ value: "Distance (km)", angle: -90, position: "insideLeft", fill: "#60a5fa" }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: "#9ca3af", fontSize: 10 }}
                    stroke="#374151"
                    label={{ value: "Velocity (km/s)", angle: 90, position: "insideRight", fill: "#34d399" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="distance" 
                    stroke="#60a5fa" 
                    name="Distance"
                    dot={false}
                    strokeWidth={2}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="velocity" 
                    stroke="#34d399" 
                    name="Velocity"
                    dot={false}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* System Health Chart */}
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">
              System Health
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fill: "#9ca3af", fontSize: 10 }}
                    stroke="#374151"
                  />
                  <YAxis 
                    tick={{ fill: "#9ca3af", fontSize: 10 }}
                    stroke="#374151"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="fuel" 
                    stroke="#fbbf24" 
                    name="Fuel %"
                    dot={false}
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="battery" 
                    stroke="#22d3ee" 
                    name="Battery %"
                    dot={false}
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="temp" 
                    stroke="#fb923c" 
                    name="Temperature °C"
                    dot={false}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-4 overflow-x-auto">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">
              Data Table ({telemetryData.length} records)
            </h3>
            <div className="overflow-x-auto -mx-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-3 py-2 text-left text-gray-400 font-semibold">Time</th>
                    <th className="px-3 py-2 text-right text-gray-400 font-semibold">Distance (km)</th>
                    <th className="px-3 py-2 text-right text-gray-400 font-semibold">Velocity (km/s)</th>
                    <th className="px-3 py-2 text-right text-gray-400 font-semibold">Fuel %</th>
                    <th className="px-3 py-2 text-right text-gray-400 font-semibold">Temp °C</th>
                    <th className="px-3 py-2 text-right text-gray-400 font-semibold">Battery %</th>
                    <th className="px-3 py-2 text-left text-gray-400 font-semibold">Phase</th>
                  </tr>
                </thead>
                <tbody>
                  {telemetryData.slice(-50).reverse().map((t, index) => (
                    <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="px-3 py-2 text-gray-300">
                        {format(new Date(t.t), "HH:mm:ss")}
                      </td>
                      <td className="px-3 py-2 text-right text-blue-400">
                        {t.distance_km.toFixed(0)}
                      </td>
                      <td className="px-3 py-2 text-right text-green-400">
                        {t.velocity_kms.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-right text-yellow-400">
                        {t.fuel_pct.toFixed(1)}
                      </td>
                      <td className="px-3 py-2 text-right text-orange-400">
                        {t.bus_temp_c.toFixed(1)}
                      </td>
                      <td className="px-3 py-2 text-right text-cyan-400">
                        {t.battery_pct.toFixed(1)}
                      </td>
                      <td className="px-3 py-2 text-gray-300">
                        {t.phase}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {telemetryData.length > 50 && (
              <p className="mt-3 text-xs text-gray-500 text-center">
                Showing last 50 of {telemetryData.length} records. Export CSV for full data.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-12 text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-400">{t.telemetry.noData}</p>
        </div>
      )}
    </div>
  );
}
