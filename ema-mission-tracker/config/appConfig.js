// Configuration constants for EMA Mission Control Dashboard

export const CONFIG = {
  // Telemetry simulation settings
  TELEMETRY_INTERVAL_MS: 2000, // 2 seconds - how often new telemetry is generated
  ANOMALY_FREQUENCY: 15, // Every 15th telemetry packet will be anomalous (~30 seconds)
  
  // Telemetry history settings
  MAX_HISTORY_LENGTH: 10, // Keep last 10 telemetry packets for AI analysis
  
  // API settings
  API_TIMEOUT_MS: 10000, // 10 second timeout for API calls
};
