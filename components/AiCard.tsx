// AI Card component for predictions and summaries

"use client";

import { AiCardType } from "@/types";
import { getTranslations } from "@/lib/i18n";
import { useState } from "react";

interface AiCardProps {
  type: AiCardType;
  onGenerate?: () => void;
}

export default function AiCard({ type, onGenerate }: AiCardProps) {
  const t = getTranslations("en");
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const isPrediction = type === "prediction";
  const title = isPrediction ? t.ai.prediction : t.ai.summary;
  const icon = isPrediction ? "🔮" : "📝";

  const handleGenerate = async () => {
    setIsLoading(true);
    
    // Mock content for now (will be replaced with actual AI call)
    setTimeout(() => {
      if (isPrediction) {
        setContent(
          "Next Event: Trajectory trim burn\n" +
          "ETA: 42 minutes\n" +
          "Confidence: 73%\n\n" +
          "Velocity drift upward while fuel trending down with stable temps indicates scheduled trim."
        );
      } else {
        setContent(
          "Mission progressing nominally through Cruise phase. Spacecraft health excellent " +
          "with all systems operating within parameters. Distance to target decreasing steadily."
        );
      }
      setIsLoading(false);
    }, 1500);

    if (onGenerate) {
      onGenerate();
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur border border-purple-500/30 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-hidden="true">{icon}</span>
          <h3 className="text-lg font-bold text-purple-300">{title}</h3>
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 
                     text-white text-sm font-semibold rounded-lg transition-all duration-200 
                     touch-manipulation min-h-[44px] disabled:cursor-not-allowed"
          aria-label={isPrediction ? t.ai.runPrediction : t.ai.generateSummary}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              {t.ai.loading}
            </span>
          ) : (
            isPrediction ? t.ai.runPrediction : t.ai.generateSummary
          )}
        </button>
      </div>

      {content && !isLoading && (
        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
          <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
            {content}
          </p>
        </div>
      )}

      {!content && !isLoading && (
        <div className="text-center py-8 text-gray-500 text-sm">
          Click the button above to generate {isPrediction ? "a prediction" : "a summary"}
        </div>
      )}
    </div>
  );
}
