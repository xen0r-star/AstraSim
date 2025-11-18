import Planet from './planet';
import { SOLAR_G, SOFTENING } from './../config/constants';



const SOFTENING2 = SOFTENING * SOFTENING;

// Calculates accelerations for all bodies (N-body gravity)
export function computeAccelerations(planets: Planet[]) {
    const n = planets.length;
    
    // Reset accelerations
    for (let i = 0; i < n; i++) {
        planets[i].acc.x = 0;
        planets[i].acc.y = 0;
    }
    
    // Calculate gravitational interactions
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const A = planets[i];
            const B = planets[j];
            
            const dx = B.pos.x - A.pos.x;
            const dy = B.pos.y - A.pos.y;
            const r2 = dx * dx + dy * dy + SOFTENING2;
            const r = Math.sqrt(r2);
            const r3 = r2 * r;
            
            // Gravitational force with softening
            const fx = SOLAR_G * dx / r3;
            const fy = SOLAR_G * dy / r3;
            
            // Apply to accelerations (F = ma => a = F/m)
            A.acc.x += B.mass * fx;
            A.acc.y += B.mass * fy;
            
            B.acc.x -= A.mass * fx;
            B.acc.y -= A.mass * fy;
        }
    }
}


// Velocity Verlet integration - more stable than Euler
export function velocityVerletStep(planets: Planet[], dt: number) {
    // Step 1: update positions and partial velocities
    for (const planet of planets) {
        planet.velocityVerletStep1(dt);
    }
    
    // Recalculate accelerations with new positions
    computeAccelerations(planets);
    
    // Step 2: finalize velocities
    for (const planet of planets) {
        planet.velocityVerletStep2(dt);
        planet.recordTrail();
    }
}
