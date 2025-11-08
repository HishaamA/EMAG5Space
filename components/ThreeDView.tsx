// 3D Viewer component with NASA Eyes iframe embed

"use client";

import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import { useState } from "react";

export default function ThreeDView() {
  const { currentTelemetry } = useAppStore();
  const t = getTranslations("en");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    // Force iframe reload by changing key
    const iframe = document.querySelector('iframe[title="OSIRIS-REx 3D"]') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  // Calculate time since launch (mock - using current session time)
  const timeSinceLaunch = "145d 12h 34m";

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-2 text-gray-100">
          {t.viewer3d.title}
        </h2>
        <p className="text-sm text-gray-400">
          Interactive 3D visualization of the OSIRIS-REx spacecraft
        </p>
      </div>

      <div className="relative">
        {/* Mission Overlay */}
        <div className="absolute top-4 left-4 z-10 bg-gray-900/90 backdrop-blur border border-gray-700 rounded-xl px-4 py-3 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Phase:</span>
              <span className="text-sm font-bold text-blue-400">
                {currentTelemetry.phase}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Distance:</span>
              <span className="text-sm font-bold text-green-400">
                {currentTelemetry.distance_km.toFixed(0)} km
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{t.viewer3d.timeSinceLaunch}:</span>
              <span className="text-sm font-bold text-purple-400">
                {timeSinceLaunch}
              </span>
            </div>
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-900/50 backdrop-blur rounded-2xl">
            <div className="text-center">
              <div className="text-4xl mb-4 animate-pulse">🌌</div>
              <p className="text-gray-300">{t.viewer3d.loading}</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-900/90 backdrop-blur rounded-2xl">
            <div className="text-center px-4">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="text-gray-300 mb-4">{t.viewer3d.error}</p>
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold 
                           rounded-xl transition-all duration-200 touch-manipulation min-h-[48px]"
              >
                {t.viewer3d.retry}
              </button>
            </div>
          </div>
        )}

        {/* 3D Iframe */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
          <iframe
            title="OSIRIS-REx 3D"
            src="https://eyes.nasa.gov/apps/solar-system/#/sc_osiris_rex?embed=true&lighting=flood"
            className="w-full aspect-video"
            loading="lazy"
            allow="fullscreen"
            onLoad={handleLoad}
            onError={handleError}
            style={{ border: "none" }}
          />
        </div>

        {/* Controls Info */}
        <div className="mt-4 bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">
            Controls
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-400">
            <div>
              <span className="font-semibold text-gray-300">Rotate:</span> Left click + drag
            </div>
            <div>
              <span className="font-semibold text-gray-300">Zoom:</span> Scroll wheel
            </div>
            <div>
              <span className="font-semibold text-gray-300">Pan:</span> Right click + drag
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
