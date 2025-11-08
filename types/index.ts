// Core type definitions for the Asteroid Mission Tracker

export type MissionPhase = 
  | "Launch" 
  | "Cruise" 
  | "Approach" 
  | "Proximity Ops" 
  | "Surface Ops";

export type Telemetry = {
  t: number; // timestamp in ms
  distance_km: number;
  velocity_kms: number;
  fuel_pct: number;
  bus_temp_c: number;
  battery_pct: number;
  comms_latency_ms: number;
  phase: MissionPhase;
};

export type Kpi = {
  label: string;
  value: string;
  unit?: string;
  trend?: "up" | "down" | "flat";
};

export type Prediction = {
  event: string;
  eta_minutes: number;
  confidence_0_1: number;
  rationale: string;
};

export type TimeRange = "15m" | "1h" | "6h" | "24h";

export type AiCardType = "summary" | "prediction";

export type Theme = "dark" | "light";

export type ToneMode = "tech" | "simple";

export type Settings = {
  geminiApiKey: string;
  refreshRate: number; // in milliseconds
  theme: Theme;
  toneMode: ToneMode;
};

export type ChartDataPoint = {
  time: string;
  value: number;
  label?: string;
};
