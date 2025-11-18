// Gravitation
export const SOLAR_G = 4 * Math.PI * Math.PI;   // AU^3 / (yr^2 * solar mass)
export const SOFTENING = 1e-5;                  // Avoid gravitational singularities
export const DEG2RAD = Math.PI / 180;           // Degrees to radians conversion factor

// Planet
export const MAX_HISTORY = 200;                 // Maximum number of points in a planet's trail
export const TRAIL_SAMPLE_STEPS = 2;            // Sample trail every N steps

// MainGame
export const timeScales = [0.25, 0.5, 1, 2, 5, 10, 20];