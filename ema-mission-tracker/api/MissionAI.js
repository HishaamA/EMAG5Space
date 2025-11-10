import { OPENROUTER_API_KEY } from '@env';
import { CONFIG } from '../config/appConfig';

// OpenRouter API endpoint
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-2.5-flash-lite';

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

    case 'image_analysis':
      return `You are an expert astrogeologist analyzing images from the EMA lander on Asteroid 269 Justitia, a large M-type asteroid in the main asteroid belt.

Image Context: ${telemetry.description}
Location: ${telemetry.location} (${telemetry.coordinates})
Visual Features: ${telemetry.imagePrompt}

As an astrogeologist, provide a detailed analysis covering:
1. Key geological features visible in this terrain
2. What these features tell us about the asteroid's formation and history
3. Potential scientific significance of this location
4. Recommendations for follow-up observations or sample collection

Keep your analysis professional, scientifically rigorous, and concise (3-4 paragraphs).`;

    case 'data_analysis':
      return `You are a space mission scientist analyzing data from the EMA lander on Asteroid 269 Justitia.

Sample Information:
- Sample ID: ${telemetry.sampleId}
- Location: ${telemetry.location}
- Data Type: ${telemetry.type}
- Measurements: ${JSON.stringify(telemetry.data)}
- Unit: ${telemetry.unit}

Analyze this data and provide:
1. What these measurements reveal about the asteroid's composition/properties
2. Is this a significant or unusual finding? Why?
3. How does this compare to expected values for M-type asteroids?
4. What implications does this have for asteroid mining or planetary science?

Provide a clear, scientifically accurate analysis (2-3 paragraphs).`;

    case 'landing_site_analysis':
      return `You are a mission engineer analyzing landing sites for the Asteroid 269 Justitia Landing Mission on Asteroid 269 Justitia.

The user has selected: ${telemetry.name}
Location: ${telemetry.coordinates}

Site Characteristics:
- Terrain: ${telemetry.characteristics.terrain}
- Slope: ${telemetry.slope}
- Difficulty: ${telemetry.difficulty}
- Scientific Interest: ${telemetry.scientificInterest}
- Geology: ${telemetry.characteristics.geology}
- Resources: ${telemetry.characteristics.resources}
- Hazards: ${telemetry.characteristics.hazards}
- Opportunities: ${telemetry.characteristics.opportunities}
- Accessibility: ${telemetry.characteristics.accessibility}
- Solar Exposure: ${telemetry.characteristics.solarExposure}
- Communication: ${telemetry.characteristics.communication}

As a mission engineer, provide a comprehensive landing site analysis covering:

**RISKS**: Analyze the landing hazards and operational challenges at this site. Consider terrain difficulty, slope angle, surface stability, and mission safety.

**BENEFITS**: Evaluate the scientific value and operational advantages. What makes this site worth considering despite the risks?

**RECOMMENDATION**: Should the mission proceed with this site, proceed with extra caution, or select an alternative? Provide your expert recommendation with reasoning.

Keep your analysis professional and actionable (2-3 paragraphs). Focus on practical mission planning considerations.`;

    case 'mission_chat':
      // Build comprehensive context-aware chat prompt
      const missionContext = telemetry ? `
Current Mission Status (Live Telemetry):
- Spacecraft Status: ${telemetry.status_flag || 'Nominal'}
- Distance from Earth: ${telemetry.distance_from_earth_km ? telemetry.distance_from_earth_km.toLocaleString() + ' km' : 'N/A'}
- Speed: ${telemetry.speed_kph ? telemetry.speed_kph.toLocaleString() + ' km/h' : 'N/A'}
- Battery Level: ${telemetry.battery_percent || 'N/A'}%
- System Temperature: ${telemetry.system_temp_c || 'N/A'}°C
- Signal Strength: ${telemetry.signal_strength || 'N/A'}` : '';

      const conversationHistory = history && history.length > 0 
        ? history.map(msg => `${msg.role}: ${msg.content}`).join('\n')
        : '';

      return `You are ARIA (Asteroid Research Intelligence Assistant), an advanced AI mission analyst for the EMA (Envisaged Mission to Asteroid) mission to Asteroid 269 Justitia.

CORE CAPABILITIES:
You are not just a chatbot - you are a sophisticated AI system with deep expertise in:
- Spacecraft systems engineering and telemetry analysis
- Asteroid science (composition, geology, formation)
- Mission planning and risk assessment
- Resource identification and mining feasibility
- Orbital mechanics and trajectory optimization
- Planetary defense and NEO characterization
- Spectroscopy and remote sensing data interpretation

MISSION CRITICAL INFORMATION:
Target: Asteroid 269 Justitia
- Type: M-type metallic asteroid (primitive body from early solar system)
- Location: Main asteroid belt between Mars and Jupiter
- Diameter: ~100 km (one of the largest main-belt asteroids)
- Composition: Metal-rich (iron, nickel, platinum-group metals), with regolith surface
- Scientific Value: Pristine material from solar system formation; potential mining target
- Rotation Period: ~8.17 hours
- Surface Gravity: ~0.03 m/s² (very low, challenges for landing)

Mission Profile:
- Launch: October 2028 from Kourou, French Guiana
- Trajectory: Earth gravity assist → Mars flyby → Main belt insertion
- Arrival: November 2032 (orbital insertion)
- Duration: 2-year primary mission + extended mission
- Objectives: 
  1. Complete surface mapping and composition analysis
  2. Identify valuable mineral deposits (PGMs, rare earth elements)
  3. Select and characterize landing sites
  4. Assess resource extraction feasibility
  5. Study asteroid structure and formation history

Landing Sites (4 candidates):
- Alpha Site: Safe terrain, low scientific value, easy access
- Beta Site: Moderate difficulty, high mineral deposits, balanced choice
- Gamma Site: Challenging, crater rim, highest scientific interest
- Delta Site: Polar region, extreme difficulty, potential water ice

${missionContext}

ANALYTICAL CAPABILITIES:
When users ask questions, you can:
1. Analyze trends in telemetry data and predict issues
2. Assess landing site risks vs. scientific/economic benefits
3. Explain complex space concepts in accessible terms
4. Provide evidence-based recommendations for mission decisions
5. Calculate mission parameters (delta-v, communication delay, etc.)
6. Interpret scientific measurements and their implications
7. Identify resource extraction opportunities

CURRENT CONSTRAINTS:
- Communication delay: ~${telemetry?.distance_from_earth_km ? Math.round(telemetry.distance_from_earth_km / 299792 / 60) : '7-15'} minutes one-way
- Power limitations: Solar panels only, battery backup critical
- Low gravity: Makes landing and surface operations challenging
- Extreme temperature swings: -180°C to +120°C
- Limited fuel: Maneuvers must be carefully planned

YOUR COMMUNICATION STYLE:
- Professional but approachable - balance technical accuracy with clarity
- Proactive - offer insights beyond what's directly asked
- Evidence-based - reference mission data and scientific principles
- Honest about uncertainties - acknowledge unknowns in space exploration
- Mission-focused - prioritize crew safety and mission success
- Enthusiastic about discoveries and scientific breakthroughs

${conversationHistory ? `CONVERSATION CONTEXT:\n${conversationHistory}\n` : ''}

USER QUERY: ${telemetry.userMessage}

INSTRUCTIONS:
Respond as ARIA with your full analytical capabilities. If the question relates to:
- Current telemetry: Analyze the data, identify trends, flag concerns
- Landing sites: Provide comprehensive risk/benefit analysis
- Science questions: Give detailed but accessible explanations
- Mission planning: Offer strategic recommendations with reasoning
- Technical issues: Diagnose problems and suggest solutions

Keep responses concise (2-4 paragraphs) but information-dense. Use bullet points for complex information. Show your analytical depth.`;

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

    // Make the API call to OpenRouter
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/HishaamA/g5space',
        'X-Title': 'EMA Mission Tracker',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const json = await response.json();
    
    // Extract the AI's response text from OpenRouter format
    const responseText = json.choices?.[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('Invalid API response structure');
    }

    console.log('[AI Service] Raw response:', responseText);

    // Parse based on prompt type
    if (promptType === 'status_update') {
      return { responseText: responseText.trim() };
    } else if (promptType === 'image_analysis' || promptType === 'data_analysis' || promptType === 'landing_site_analysis' || promptType === 'mission_chat') {
      // Return plain text analysis for science data, landing sites, and chat
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
