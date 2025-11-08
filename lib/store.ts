// Zustand store for global state management

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Telemetry, Settings, TimeRange } from "@/types";
import { 
  TelemetryRingBuffer, 
  tick, 
  resetSeed, 
  getInitialTelemetry,
  applyCommand 
} from "@/lib/telemetry";

interface AppState {
  // Telemetry
  telemetryBuffer: TelemetryRingBuffer;
  currentTelemetry: Telemetry;
  isGenerating: boolean;
  
  // Settings
  settings: Settings;
  
  // UI State
  currentTab: "dashboard" | "3d" | "telemetry" | "ai" | "control" | "settings";
  selectedTimeRange: TimeRange;
  
  // Actions
  startTelemetryGeneration: () => void;
  stopTelemetryGeneration: () => void;
  resetTelemetry: () => void;
  updateSettings: (settings: Partial<Settings>) => void;
  setCurrentTab: (tab: "dashboard" | "3d" | "telemetry" | "ai" | "control" | "settings") => void;
  setTimeRange: (range: TimeRange) => void;
  getTelemetryForRange: (range: TimeRange) => Telemetry[];
}

// Global interval reference
let telemetryInterval: NodeJS.Timeout | null = null;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      telemetryBuffer: new TelemetryRingBuffer(),
      currentTelemetry: getInitialTelemetry(),
      isGenerating: false,
      
      settings: {
        geminiApiKey: "",
        refreshRate: 5000, // 5 seconds
        theme: "dark",
        toneMode: "tech"
      },
      
      currentTab: "dashboard",
      selectedTimeRange: "15m",
      
      // Start generating telemetry data
      startTelemetryGeneration: () => {
        const state = get();
        if (state.isGenerating) return;
        
        set({ isGenerating: true });
        
        telemetryInterval = setInterval(() => {
          const current = get().currentTelemetry;
          const next = tick(current);
          const buffer = get().telemetryBuffer;
          
          buffer.push(next);
          set({ currentTelemetry: next });
        }, state.settings.refreshRate);
      },
      
      // Stop generating telemetry data
      stopTelemetryGeneration: () => {
        if (telemetryInterval) {
          clearInterval(telemetryInterval);
          telemetryInterval = null;
        }
        set({ isGenerating: false });
      },
      
      // Reset telemetry to initial state
      resetTelemetry: () => {
        const state = get();
        state.stopTelemetryGeneration();
        
        resetSeed(42);
        const newBuffer = new TelemetryRingBuffer();
        const initialTelemetry = getInitialTelemetry();
        
        set({ 
          telemetryBuffer: newBuffer,
          currentTelemetry: initialTelemetry
        });
        
        // Restart generation if it was running
        if (state.isGenerating) {
          setTimeout(() => state.startTelemetryGeneration(), 100);
        }
      },
      
      // Update settings
      updateSettings: (newSettings: Partial<Settings>) => {
        const state = get();
        const wasGenerating = state.isGenerating;
        
        // Stop generation if refresh rate is changing
        if (newSettings.refreshRate && newSettings.refreshRate !== state.settings.refreshRate) {
          state.stopTelemetryGeneration();
        }
        
        set({ 
          settings: { ...state.settings, ...newSettings } 
        });
        
        // Restart with new rate if was generating
        if (wasGenerating && newSettings.refreshRate) {
          setTimeout(() => state.startTelemetryGeneration(), 100);
        }
      },
      
      // Set current tab
      setCurrentTab: (tab) => {
        set({ currentTab: tab });
      },
      
      // Set time range filter
      setTimeRange: (range) => {
        set({ selectedTimeRange: range });
      },
      
      // Get telemetry for a specific time range
      getTelemetryForRange: (range: TimeRange): Telemetry[] => {
        const buffer = get().telemetryBuffer;
        
        switch (range) {
          case "15m":
            return buffer.getLastMinutes(15);
          case "1h":
            return buffer.getLastMinutes(60);
          case "6h":
            return buffer.getLastMinutes(360);
          case "24h":
            return buffer.getLastMinutes(1440);
          default:
            return buffer.getLast(180); // Default to last 15 min
        }
      }
    }),
    {
      name: "asteroid-mission-storage",
      // Only persist settings, not telemetry data
      partialize: (state) => ({ 
        settings: state.settings,
        selectedTimeRange: state.selectedTimeRange
      })
    }
  )
);

// Hook to auto-start telemetry generation on mount
export function useTelemetryAutoStart() {
  const { startTelemetryGeneration, isGenerating } = useAppStore();
  
  if (typeof window !== "undefined" && !isGenerating) {
    startTelemetryGeneration();
    
    // Listen for spacecraft commands
    window.addEventListener("spacecraft-command", (event: any) => {
      applyCommand(event.detail);
    });
  }
}
