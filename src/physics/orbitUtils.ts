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



// Solve Kepler's equation: E - e*sin(E) = M
// Uses the Newton-Raphson method
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


// Calculates position and velocity from J2000 orbital elements
export function computeOrbitalState(
    orbit: OrbitalElements, 
    centralMass: number, 
    bodyMass: number = 0
): returnOrbitalState {
    const a = orbit.semiMajorAxis;
    const e = orbit.eccentricity;
    
    // Calculate the mean anomaly
    const meanAnomalyDegrees = normalizeDegrees(orbit.meanLongitude - orbit.longitudeOfPerihelion);
    const meanAnomaly = meanAnomalyDegrees * DEG2RAD;
    const periLon = orbit.longitudeOfPerihelion * DEG2RAD;
    
    // Solve Kepler's equation for the eccentric anomaly E
    const E = solveKeplerEquation(meanAnomaly, e);
    
    const cosE = Math.cos(E);
    const sinE = Math.sin(E);
    const sqrtOneMinusESq = Math.sqrt(1 - e * e);
    const r = a * (1 - e * cosE);
    
    // Position in the orbital plane
    const px = a * (cosE - e);
    const py = a * sqrtOneMinusESq * sinE;
    
    // Velocity in the orbital plane
    const mu = SOLAR_G * (centralMass + bodyMass);
    const sqrtMuA = Math.sqrt(mu * a);
    const vxOrb = -sqrtMuA / r * sinE;
    const vyOrb = sqrtMuA / r * sqrtOneMinusESq * cosE;
    
    // Rotation for the longitude of perihelion
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


// Align the system to the barycenter (center of mass)
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
    
    // Move the entire system to center the barycenter
    for (const planet of planets) {
        planet.pos.x -= cx;
        planet.pos.y -= cy;
        planet.vel.x -= cvx;
        planet.vel.y -= cvy;
    }
}
