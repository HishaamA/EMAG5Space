// Telemetry data generator with seeded RNG and ring buffer

import { Telemetry, MissionPhase } from "@/types";

// Seeded RNG for repeatability
class SeededRandom {
  private seed: number;

  constructor(seed: number = 42) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  setSeed(seed: number): void {
    this.seed = seed;
  }
}

const rng = new SeededRandom();

// Initial telemetry state
const initialState: Telemetry = {
  t: Date.now(),
  distance_km: 500000,
  velocity_kms: 15.5,
  fuel_pct: 100,
  bus_temp_c: 18,
  battery_pct: 98,
  comms_latency_ms: 450,
  phase: "Launch"
};

// Determine mission phase based on telemetry
function determineMissionPhase(telemetry: Telemetry): MissionPhase {
  const { fuel_pct, distance_km, velocity_kms } = telemetry;
  
  if (fuel_pct > 95) return "Launch";
  if (distance_km > 300000) return "Cruise";
  if (distance_km > 50000) return "Approach";
  if (distance_km > 1000) return "Proximity Ops";
  return "Surface Ops";
}

// Simple noise function for realistic variations
function noise(seed: number): number {
  return (Math.sin(Date.now() / seed) + 1) / 2;
}

// Command modifiers (applied by control panel)
let commandModifiers = {
  velocityModifier: 0,
  fuelModifier: 0,
  tempModifier: 0,
  batteryModifier: 0,
  latencyModifier: 0,
  lastCommand: Date.now()
};

// Apply spacecraft command
export function applyCommand(command: any): void {
  const now = Date.now();
  
  switch (command.type) {
    case "thruster":
      if (command.direction === "forward") {
        commandModifiers.velocityModifier = 2.0; // Increase velocity
        commandModifiers.fuelModifier = -0.5; // Burn more fuel
        commandModifiers.tempModifier = 5; // Heat up
      } else if (command.direction === "reverse") {
        commandModifiers.velocityModifier = -1.5; // Decrease velocity
        commandModifiers.fuelModifier = -0.4;
        commandModifiers.tempModifier = 4;
      } else if (command.direction === "lateral") {
        commandModifiers.velocityModifier = 0.3; // Minor adjust
        commandModifiers.fuelModifier = -0.2;
        commandModifiers.tempModifier = 2;
      }
      break;
      
    case "maneuver":
      if (command.maneuverType === "correction") {
        commandModifiers.velocityModifier = 0.5;
        commandModifiers.fuelModifier = -0.3;
        commandModifiers.tempModifier = 3;
      } else if (command.maneuverType === "brake") {
        commandModifiers.velocityModifier = -2.5;
        commandModifiers.fuelModifier = -0.6;
        commandModifiers.tempModifier = 6;
      } else if (command.maneuverType === "accelerate") {
        commandModifiers.velocityModifier = 3.0;
        commandModifiers.fuelModifier = -0.8;
        commandModifiers.tempModifier = 8;
      }
      break;
      
    case "system":
      if (command.system === "power") {
        commandModifiers.batteryModifier = 2.0; // Boost battery
      } else if (command.system === "thermal") {
        commandModifiers.tempModifier = -10; // Cool down
      } else if (command.system === "comms") {
        commandModifiers.latencyModifier = -150; // Reduce latency
      }
      break;
      
    case "emergency":
      // Emergency stabilization
      commandModifiers.velocityModifier = -1.0;
      commandModifiers.tempModifier = -5;
      commandModifiers.batteryModifier = 1.0;
      commandModifiers.latencyModifier = -100;
      break;
  }
  
  commandModifiers.lastCommand = now;
  
  // Decay modifiers over time (10 seconds)
  setTimeout(() => {
    commandModifiers.velocityModifier *= 0.5;
    commandModifiers.fuelModifier *= 0.5;
    commandModifiers.tempModifier *= 0.5;
    commandModifiers.batteryModifier *= 0.5;
    commandModifiers.latencyModifier *= 0.5;
  }, 10000);
}

// Generate next telemetry tick
export function tick(prev: Telemetry): Telemetry {
  const drift = 1 + (rng.next() - 0.5) * 0.002;
  
  // Apply command modifiers if recent
  const timeSinceCommand = Date.now() - commandModifiers.lastCommand;
  const commandDecay = Math.max(0, 1 - (timeSinceCommand / 30000)); // Decay over 30s
  
  // Fuel decays slowly over time + command effects
  const baseFuelDecay = 0.0008;
  const commandFuelEffect = commandModifiers.fuelModifier * commandDecay;
  const fuelDecay = Math.max(prev.fuel_pct - baseFuelDecay + (commandFuelEffect * 0.01), 8);
  
  // Distance decreases as we approach (with some variation)
  const distanceChange = prev.velocity_kms * 1.2 * drift;
  const newDistance = Math.max(100, prev.distance_km - distanceChange);
  
  // Velocity varies slightly + command effects
  const baseVelocityChange = (rng.next() - 0.5) * 0.05;
  const commandVelocityEffect = commandModifiers.velocityModifier * commandDecay * 0.1;
  const newVelocity = Math.max(0.1, Math.min(35, prev.velocity_kms + baseVelocityChange + commandVelocityEffect));
  
  // Temperature fluctuates based on operations + command effects
  const baseTempChange = (rng.next() - 0.5) * 0.3;
  const commandTempEffect = commandModifiers.tempModifier * commandDecay * 0.1;
  const newTemp = Math.max(-20, Math.min(40, prev.bus_temp_c + baseTempChange + commandTempEffect));
  
  // Battery has slight ripple + command effects
  const baseBatteryChange = (rng.next() - 0.5) * 0.08;
  const commandBatteryEffect = commandModifiers.batteryModifier * commandDecay * 0.1;
  const newBattery = Math.min(100, Math.max(95, prev.battery_pct + baseBatteryChange + commandBatteryEffect));
  
  // Comms latency has spikes + command effects
  const latencyBase = 200 + 200 * noise(5000);
  const latencySpike = rng.next() * 100;
  const commandLatencyEffect = commandModifiers.latencyModifier * commandDecay;
  const newLatency = Math.max(50, latencyBase + latencySpike + commandLatencyEffect);
  
  const newTelemetry: Telemetry = {
    t: Date.now(),
    distance_km: newDistance,
    velocity_kms: newVelocity,
    fuel_pct: fuelDecay,
    bus_temp_c: newTemp,
    battery_pct: newBattery,
    comms_latency_ms: newLatency,
    phase: prev.phase
  };
  
  // Update phase based on current state
  newTelemetry.phase = determineMissionPhase(newTelemetry);
  
  return newTelemetry;
}

// Ring buffer for telemetry history (keeps last 24 hours)
export class TelemetryRingBuffer {
  private buffer: Telemetry[] = [];
  private maxSize: number;
  private currentIndex: number = 0;

  constructor(maxSize: number = 17280) { // 24h at 5s intervals = 17,280 points
    this.maxSize = maxSize;
    this.buffer = [initialState];
  }

  push(telemetry: Telemetry): void {
    if (this.buffer.length < this.maxSize) {
      this.buffer.push(telemetry);
    } else {
      this.buffer[this.currentIndex] = telemetry;
      this.currentIndex = (this.currentIndex + 1) % this.maxSize;
    }
  }

  getAll(): Telemetry[] {
    if (this.buffer.length < this.maxSize) {
      return [...this.buffer];
    }
    
    // Return in chronological order
    return [
      ...this.buffer.slice(this.currentIndex),
      ...this.buffer.slice(0, this.currentIndex)
    ];
  }

  getLast(count: number): Telemetry[] {
    const all = this.getAll();
    return all.slice(Math.max(0, all.length - count));
  }

  getRange(startTime: number, endTime: number): Telemetry[] {
    return this.getAll().filter(t => t.t >= startTime && t.t <= endTime);
  }

  getLastMinutes(minutes: number): Telemetry[] {
    const now = Date.now();
    const startTime = now - minutes * 60 * 1000;
    return this.getRange(startTime, now);
  }

  clear(): void {
    this.buffer = [initialState];
    this.currentIndex = 0;
  }

  size(): number {
    return this.buffer.length;
  }

  getLatest(): Telemetry {
    const all = this.getAll();
    return all[all.length - 1] || initialState;
  }
}

// Export utilities
export function resetSeed(seed: number = 42): void {
  rng.setSeed(seed);
}

export function getInitialTelemetry(): Telemetry {
  return { ...initialState, t: Date.now() };
}

// CSV export utility
export function exportToCsv(telemetry: Telemetry[]): string {
  const headers = [
    "Timestamp",
    "Distance (km)",
    "Velocity (km/s)",
    "Fuel (%)",
    "Bus Temp (°C)",
    "Battery (%)",
    "Comms Latency (ms)",
    "Phase"
  ];

  const rows = telemetry.map(t => [
    new Date(t.t).toISOString(),
    t.distance_km.toFixed(2),
    t.velocity_kms.toFixed(3),
    t.fuel_pct.toFixed(2),
    t.bus_temp_c.toFixed(2),
    t.battery_pct.toFixed(2),
    t.comms_latency_ms.toFixed(2),
    t.phase
  ]);

  return [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");
}

// Download CSV helper
export function downloadCsv(telemetry: Telemetry[], filename: string = "telemetry.csv"): void {
  const csv = exportToCsv(telemetry);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
