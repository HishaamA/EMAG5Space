// API route for AI predictions using Gemini

import { NextRequest, NextResponse } from "next/server";
import { Telemetry, Prediction } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { telemetry, apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // Prepare telemetry summary for AI
    const latestData = telemetry[telemetry.length - 1] as Telemetry;
    const telemetryArray = telemetry as Telemetry[];
    const telemetrySummary = `
Current telemetry snapshot:
- Distance to target: ${latestData.distance_km.toFixed(0)} km
- Velocity: ${latestData.velocity_kms.toFixed(2)} km/s
- Fuel remaining: ${latestData.fuel_pct.toFixed(1)}%
- Bus temperature: ${latestData.bus_temp_c.toFixed(1)}°C
- Battery: ${latestData.battery_pct.toFixed(1)}%
- Comms latency: ${latestData.comms_latency_ms.toFixed(0)} ms
- Current phase: ${latestData.phase}

Recent trends (last 15 minutes):
- Velocity trend: ${calculateTrend(telemetryArray.map((t: Telemetry) => t.velocity_kms))}
- Fuel consumption rate: ${calculateConsumptionRate(telemetryArray.map((t: Telemetry) => t.fuel_pct))}% per hour
- Temperature stability: ${calculateStability(telemetryArray.map((t: Telemetry) => t.bus_temp_c))}
    `.trim();

    const systemPrompt = `You are a spacecraft operations analyst. Predict the next mission event (maneuver or phase change) within the next 6 hours based on trends in velocity, distance, fuel, bus temperature, and comms latency. 

Output ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "event": "name of the predicted event",
  "eta_minutes": number (estimated time in minutes),
  "confidence_0_1": number (between 0 and 1),
  "rationale": "brief technical explanation"
}`;

    const userPrompt = `Based on this telemetry data, predict the next mission event:\n\n${telemetrySummary}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Parse JSON from response
    let prediction: Prediction;
    try {
      // Remove markdown code blocks if present
      const cleanText = generatedText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      prediction = JSON.parse(cleanText);
    } catch {
      // Fallback to mock if parsing fails
      prediction = {
        event: "Trajectory correction maneuver",
        eta_minutes: 45,
        confidence_0_1: 0.65,
        rationale: "Current trajectory parameters suggest a minor correction is needed based on velocity trends."
      };
    }

    return NextResponse.json({ prediction });
  } catch (error) {
    console.error("Prediction error:", error);
    
    // Return mock prediction on error
    return NextResponse.json({
      prediction: {
        event: "Trajectory trim burn",
        eta_minutes: 42,
        confidence_0_1: 0.73,
        rationale: "Velocity drift upward while fuel trending down with stable temps indicates scheduled trim."
      }
    });
  }
}

// Helper functions
function calculateTrend(values: number[]): string {
  if (values.length < 2) return "stable";
  const first = values.slice(0, Math.floor(values.length / 3)).reduce((a, b) => a + b, 0) / Math.floor(values.length / 3);
  const last = values.slice(-Math.floor(values.length / 3)).reduce((a, b) => a + b, 0) / Math.floor(values.length / 3);
  const change = ((last - first) / first) * 100;
  
  if (Math.abs(change) < 1) return "stable";
  return change > 0 ? `increasing (${change.toFixed(1)}%)` : `decreasing (${Math.abs(change).toFixed(1)}%)`;
}

function calculateConsumptionRate(values: number[]): string {
  if (values.length < 2) return "0.00";
  const first = values[0];
  const last = values[values.length - 1];
  const timeHours = (values.length * 5) / 3600; // 5 second intervals
  const consumption = (first - last) / timeHours;
  return consumption.toFixed(2);
}

function calculateStability(values: number[]): string {
  if (values.length < 2) return "stable";
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  if (stdDev < 1) return "very stable";
  if (stdDev < 3) return "stable";
  return "variable";
}
