// AI Panel component for predictions and summaries

"use client";

import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import { useState } from "react";
import { Prediction } from "@/types";

export default function AiPanel() {
  const { settings, getTelemetryForRange } = useAppStore();
  const t = getTranslations("en");
  
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [error, setError] = useState<string>("");

  const hasApiKey = settings.geminiApiKey && settings.geminiApiKey.length > 0;

  const handleRunPrediction = async () => {
    if (!hasApiKey) {
      setError(t.ai.noApiKey);
      return;
    }

    setIsLoadingPrediction(true);
    setError("");

    try {
      const telemetry = getTelemetryForRange("15m");
      
      // Call API route
      const response = await fetch("/api/ai/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          telemetry: telemetry.slice(-180), // Last 15 min
          apiKey: settings.geminiApiKey 
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate prediction");
      }

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (err) {
      setError(t.ai.error);
      // Fallback to mock data
      setPrediction({
        event: "Trajectory trim burn",
        eta_minutes: 42,
        confidence_0_1: 0.73,
        rationale: "Velocity drift upward while fuel trending down with stable temps indicates scheduled trim."
      });
    } finally {
      setIsLoadingPrediction(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!hasApiKey) {
      setError(t.ai.noApiKey);
      return;
    }

    setIsLoadingSummary(true);
    setError("");

    try {
      const telemetry = getTelemetryForRange("24h");
      
      // Call API route
      const response = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          telemetry: telemetry.slice(-1440), // Last 24h sampled
          tone: settings.toneMode,
          apiKey: settings.geminiApiKey 
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      setError(t.ai.error);
      // Fallback to mock data
      setSummary(
        settings.toneMode === "tech"
          ? "Mission nominal. All systems within parameters. Spacecraft health: nominal. Trajectory: on target. Phase: Cruise. Distance decreasing at expected rate. No anomalies detected."
          : "The asteroid mission is going great! Everything is working perfectly, and we're getting closer to our target. All spacecraft systems are healthy and operating as expected."
      );
    } finally {
      setIsLoadingSummary(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2 text-gray-100">
          {t.ai.title}
        </h2>
        <p className="text-sm text-gray-400">
          AI-powered mission analysis and predictions
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Prediction Card */}
      <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur border border-purple-500/30 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔮</span>
            <h3 className="text-lg font-bold text-purple-300">
              {t.ai.prediction}
            </h3>
          </div>
          
          <button
            onClick={handleRunPrediction}
            disabled={isLoadingPrediction || !hasApiKey}
            className="px-5 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 
                       text-white text-sm font-semibold rounded-xl transition-all duration-200 
                       touch-manipulation min-h-[48px] disabled:cursor-not-allowed"
          >
            {isLoadingPrediction ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                {t.ai.loading}
              </span>
            ) : (
              t.ai.runPrediction
            )}
          </button>
        </div>

        {prediction && !isLoadingPrediction && (
          <div className="space-y-3">
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-xs text-gray-400">{t.ai.event}:</span>
                  <p className="text-lg font-bold text-blue-400">{prediction.event}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">{t.ai.eta}:</span>
                  <p className="text-lg font-bold text-green-400">
                    {prediction.eta_minutes} {t.ai.minutes}
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <span className="text-xs text-gray-400 mb-2 block">{t.ai.confidence}:</span>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${prediction.confidence_0_1 * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-purple-400">
                    {(prediction.confidence_0_1 * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs text-gray-400 mb-2 block">{t.ai.rationale}:</span>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {prediction.rationale}
                </p>
              </div>
            </div>
          </div>
        )}

        {!prediction && !isLoadingPrediction && (
          <div className="text-center py-8 text-gray-500 text-sm">
            Click the button above to generate a prediction
          </div>
        )}
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur border border-blue-500/30 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <h3 className="text-lg font-bold text-blue-300">
              {t.ai.summary}
            </h3>
          </div>
          
          <button
            onClick={handleGenerateSummary}
            disabled={isLoadingSummary || !hasApiKey}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 
                       text-white text-sm font-semibold rounded-xl transition-all duration-200 
                       touch-manipulation min-h-[48px] disabled:cursor-not-allowed"
          >
            {isLoadingSummary ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                {t.ai.loading}
              </span>
            ) : (
              t.ai.generateSummary
            )}
          </button>
        </div>

        {summary && !isLoadingSummary && (
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
            <p className="text-sm text-gray-300 leading-relaxed">
              {summary}
            </p>
          </div>
        )}

        {!summary && !isLoadingSummary && (
          <div className="text-center py-8 text-gray-500 text-sm">
            Click the button above to generate a summary
          </div>
        )}
      </div>

      {/* API Key Warning */}
      {!hasApiKey && (
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-yellow-400 text-sm font-semibold mb-1">
                Gemini API Key Required
              </p>
              <p className="text-yellow-400/80 text-sm">
                To use AI features, please add your Gemini API key in the Settings tab.
                Without a key, mock responses will be shown.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
