import { GOOGLE_API_KEY } from '@env';
import { CONFIG } from '../config/appConfig';

// Gemini API endpoint
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY}`;

/**
 * Builds the appropriate prompt based on the AI mode
 */
const buildPrompt = (promptType, telemetry, history) => {
  switch (promptType) {
    case 'status_update':
      return `You are a Mission Communications Officer for the EMA (Envisaged Mission to Asteroid) spacecraft. Write a concise, professional public status update (1-2 sentences) based only on this telemetry packet. Be optimistic but technical.

Telemetry: ${JSON.stringify(telemetry)}

Provide a brief status update suitable for mission control.`;

    case 'anomaly_detection':
      return `You are an AI anomaly detection system for the EMA spacecraft. 

Operational rules:
- system_temp_c must be between 0°C and 40°C (nominal range)
- signal_strength must be "Strong"
- battery_percent should be above 60%
- status_flag should be "Nominal"

Analyze this telemetry packet: ${JSON.stringify(telemetry)}

Respond ONLY with a valid JSON object in exactly this format (no additional text):
{"is_anomaly": true or false, "reason": "Your technical analysis", "priority": "High" or "Medium" or "Low" or "None"}`;

    case 'risk_assessment':
      return `You are an AI risk assessment system for the EMA spacecraft mission.

Analyze this telemetry history (last ${history.length} packets):
${JSON.stringify(history)}

Your task:
1. Identify any concerning TRENDS (not just current values):
   - Battery drain rate (% per minute)
   - Temperature trends (rising/falling)
   - Signal strength degradation
   - Speed anomalies
2. Calculate time to critical state if trends continue
3. Provide actionable recommendations

Respond ONLY with a valid JSON object in exactly this format (no additional text):
{"risk_level": "Critical" or "High" or "Medium" or "Low", "primary_concern": "Brief description of main risk", "time_to_critical": "e.g., '15 minutes' or 'N/A'", "recommendation": "Specific action to take"}`;

    default:
      return 'Invalid prompt type';
  }
};

/**
 * Calls the Gemini API to analyze telemetry data
 * @param {string} promptType - One of: 'status_update', 'anomaly_detection', 'risk_assessment'
 * @param {object} telemetryData - Current telemetry packet
 * @param {array} telemetryHistory - Array of recent telemetry packets
 * @returns {Promise<object>} - AI analysis result
 */
export const getAIAnalysis = async (promptType, telemetryData, telemetryHistory = []) => {
  try {
    console.log(`[AI Service] Running analysis: ${promptType}`);
    console.log('[AI Service] Telemetry:', telemetryData);

    // Build the prompt
    const prompt = buildPrompt(promptType, telemetryData, telemetryHistory);

    // Make the API call
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const json = await response.json();
    
    // Extract the AI's response text
    const responseText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error('Invalid API response structure');
    }

    console.log('[AI Service] Raw response:', responseText);

    // Parse based on prompt type
    if (promptType === 'status_update') {
      return { responseText: responseText.trim() };
    } else if (promptType === 'anomaly_detection' || promptType === 'risk_assessment') {
      // Try to parse JSON from the response
      try {
        // Sometimes the AI wraps JSON in markdown code blocks, so we need to extract it
        let jsonText = responseText.trim();
        
        // Remove markdown code block if present
        if (jsonText.startsWith('```json')) {
          jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        } else if (jsonText.startsWith('```')) {
          jsonText = jsonText.replace(/```\n?/g, '').trim();
        }
        
        const parsedData = JSON.parse(jsonText);
        console.log('[AI Service] Parsed JSON:', parsedData);
        return parsedData;
      } catch (parseError) {
        console.error('[AI Service] JSON parse error:', parseError);
        throw new Error(`Failed to parse AI response as JSON: ${parseError.message}`);
      }
    }

    return { responseText };

  } catch (error) {
    console.error('[AI Service] Error:', error);
    throw error;
  }
};
