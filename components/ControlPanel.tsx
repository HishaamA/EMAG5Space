// Manual Control Panel for spacecraft simulation

"use client";

import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import { useState } from "react";

export default function ControlPanel() {
  const { currentTelemetry } = useAppStore();
  const t = getTranslations("en");
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastCommand, setLastCommand] = useState("");

  const executeCommand = async (command: string, callback: () => void) => {
    setIsExecuting(true);
    setLastCommand(command);
    
    // Simulate command execution delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    callback();
    
    setIsExecuting(false);
    setTimeout(() => setLastCommand(""), 3000);
  };

  const handleThrusterBurn = (direction: "forward" | "reverse" | "lateral") => {
    executeCommand(`${direction.toUpperCase()} THRUSTER BURN`, () => {
      // This will be handled by the store
      window.dispatchEvent(new CustomEvent("spacecraft-command", {
        detail: { type: "thruster", direction, magnitude: 0.5 }
      }));
    });
  };

  const handleManeuver = (type: "correction" | "brake" | "accelerate") => {
    executeCommand(`${type.toUpperCase()} MANEUVER`, () => {
      window.dispatchEvent(new CustomEvent("spacecraft-command", {
        detail: { type: "maneuver", maneuverType: type }
      }));
    });
  };

  const handleSystemAdjust = (system: "power" | "thermal" | "comms") => {
    executeCommand(`ADJUST ${system.toUpperCase()} SYSTEM`, () => {
      window.dispatchEvent(new CustomEvent("spacecraft-command", {
        detail: { type: "system", system }
      }));
    });
  };

  const handleEmergency = () => {
    executeCommand("EMERGENCY PROTOCOL", () => {
      window.dispatchEvent(new CustomEvent("spacecraft-command", {
        detail: { type: "emergency" }
      }));
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2 text-gray-100">
          🎮 Spacecraft Control Panel
        </h2>
        <p className="text-sm text-gray-400">
          Manual control interface for spacecraft operations
        </p>
      </div>

      {/* Status Display */}
      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur border border-blue-500/30 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-blue-300 mb-3 flex items-center gap-2">
          <span>📡</span> Current Status
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-900/50 rounded-lg p-3">
            <p className="text-xs text-gray-400">Phase</p>
            <p className="text-lg font-bold text-blue-400">{currentTelemetry.phase}</p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3">
            <p className="text-xs text-gray-400">Velocity</p>
            <p className="text-lg font-bold text-green-400">{currentTelemetry.velocity_kms.toFixed(2)} km/s</p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3">
            <p className="text-xs text-gray-400">Fuel</p>
            <p className="text-lg font-bold text-yellow-400">{currentTelemetry.fuel_pct.toFixed(1)}%</p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3">
            <p className="text-xs text-gray-400">Distance</p>
            <p className="text-lg font-bold text-purple-400">{(currentTelemetry.distance_km / 1000).toFixed(0)}K km</p>
          </div>
        </div>
      </div>

      {/* Command Feedback */}
      {lastCommand && (
        <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-4 animate-pulse">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <div>
              <p className="text-green-400 font-semibold">Command Executed</p>
              <p className="text-green-300 text-sm">{lastCommand}</p>
            </div>
          </div>
        </div>
      )}

      {/* Thruster Controls */}
      <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <span>🚀</span> Thruster Control
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleThrusterBurn("forward")}
            disabled={isExecuting}
            className="px-4 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 
                       text-white font-semibold rounded-xl transition-all duration-200 
                       touch-manipulation min-h-[60px] disabled:cursor-not-allowed
                       flex flex-col items-center justify-center gap-1"
          >
            <span className="text-2xl">⬆️</span>
            <span className="text-xs">Forward Burn</span>
            <span className="text-xs text-blue-200">+Velocity / -Fuel</span>
          </button>
          
          <button
            onClick={() => handleThrusterBurn("reverse")}
            disabled={isExecuting}
            className="px-4 py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-700 
                       text-white font-semibold rounded-xl transition-all duration-200 
                       touch-manipulation min-h-[60px] disabled:cursor-not-allowed
                       flex flex-col items-center justify-center gap-1"
          >
            <span className="text-2xl">⬇️</span>
            <span className="text-xs">Reverse Burn</span>
            <span className="text-xs text-orange-200">-Velocity / -Fuel</span>
          </button>
          
          <button
            onClick={() => handleThrusterBurn("lateral")}
            disabled={isExecuting}
            className="px-4 py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 
                       text-white font-semibold rounded-xl transition-all duration-200 
                       touch-manipulation min-h-[60px] disabled:cursor-not-allowed
                       flex flex-col items-center justify-center gap-1"
          >
            <span className="text-2xl">↔️</span>
            <span className="text-xs">Lateral Burn</span>
            <span className="text-xs text-purple-200">Course Adjust</span>
          </button>
        </div>
      </div>

      {/* Maneuver Controls */}
      <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <span>🛰️</span> Maneuver Commands
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleManeuver("correction")}
            disabled={isExecuting}
            className="px-4 py-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 
                       text-white font-semibold rounded-xl transition-all duration-200 
                       touch-manipulation min-h-[60px] disabled:cursor-not-allowed
                       flex flex-col items-center justify-center gap-1"
          >
            <span className="text-2xl">🎯</span>
            <span className="text-xs">Trajectory Correction</span>
            <span className="text-xs text-cyan-200">Minor Adjust</span>
          </button>
          
          <button
            onClick={() => handleManeuver("brake")}
            disabled={isExecuting}
            className="px-4 py-4 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 
                       text-white font-semibold rounded-xl transition-all duration-200 
                       touch-manipulation min-h-[60px] disabled:cursor-not-allowed
                       flex flex-col items-center justify-center gap-1"
          >
            <span className="text-2xl">🛑</span>
            <span className="text-xs">Braking Maneuver</span>
            <span className="text-xs text-red-200">Decelerate</span>
          </button>
          
          <button
            onClick={() => handleManeuver("accelerate")}
            disabled={isExecuting}
            className="px-4 py-4 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 
                       text-white font-semibold rounded-xl transition-all duration-200 
                       touch-manipulation min-h-[60px] disabled:cursor-not-allowed
                       flex flex-col items-center justify-center gap-1"
          >
            <span className="text-2xl">⚡</span>
            <span className="text-xs">Acceleration Burn</span>
            <span className="text-xs text-green-200">Speed Up</span>
          </button>
        </div>
      </div>

      {/* System Controls */}
      <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <span>⚙️</span> System Adjustments
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleSystemAdjust("power")}
            disabled={isExecuting}
            className="px-4 py-4 bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-700 
                       text-white font-semibold rounded-xl transition-all duration-200 
                       touch-manipulation min-h-[60px] disabled:cursor-not-allowed
                       flex flex-col items-center justify-center gap-1"
          >
            <span className="text-2xl">🔋</span>
            <span className="text-xs">Power System</span>
            <span className="text-xs text-yellow-200">Boost Battery</span>
          </button>
          
          <button
            onClick={() => handleSystemAdjust("thermal")}
            disabled={isExecuting}
            className="px-4 py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-700 
                       text-white font-semibold rounded-xl transition-all duration-200 
                       touch-manipulation min-h-[60px] disabled:cursor-not-allowed
                       flex flex-col items-center justify-center gap-1"
          >
            <span className="text-2xl">🌡️</span>
            <span className="text-xs">Thermal System</span>
            <span className="text-xs text-orange-200">Regulate Temp</span>
          </button>
          
          <button
            onClick={() => handleSystemAdjust("comms")}
            disabled={isExecuting}
            className="px-4 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 
                       text-white font-semibold rounded-xl transition-all duration-200 
                       touch-manipulation min-h-[60px] disabled:cursor-not-allowed
                       flex flex-col items-center justify-center gap-1"
          >
            <span className="text-2xl">📡</span>
            <span className="text-xs">Comms System</span>
            <span className="text-xs text-indigo-200">Reduce Latency</span>
          </button>
        </div>
      </div>

      {/* Emergency Controls */}
      <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-red-400 mb-4 flex items-center gap-2">
          <span>🚨</span> Emergency Controls
        </h3>
        <button
          onClick={handleEmergency}
          disabled={isExecuting}
          className="w-full px-6 py-4 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 
                     text-white font-bold rounded-xl transition-all duration-200 
                     touch-manipulation min-h-[60px] disabled:cursor-not-allowed
                     flex items-center justify-center gap-3"
        >
          <span className="text-2xl">⚠️</span>
          <div className="text-left">
            <div>Emergency Protocol</div>
            <div className="text-xs font-normal text-red-200">Full system reset & stabilization</div>
          </div>
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <p className="text-blue-400 text-sm font-semibold mb-1">
              Control Information
            </p>
            <p className="text-blue-400/80 text-sm leading-relaxed">
              Each command affects telemetry in real-time. Thruster burns consume fuel and change velocity. 
              System adjustments optimize specific parameters. Monitor the Dashboard to see effects immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
