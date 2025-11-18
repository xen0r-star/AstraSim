import Planet from './planet';
import { SOLAR_G, SOFTENING } from './../config/constants';



const SOFTENING2 = SOFTENING * SOFTENING;

// Calcule les accélérations pour tous les corps (gravité N-corps)
export function computeAccelerations(planets: Planet[]) {
    const n = planets.length;
    
    // Réinitialiser les accélérations
    for (let i = 0; i < n; i++) {
        planets[i].acc.x = 0;
        planets[i].acc.y = 0;
    }
    
    // Calculer les interactions gravitationnelles
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const A = planets[i];
            const B = planets[j];
            
            const dx = B.pos.x - A.pos.x;
            const dy = B.pos.y - A.pos.y;
            const r2 = dx * dx + dy * dy + SOFTENING2;
            const r = Math.sqrt(r2);
            const r3 = r2 * r;
            
            // Force gravitationnelle avec softening
            const fx = SOLAR_G * dx / r3;
            const fy = SOLAR_G * dy / r3;
            
            // Appliquer aux accélérations (F = ma, donc a = F/m)
            A.acc.x += B.mass * fx;
            A.acc.y += B.mass * fy;
            
            B.acc.x -= A.mass * fx;
            B.acc.y -= A.mass * fy;
        }
    }
}

// Intégration Velocity Verlet - plus stable que l'Euler
export function velocityVerletStep(planets: Planet[], dt: number) {
    // Étape 1: mettre à jour positions et vitesses partielles
    for (const planet of planets) {
        planet.velocityVerletStep1(dt);
    }
    
    // Recalculer les accélérations avec les nouvelles positions
    computeAccelerations(planets);
    
    // Étape 2: finaliser les vitesses
    for (const planet of planets) {
        planet.velocityVerletStep2(dt);
        planet.recordTrail();
    }
}
