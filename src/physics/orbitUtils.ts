import Planet from "./planet";
import type { OrbitalElements } from "./../types/dataPlanet";
import { SOLAR_G, DEG2RAD } from "./../config/constants";
import { normalizeDegrees } from "../utils/normalizeDegrees";



interface returnOrbitalState { 
    position: { 
        x: number; 
        y: number 
    }; 
    velocity: { 
        x: number; y: number 
    } 
}


// Résout l'équation de Kepler: E - e*sin(E) = M
// Utilise la méthode de Newton-Raphson
export function solveKeplerEquation(
    meanAnomaly: number, 
    eccentricity: number, 
    tolerance: number = 1e-9, 
    maxIterations: number = 30
): number {
    let E = eccentricity < 0.8 ? meanAnomaly : Math.PI;
    
    for (let i = 0; i < maxIterations; i++) {
        const f = E - eccentricity * Math.sin(E) - meanAnomaly;
        const fPrime = 1 - eccentricity * Math.cos(E);
        const delta = f / fPrime;
        E -= delta;
        
        if (Math.abs(delta) < tolerance) break;
    }
    
    return E;
}

// Calcule la position et la vitesse à partir des éléments orbitaux J2000
export function computeOrbitalState(
    orbit: OrbitalElements, 
    centralMass: number, 
    bodyMass: number = 0
): returnOrbitalState {
    const a = orbit.semiMajorAxis;
    const e = orbit.eccentricity;
    
    // Calculer l'anomalie moyenne
    const meanAnomalyDegrees = normalizeDegrees(orbit.meanLongitude - orbit.longitudeOfPerihelion);
    const meanAnomaly = meanAnomalyDegrees * DEG2RAD;
    const periLon = orbit.longitudeOfPerihelion * DEG2RAD;
    
    // Résoudre l'équation de Kepler pour l'anomalie excentrique E
    const E = solveKeplerEquation(meanAnomaly, e);
    
    const cosE = Math.cos(E);
    const sinE = Math.sin(E);
    const sqrtOneMinusESq = Math.sqrt(1 - e * e);
    const r = a * (1 - e * cosE);
    
    // Position dans le plan orbital
    const px = a * (cosE - e);
    const py = a * sqrtOneMinusESq * sinE;
    
    // Vitesse dans le plan orbital
    const mu = SOLAR_G * (centralMass + bodyMass);
    const sqrtMuA = Math.sqrt(mu * a);
    const vxOrb = -sqrtMuA / r * sinE;
    const vyOrb = sqrtMuA / r * sqrtOneMinusESq * cosE;
    
    // Rotation pour la longitude du périhélie
    const cosW = Math.cos(periLon);
    const sinW = Math.sin(periLon);
    
    return {
        position: {
            x: px * cosW - py * sinW,
            y: px * sinW + py * cosW
        },
        velocity: {
            x: vxOrb * cosW - vyOrb * sinW,
            y: vxOrb * sinW + vyOrb * cosW
        }
    };
}

// Aligner le système au barycentre (centre de masse)
export function alignToBarycenter(planets: Planet[]): void {
    let totalMass = 0;
    let sumX = 0;
    let sumY = 0;
    let sumVx = 0;
    let sumVy = 0;
    
    for (const planet of planets) {
        const mass = planet.mass;
        totalMass += mass;
        sumX += mass * planet.pos.x;
        sumY += mass * planet.pos.y;
        sumVx += mass * planet.vel.x;
        sumVy += mass * planet.vel.y;
    }
    
    if (totalMass === 0) return;
    
    const invMass = 1 / totalMass;
    const cx = sumX * invMass;
    const cy = sumY * invMass;
    const cvx = sumVx * invMass;
    const cvy = sumVy * invMass;
    
    // Déplacer tout le système pour centrer le barycentre
    for (const planet of planets) {
        planet.pos.x -= cx;
        planet.pos.y -= cy;
        planet.vel.x -= cvx;
        planet.vel.y -= cvy;
    }
}
