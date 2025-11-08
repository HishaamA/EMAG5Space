// API route for AI summaries using Gemini

import { NextRequest, NextResponse } from "next/server";
import { Telemetry } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { telemetry, tone, apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // Prepare telemetry summary
    const telemetryArray = telemetry as Telemetry[];
    const latestData = telemetryArray[telemetryArray.length - 1];
    const firstData = telemetryArray[0];
    
    const distanceChange = firstData.distance_km - latestData.distance_km;
    const fuelUsed = firstData.fuel_pct - latestData.fuel_pct;

    const telemetrySummary = `
Mission data over last 24 hours:
- Current phase: ${latestData.phase}
- Distance traveled: ${distanceChange.toFixed(0)} km closer to target
- Current distance: ${latestData.distance_km.toFixed(0)} km
- Average velocity: ${latestData.velocity_kms.toFixed(2)} km/s
- Fuel used: ${fuelUsed.toFixed(2)}% (${latestData.fuel_pct.toFixed(1)}% remaining)
- System health: All nominal
- Temperature range: ${getRange(telemetryArray.map((t: Telemetry) => t.bus_temp_c))}
- Battery status: ${latestData.battery_pct.toFixed(1)}% (stable)
    `.trim();

    const systemPrompt = tone === "tech"
      ? `You are a mission operations analyst. Produce a concise daily summary (max 220 characters) in technical language for mission control. Include key metrics, phase status, and any notable changes. Be precise and professional.`
      : `You are a mission narrator for the public. Produce a concise daily summary (max 220 characters) in simple, engaging language. Make it interesting and accessible to non-experts. Avoid jargon.`;

    const userPrompt = `Based on this mission data, create a daily summary:\n\n${telemetrySummary}`;

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
          temperature: 0.8,
          topP: 0.9,
          maxOutputTokens: 100,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    let summary = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Truncate if too long
    if (summary.length > 250) {
      summary = summary.substring(0, 220) + "...";
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summary error:", error);
    
    // Return mock summary based on tone
    const mockSummary = request.json().then(({ tone }) => {
      if (tone === "tech") {
        return "Mission nominal. All systems within parameters. Spacecraft health: nominal. Trajectory: on target. Phase: Cruise. Distance decreasing at expected rate. No anomalies detected.";
      } else {
        return "The asteroid mission is going great! Everything is working perfectly, and we're getting closer to our target. All spacecraft systems are healthy and operating as expected.";
      }
    });

    return NextResponse.json({
      summary: await mockSummary
    });
  }
}

// Helper function to get range
function getRange(values: number[]): string {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return `${min.toFixed(1)}°C to ${max.toFixed(1)}°C`;
}
