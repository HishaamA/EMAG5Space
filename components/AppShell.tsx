// App Shell with top bar and bottom navigation

"use client";

import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { currentTab, setCurrentTab, currentTelemetry } = useAppStore();
  const t = getTranslations("en");

  const tabs = [
    { id: "dashboard" as const, label: t.tabs.dashboard, icon: "📊" },
    { id: "3d" as const, label: t.tabs.viewer3d, icon: "🌌" },
    { id: "telemetry" as const, label: t.tabs.telemetry, icon: "📈" },
    { id: "ai" as const, label: t.tabs.ai, icon: "🤖" },
    { id: "control" as const, label: "Control", icon: "🎮" },
    { id: "settings" as const, label: t.settings.title, icon: "⚙️" }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800 shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🛸</div>
            <div>
              <h1 className="text-lg font-bold">{t.appTitle}</h1>
              <p className="text-xs text-gray-400">{t.dashboard.simulatedBadge}</p>
            </div>
          </div>
          
          {/* Phase Chip */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {currentTelemetry.phase}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800 shadow-2xl">
        <div className="grid grid-cols-6 gap-1 px-2 py-2">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`
                  flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl
                  transition-all duration-200 touch-manipulation min-h-[56px]
                  ${isActive 
                    ? "bg-blue-500/20 text-blue-400" 
                    : "text-gray-400 hover:bg-gray-800 active:bg-gray-700"
                  }
                `}
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="text-2xl" role="img" aria-hidden="true">
                  {tab.icon}
                </span>
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
