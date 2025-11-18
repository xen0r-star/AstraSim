// Gravitation
export const SOLAR_G = 4 * Math.PI * Math.PI;   // AU^3 / (yr^2 * solar mass)
export const SOFTENING = 1e-5;                  // Avoid gravitational singularities
export const DEG2RAD = Math.PI / 180;           // Degrees to radians conversion factor

// Planet
export const MAX_HISTORY = 150;                 // Maximum number of points in a planet's trail
export const TRAIL_SAMPLE_STEPS = 1;            // Sample trail every N steps
export const AMPLIFY_TRAIL = 10;                // Amplify trail sampling based on speed

// MainGame
export const timeScales = [0.25, 0.5, 1, 2, 5, 10, 20];

// Controls
export const MASS_DISPLAY_MULTIPLIER = 10000000;