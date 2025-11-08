// Dashboard page component

"use client";

import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import KpiGrid from "./KpiGrid";
import MiniCharts from "./MiniCharts";
import AiCard from "./AiCard";

export default function Dashboard() {
  const { currentTelemetry, getTelemetryForRange } = useAppStore();
  const t = getTranslations("en");
  
  // Get last 15 minutes for mini charts
  const recentTelemetry = getTelemetryForRange("15m");

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-gray-100">
          {t.dashboard.title}
        </h2>
        <KpiGrid telemetry={currentTelemetry} />
      </section>

      {/* Mini Charts */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-gray-100">
          Live Telemetry
        </h2>
        <MiniCharts telemetry={recentTelemetry} />
      </section>

      {/* AI Cards */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-gray-100">
          AI Analysis
        </h2>
        <div className="space-y-4">
          <AiCard type="prediction" />
          <AiCard type="summary" />
        </div>
      </section>
    </div>
  );
}
