/**
 * Mock Science Data for AI Analysis Feature
 * Simulates data from the EMA lander on Asteroid 269 Justitia
 */

export const MOCK_SURFACE_IMAGES = [
  {
    id: 'IMG_001',
    timestamp: '2032-11-15T14:23:00Z',
    location: 'Landing Site Alpha',
    coordinates: '41.2°N, 23.7°E',
    description: 'Rocky terrain with visible crater impact',
    visual: '🪨🌑', // Emoji representation
    type: 'surface',
    analyzed: false,
    imagePrompt: 'This image shows a rocky, cratered surface with angular boulders scattered across regolith (loose surface material). Several impact craters of varying sizes are visible, with one prominent crater showing raised rim features.'
  },
  {
    id: 'IMG_002',
    timestamp: '2032-11-15T15:47:00Z',
    location: 'North Ridge Formation',
    coordinates: '42.1°N, 24.3°E',
    description: 'Layered rock formation indicating geological history',
    visual: '⛰️🪨',
    type: 'surface',
    analyzed: false,
    imagePrompt: 'This image reveals distinct layered rock formations, suggesting sedimentary processes or different compositional zones. The layers appear to be exposed by erosion or impact events, showing varying textures and possibly different mineral compositions.'
  },
  {
    id: 'IMG_003',
    timestamp: '2032-11-15T16:12:00Z',
    location: 'Eastern Plains',
    coordinates: '40.8°N, 25.1°E',
    description: 'Smooth regolith with embedded metallic fragments',
    visual: '✨💎',
    type: 'surface',
    analyzed: false,
    imagePrompt: 'This image shows a smoother regolith plain with several bright, reflective fragments visible. These metallic-looking pieces stand out against the darker surrounding material, potentially indicating iron-nickel metal inclusions common in M-type asteroids.'
  },
  {
    id: 'IMG_004',
    timestamp: '2032-11-16T09:05:00Z',
    location: 'Central Depression',
    coordinates: '41.5°N, 23.2°E',
    description: 'Ancient impact basin with unusual color variations',
    visual: '🌋🔴',
    type: 'surface',
    analyzed: false,
    imagePrompt: 'This image captures a large depression or ancient impact basin. Notable color variations are present, with reddish tones in certain areas possibly indicating oxidized iron minerals or different composition from surrounding terrain.'
  },
  {
    id: 'IMG_005',
    timestamp: '2032-11-16T11:30:00Z',
    location: 'Sample Collection Site 1',
    coordinates: '41.3°N, 23.9°E',
    description: 'Close-up of collected rock sample showing crystalline structure',
    visual: '💎🔬',
    type: 'closeup',
    analyzed: false,
    imagePrompt: 'This close-up image shows a rock sample with visible crystalline structures. Angular grain boundaries and reflective crystal faces are apparent, suggesting slow cooling during formation. The texture indicates this is likely a primitive material from the early solar system.'
  }
];

export const MOCK_SENSOR_DATA = [
  {
    id: 'SPEC_001',
    timestamp: '2032-11-15T14:30:00Z',
    sampleId: 'Sample 01A',
    location: 'Landing Site Alpha',
    type: 'composition',
    analyzed: false,
    data: {
      Iron: 42.5,
      Nickel: 8.3,
      Silicon: 18.7,
      Magnesium: 12.1,
      Oxygen: 15.2,
      Other: 3.2
    },
    unit: 'weight %'
  },
  {
    id: 'SPEC_002',
    timestamp: '2032-11-15T16:45:00Z',
    sampleId: 'Sample 02B',
    location: 'North Ridge Formation',
    type: 'composition',
    analyzed: false,
    data: {
      Iron: 38.9,
      Nickel: 6.7,
      Silicon: 22.4,
      Magnesium: 14.8,
      Aluminum: 8.5,
      Oxygen: 7.1,
      Other: 1.6
    },
    unit: 'weight %'
  },
  {
    id: 'SPEC_003',
    timestamp: '2032-11-16T09:20:00Z',
    sampleId: 'Sample 03C',
    location: 'Eastern Plains',
    type: 'composition',
    analyzed: false,
    data: {
      Iron: 51.2,
      Nickel: 11.8,
      Cobalt: 0.8,
      Silicon: 14.3,
      Magnesium: 9.4,
      Oxygen: 10.2,
      Other: 2.3
    },
    unit: 'weight %'
  },
  {
    id: 'TEMP_001',
    timestamp: '2032-11-15T14:25:00Z',
    sampleId: 'Sample 01A',
    location: 'Landing Site Alpha',
    type: 'temperature',
    analyzed: false,
    data: {
      Surface: -73,
      Subsurface_5cm: -45,
      Subsurface_10cm: -38,
      AmbientVariation: 15
    },
    unit: '°C'
  },
  {
    id: 'MAG_001',
    timestamp: '2032-11-15T17:00:00Z',
    sampleId: 'Ambient Reading',
    location: 'Landing Site Alpha',
    type: 'magnetic',
    analyzed: false,
    data: {
      FieldStrength: 0.032,
      Orientation: 'North-Northeast',
      Stability: 'High',
      Variation: 0.003
    },
    unit: 'μT (microTesla)'
  },
  {
    id: 'WATER_001',
    timestamp: '2032-11-16T10:15:00Z',
    sampleId: 'Sample 04D',
    location: 'Central Depression',
    type: 'water_ice',
    analyzed: false,
    data: {
      WaterIceDetected: true,
      Concentration: 2.3,
      Depth: '8-12cm subsurface',
      FormType: 'Permafrost/Ice crystals'
    },
    unit: 'weight %'
  }
];

/**
 * Get all science data items (images + sensor data combined)
 */
export const getAllScienceData = () => {
  return {
    images: MOCK_SURFACE_IMAGES,
    sensors: MOCK_SENSOR_DATA
  };
};

/**
 * Mark a science data item as analyzed
 */
export const markAsAnalyzed = (itemId, isImage = true) => {
  const dataset = isImage ? MOCK_SURFACE_IMAGES : MOCK_SENSOR_DATA;
  const item = dataset.find(d => d.id === itemId);
  if (item) {
    item.analyzed = true;
  }
};
