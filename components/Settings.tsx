// Settings component

"use client";

import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import { useState, useEffect } from "react";

export default function Settings() {
  const { settings, updateSettings, resetTelemetry } = useAppStore();
  const t = getTranslations("en");
  
  const [localApiKey, setLocalApiKey] = useState(settings.geminiApiKey);
  const [localRefreshRate, setLocalRefreshRate] = useState(settings.refreshRate);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalApiKey(settings.geminiApiKey);
    setLocalRefreshRate(settings.refreshRate);
  }, [settings]);

  const handleSave = () => {
    updateSettings({
      geminiApiKey: localApiKey,
      refreshRate: localRefreshRate
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetTelemetry();
    setShowConfirm(false);
  };

  const handleThemeToggle = () => {
    updateSettings({
      theme: settings.theme === "dark" ? "light" : "dark"
    });
  };

  const handleToneModeToggle = () => {
    updateSettings({
      toneMode: settings.toneMode === "tech" ? "simple" : "tech"
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold mb-2 text-gray-100">
          {t.settings.title}
        </h2>
        <p className="text-sm text-gray-400">
          Configure your mission tracker preferences
        </p>
      </div>

      {/* API Key Section */}
      <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6">
        <label className="block mb-3">
          <span className="text-sm font-semibold text-gray-300 mb-2 block">
            {t.settings.apiKey}
          </span>
          <input
            type="password"
            value={localApiKey}
            onChange={(e) => setLocalApiKey(e.target.value)}
            placeholder={t.settings.apiKeyPlaceholder}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl 
                       text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent transition-all
                       min-h-[48px]"
          />
          <p className="text-xs text-gray-500 mt-2">
            Get your API key from{" "}
            <a 
              href="https://makersuite.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Google AI Studio
            </a>
          </p>
        </label>
      </div>

      {/* Refresh Rate Section */}
      <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6">
        <label className="block mb-3">
          <span className="text-sm font-semibold text-gray-300 mb-2 block">
            {t.settings.refreshRate}
          </span>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1000"
              max="10000"
              step="1000"
              value={localRefreshRate}
              onChange={(e) => setLocalRefreshRate(Number(e.target.value))}
              className="flex-1 h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 
                         [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-blue-500 
                         [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <span className="text-lg font-bold text-blue-400 min-w-[80px] text-right">
              {localRefreshRate / 1000}s
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            How often to generate new telemetry data (1-10 seconds)
          </p>
        </label>
      </div>

      {/* Theme & Tone Section */}
      <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Theme Toggle */}
          <div>
            <span className="text-sm font-semibold text-gray-300 mb-3 block">
              {t.settings.theme}
            </span>
            <button
              onClick={handleThemeToggle}
              className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 
                         rounded-xl text-white font-medium transition-all duration-200 
                         touch-manipulation min-h-[48px] flex items-center justify-center gap-2"
            >
              <span>{settings.theme === "dark" ? "🌙" : "☀️"}</span>
              {settings.theme === "dark" ? t.settings.themeDark : t.settings.themeLight}
            </button>
          </div>

          {/* Tone Mode Toggle */}
          <div>
            <span className="text-sm font-semibold text-gray-300 mb-3 block">
              {t.settings.toneMode}
            </span>
            <button
              onClick={handleToneModeToggle}
              className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 
                         rounded-xl text-white font-medium transition-all duration-200 
                         touch-manipulation min-h-[48px] flex items-center justify-center gap-2"
            >
              <span>{settings.toneMode === "tech" ? "🔬" : "💬"}</span>
              {settings.toneMode === "tech" ? t.settings.toneTech : t.settings.toneSimple}
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleSave}
          className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white 
                     font-bold rounded-xl transition-all duration-200 touch-manipulation 
                     min-h-[56px] flex items-center justify-center gap-2"
        >
          {saved ? (
            <>
              <span>✓</span>
              Saved!
            </>
          ) : (
            <>
              <span>💾</span>
              {t.settings.save}
            </>
          )}
        </button>

        <button
          onClick={() => setShowConfirm(true)}
          className="flex-1 px-6 py-4 bg-red-900/50 hover:bg-red-900/70 border border-red-500/50 
                     text-red-400 font-bold rounded-xl transition-all duration-200 
                     touch-manipulation min-h-[56px] flex items-center justify-center gap-2"
        >
          <span>🔄</span>
          {t.settings.reset}
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-3">
              Confirm Reset
            </h3>
            <p className="text-gray-300 text-sm mb-6">
              {t.settings.resetConfirm}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white 
                           font-semibold rounded-xl transition-all duration-200 
                           touch-manipulation min-h-[48px]"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white 
                           font-semibold rounded-xl transition-all duration-200 
                           touch-manipulation min-h-[48px]"
              >
                {t.common.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <p className="text-blue-400 text-sm font-semibold mb-1">
              About the Data
            </p>
            <p className="text-blue-400/80 text-sm leading-relaxed">
              This mission tracker uses simulated telemetry data generated in real-time. 
              The data follows realistic patterns but does not represent an actual spacecraft mission. 
              Reset telemetry to restart the simulation from initial conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
