import Planet from "./planet";
import type { DataPlanet } from "../types/dataPlanet";
import type { Color } from "../types/planet";
import rawData from "../config/dataPlanet.json" with { type: "json" };
import { computeOrbitalState, alignToBarycenter } from "./orbitUtils";
import { computeAccelerations, velocityVerletStep } from "./gravity";
import { hexToRgb } from "../utils/color";



const DATA_PLANET: DataPlanet[] = rawData;

class Simulation {
    public planets: Planet[];
    public isRunning: boolean;
    public timeScale: number;
    public time: number; // in years
    
    private integrationStepCounter: number;
    private readonly BASE_DT = 0.5 / 365; // 12 hour in years

    constructor() {
        this.planets = this.setupPlanets();
        this.isRunning = true;
        this.time = 0;
        this.timeScale = 1;
        this.integrationStepCounter = 0;
    }


    setupPlanets(): Planet[] {
        const planets: Planet[] = [];
        
        // Find the Sun
        const sunTemplate = DATA_PLANET.find(t => t.name === "Sun");
        if (!sunTemplate) throw new Error("Sun template not found");
        
        // Create all bodies from templates
        for (const template of DATA_PLANET) {
            let x = 0, y = 0, vx = 0, vy = 0;
            
            // If the body has an orbit, calculate its initial position/velocity
            if (template.orbit && sunTemplate) {
                const state = computeOrbitalState(
                    template.orbit, 
                    sunTemplate.baseMass, 
                    template.baseMass
                );

                x = state.position.x;
                y = state.position.y;
                vx = state.velocity.x;
                vy = state.velocity.y;
            }
            

            const color = hexToRgb(template.color);
            
            const planet = new Planet(
                x, y, vx, vy,
                template.baseMass,
                template.radiusDraw,
                template.name,
                color
            );
            
            planets.push(planet);
        }
        
        // Align the system to the barycenter
        alignToBarycenter(planets);
        
        // Compute initial accelerations
        computeAccelerations(planets);
        
        return planets;
    }

    // Perform several integration steps
    step(stepsPerFrame: number = 1) {
        if (!this.isRunning) return;
        
        for (let i = 0; i < stepsPerFrame; i++) {
            velocityVerletStep(this.planets, this.BASE_DT);

            // for (let i = 0; i < this.planets.length; i++) {
            //     for (let j = i + 1; j < this.planets.length; j++) {
            //         const planet1 = this.planets[i];
            //         const planet2 = this.planets[j];

            //         if (planet1.checkCollision(planet1, planet2)) {
            //             planet1.alive = false;
            //             planet2.alive = false;
            //         }
            //     }
            // }

            this.time += this.BASE_DT * this.timeScale;
            this.integrationStepCounter++;
        }
    }

    reset() {
        this.planets = this.setupPlanets();
        this.time = 0;
        this.integrationStepCounter = 0;
        this.isRunning = true;
    }

    clearTrails() {
        for (const planet of this.planets) {
            planet.clearTrail();
        }
    }

    addPlanet(x: number, y: number, vx: number, vy: number, baseMass: number, radiusDraw: number, name: string, color: Color) {
        const planet = new Planet(
            x, y, vx, vy,
            baseMass,
            radiusDraw,
            name,
            color
        );
        
        this.planets.push(planet);
    }

    updatePlanetMass(index: number, newMass: number) {
        if (index >= 0 && index < this.planets.length) {
            this.planets[index].mass = newMass;
        }
    }

    updatePlanetRadius(index: number, newRadius: number) {
        if (index >= 0 && index < this.planets.length) {
            this.planets[index].radius = newRadius;
        }
    }

    updatePlanetColor(index: number, newColor: Color) {
        if (index >= 0 && index < this.planets.length) {
            this.planets[index].color = newColor;
        }
    }

    removePlanet(index: number) {
        if (index >= 0 && index < this.planets.length) {
            this.planets.splice(index, 1);
        }
    }
}


export { Simulation };
export const instanceSimulation = new Simulation();
