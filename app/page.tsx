"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import AppShell from "@/components/AppShell";
import Dashboard from "@/components/Dashboard";
import ThreeDView from "@/components/ThreeDView";
import TelemetryExplorer from "@/components/TelemetryExplorer";
import AiPanel from "@/components/AiPanel";
import ControlPanel from "@/components/ControlPanel";
import Settings from "@/components/Settings";

export default function Home() {
  const { currentTab, startTelemetryGeneration, isGenerating } = useAppStore();

  // Auto-start telemetry generation on mount
  useEffect(() => {
    if (!isGenerating) {
      startTelemetryGeneration();
    }
  }, [startTelemetryGeneration, isGenerating]);

  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return <Dashboard />;
      case "3d":
        return <ThreeDView />;
      case "telemetry":
        return <TelemetryExplorer />;
      case "ai":
        return <AiPanel />;
      case "control":
        return <ControlPanel />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppShell>
      {renderContent()}
    </AppShell>
  );
}
