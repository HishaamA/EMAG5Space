import { CONFIG } from '../config/appConfig';

// Counter for anomaly injection
let telemetryCounter = 0;

// Persistent state for realistic telemetry trends
let baseDistance = 125000000; // Starting at ~125M km from Earth
let baseSpeed = 38500; // Base speed in km/h
let baseTemp = 20; // Base temperature
let baseBattery = 85; // Base battery level

// Data transmission tracking
let dataTransmitted = 75; // Starting at 75 MB
const totalDataCapacity = 500; // 500 MB total

// Activity log state
let activityLogEntries = [];
const activities = [
  'Deploying Solar Panels',
  'Analyzing Sample 01A',
  'Calibrating Spectrometer',
  'Imaging Surface Feature',
  'Collecting Temperature Data',
  'Adjusting Antenna Direction',
  'Running System Diagnostics',
  'Scanning for Water Ice',
  'Measuring Magnetic Field',
  'Processing Spectral Data',
  'Transmitting Data Packet',
  'Charging Battery Systems',
  'Monitoring Thermal Systems',
  'Analyzing Mineral Composition',
  'Capturing High-Res Images'
];

/**
 * Generates a new activity log entry
 */
const generateActivityLogEntry = () => {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  const activity = activities[Math.floor(Math.random() * activities.length)];
  
  return {
    timestamp: now.toISOString(),
    time: timeStr,
    message: activity
  };
};

/**
 * Gets the current data transmission status
 */
export const getDataLinkStatus = () => {
  // Increment data transmitted (slower rate during anomalies)
  const increment = telemetryCounter % CONFIG.ANOMALY_FREQUENCY === 0 ? 0.5 : 2.5;
  dataTransmitted = Math.min(totalDataCapacity, dataTransmitted + increment);
  
  return {
    transmitted: Math.floor(dataTransmitted),
    total: totalDataCapacity,
    percentage: Math.floor((dataTransmitted / totalDataCapacity) * 100),
    rate: increment * 2, // MB per update interval
  };
};

/**
 * Gets the activity log (last 10 entries)
 */
export const getActivityLog = () => {
  // Add a new activity every 3 telemetry updates
  if (telemetryCounter % 3 === 0) {
    activityLogEntries.push(generateActivityLogEntry());
    // Keep only last 10 entries
    if (activityLogEntries.length > 10) {
      activityLogEntries.shift();
    }
  }
  
  return [...activityLogEntries].reverse(); // Most recent first
};

/**
 * Generates mock telemetry data with realistic trends and periodic anomalies
 * Every ANOMALY_FREQUENCY calls, this will return anomalous data
 */
export const getMockTelemetry = () => {
  telemetryCounter++;
  
  const isAnomaly = telemetryCounter % CONFIG.ANOMALY_FREQUENCY === 0;
  
  // Realistic changes per tick (every 2 seconds)
  baseDistance += baseSpeed * (CONFIG.TELEMETRY_INTERVAL_MS / 3600000); // Convert km/h to distance traveled
  baseSpeed += (Math.random() - 0.5) * 10; // Very small speed variations
  baseTemp += (Math.random() - 0.5) * 2; // Slow temperature drift
  baseBattery -= 0.02; // Slow battery drain
  
  // Keep values in reasonable ranges
  baseSpeed = Math.max(37000, Math.min(40000, baseSpeed));
  baseTemp = Math.max(15, Math.min(30, baseTemp));
  baseBattery = Math.max(60, Math.min(100, baseBattery));
  
  if (isAnomaly) {
    // Generate anomalous telemetry with degrading trends
    return {
      timestamp: new Date().toISOString(),
      status_flag: 'Warning',
      speed_kph: Math.floor(baseSpeed - 1000), // Speed drop
      distance_from_earth_km: Math.floor(baseDistance),
      system_temp_c: Math.floor(baseTemp - 25), // Temperature drop (anomaly)
      signal_strength: 'Weak', // Anomalous signal
      battery_percent: Math.floor(baseBattery - 20), // Battery drop
    };
  } else {
    // Generate nominal telemetry with realistic small variations
    return {
      timestamp: new Date().toISOString(),
      status_flag: 'Nominal',
      speed_kph: Math.floor(baseSpeed + (Math.random() - 0.5) * 50),
      distance_from_earth_km: Math.floor(baseDistance + (Math.random() - 0.5) * 1000),
      system_temp_c: Math.floor(baseTemp + (Math.random() - 0.5) * 3),
      signal_strength: 'Strong',
      battery_percent: Math.floor(baseBattery + (Math.random() - 0.5) * 2),
    };
  }
};

/**
 * Static mission timeline data - scientifically accurate milestones
 * for the EMA (Envisaged Mission to Asteroid) mission to 21 Lutetia
 */
export const MISSION_TIMELINE_DATA = [
  {
    id: '1',
    date: 'October 2028',
    event: 'Launch from Earth',
    description: 'EMA spacecraft launches aboard Ariane 6 from Kourou, French Guiana',
  },
  {
    id: '2',
    date: 'March 2029',
    event: 'Earth Gravity Assist',
    description: 'First gravity assist maneuver to increase velocity and adjust trajectory',
  },
  {
    id: '3',
    date: 'September 2030',
    event: 'Mars Flyby',
    description: 'Close approach to Mars for gravity assist and trajectory correction',
  },
  {
    id: '4',
    date: 'May 2031',
    event: 'Main Belt Entry',
    description: 'Spacecraft enters the asteroid belt between Mars and Jupiter',
  },
  {
    id: '5',
    date: 'August 2032',
    event: 'Lutetia Approach',
    description: 'Begin final approach sequence to Asteroid 269 Lutetia',
  },
  {
    id: '6',
    date: 'November 2032',
    event: 'Orbital Insertion',
    description: 'EMA enters stable orbit around 21 Lutetia, begins scientific mission',
  },
  {
    id: '7',
    date: 'December 2032 - 2034',
    event: 'Science Operations',
    description: 'Two-year primary science mission: mapping, spectroscopy, and sample analysis',
  },
];
