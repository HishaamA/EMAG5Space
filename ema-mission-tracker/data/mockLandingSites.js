/**
 * Mock Landing Site Data for Asteroid 269 Justitia Landing Mission
 * Asteroid 269 Justitia is a large M-type asteroid in the main asteroid belt
 */

export const LANDING_SITES = [
  {
    id: 'SITE_ALPHA',
    name: 'Site Alpha',
    shortName: 'Alpha',
    coordinates: '15.3°N, 42.7°E',
    position: { top: '25%', left: '30%' }, // Visual position on map
    terrain: 'Rocky Highland',
    terrainType: 'rocky',
    slope: '18°',
    slopeLevel: 'high', // low, medium, high
    scientificInterest: 'Very High',
    interestLevel: 5, // 1-5 scale
    difficulty: 'Challenging',
    difficultyLevel: 'high', // low, medium, high
    icon: '🪨',
    color: '#ff9500', // Orange - challenging
    characteristics: {
      terrain: 'Rocky, High-Slope terrain with exposed bedrock',
      geology: 'Ancient impact melt features visible',
      resources: 'High metallic content detected (Fe, Ni)',
      hazards: 'Boulder field, 18° slope, rough surface',
      opportunities: 'Pristine samples from asteroid core material',
      accessibility: 'Difficult landing, requires precision descent',
      solarExposure: 'Excellent - 95% illumination coverage',
      communication: 'Direct line-of-sight to Earth'
    },
    analyzed: false
  },
  {
    id: 'SITE_BETA',
    name: 'Site Beta',
    shortName: 'Beta',
    coordinates: '8.1°N, 156.4°E',
    position: { top: '45%', left: '65%' },
    terrain: 'Smooth Plains',
    terrainType: 'smooth',
    slope: '3°',
    slopeLevel: 'low',
    scientificInterest: 'Medium',
    interestLevel: 3,
    difficulty: 'Easy',
    difficultyLevel: 'low',
    icon: '🏜️',
    color: '#30d158', // Green - safe
    characteristics: {
      terrain: 'Smooth regolith plains with minimal obstacles',
      geology: 'Fine-grained surface material, likely weathered',
      resources: 'Moderate mineral diversity detected',
      hazards: 'Dust accumulation risk, limited rock samples',
      opportunities: 'Safe landing zone, easy surface operations',
      accessibility: 'Optimal landing site, flat approach',
      solarExposure: 'Good - 80% illumination coverage',
      communication: 'Line-of-sight to Earth with occasional obstruction'
    },
    analyzed: false
  },
  {
    id: 'SITE_GAMMA',
    name: 'Site Gamma',
    shortName: 'Gamma',
    coordinates: '22.8°N, 89.2°E',
    position: { top: '20%', left: '52%' },
    terrain: 'Crater Rim',
    terrainType: 'crater',
    slope: '12°',
    slopeLevel: 'medium',
    scientificInterest: 'High',
    interestLevel: 4,
    difficulty: 'Moderate',
    difficultyLevel: 'medium',
    icon: '🌋',
    color: '#ffd60a', // Yellow - moderate
    characteristics: {
      terrain: 'Ancient crater rim with layered deposits',
      geology: 'Exposed stratigraphic layers showing asteroid history',
      resources: 'Water ice signatures detected in shadowed regions',
      hazards: 'Moderate slope, loose regolith on rim',
      opportunities: 'Access to subsurface materials, potential water ice',
      accessibility: 'Moderate difficulty, controlled descent required',
      solarExposure: 'Variable - 65% illumination, permanent shadows present',
      communication: 'Good Earth visibility from elevated position'
    },
    analyzed: false
  },
  {
    id: 'SITE_DELTA',
    name: 'Site Delta',
    shortName: 'Delta',
    coordinates: '5.6°N, 210.3°E',
    position: { top: '50%', left: '75%' }, // Visual position on map
    terrain: 'Ridge Formation',
    terrainType: 'ridge',
    slope: '22°',
    slopeLevel: 'high',
    scientificInterest: 'Very High',
    interestLevel: 5,
    difficulty: 'Very Challenging',
    difficultyLevel: 'high',
    icon: '⛰️',
    color: '#ff453a', // Red - very challenging
    characteristics: {
      terrain: 'Linear ridge structure with steep slopes',
      geology: 'Possible tectonic features or compression ridges',
      resources: 'Unique mineralogy, rare element concentrations',
      hazards: 'Steep 22° slope, unstable terrain, limited flat areas',
      opportunities: 'Unprecedented geological features, high science return',
      accessibility: 'Extreme difficulty, high-risk landing',
      solarExposure: 'Excellent - 98% illumination from ridge position',
      communication: 'Superior Earth visibility from elevated ridge'
    },
    analyzed: false
  }
];

/**
 * Get all landing sites
 */
export const getAllLandingSites = () => {
  return LANDING_SITES;
};

/**
 * Get a specific landing site by ID
 */
export const getLandingSiteById = (siteId) => {
  return LANDING_SITES.find(site => site.id === siteId);
};

/**
 * Mark a landing site as analyzed
 */
export const markSiteAsAnalyzed = (siteId) => {
  const site = LANDING_SITES.find(s => s.id === siteId);
  if (site) {
    site.analyzed = true;
  }
};
