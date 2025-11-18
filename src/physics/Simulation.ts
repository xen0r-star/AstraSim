import Planet from "./planet";
import type { DataPlanet } from "../types/dataPlanet";
import rawData from "./dataPlanet.json" assert { type: "json" };
import { computeOrbitalState, alignToBarycenter } from "./orbitUtils";
import { computeAccelerations, velocityVerletStep } from "./gravity";
import { hexToRgb } from "../utils/hexToRgb";



const DATA_PLANET: DataPlanet[] = rawData;

class Simulation {
    public planets: Planet[];
    public isRunning: boolean;
    public timeScale: number;
    public time: number; // en années
    
    private integrationStepCounter: number;
    private readonly BASE_DT = 1 / 365; // 1 jour en années

    constructor() {
        this.planets = this.setupPlanets();
        this.isRunning = true;
        this.time = 0;
        this.timeScale = 1;
        this.integrationStepCounter = 0;
    }


    setupPlanets(): Planet[] {
        const planets: Planet[] = [];
        
        // Trouver le Soleil
        const sunTemplate = DATA_PLANET.find(t => t.name === "Sun");
        if (!sunTemplate) throw new Error("Sun template not found");
        
        // Créer tous les corps à partir des templates
        for (const template of DATA_PLANET) {
            let x = 0, y = 0, vx = 0, vy = 0;
            
            // Si le corps a une orbite, calculer sa position/vitesse initiale
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
            
            // Convertir la couleur hex en RGB
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
        
        // Aligner le système au barycentre
        alignToBarycenter(planets);
        
        // Calculer les accélérations initiales
        computeAccelerations(planets);
        
        return planets;
    }

    // Effectuer plusieurs pas d'intégration
    step(stepsPerFrame: number = 1) {
        if (!this.isRunning) return;
        
        for (let i = 0; i < stepsPerFrame; i++) {
            velocityVerletStep(this.planets, this.BASE_DT);
            this.time += this.BASE_DT * this.timeScale;
            this.integrationStepCounter++;
        }
    }

    reset() {
        this.planets = this.setupPlanets();
        this.time = 0;
        this.timeScale = 1;
        this.integrationStepCounter = 0;
        this.isRunning = true;
    }

    clearTrails() {
        for (const planet of this.planets) {
            planet.clearTrail();
        }
    }
}

export const simulation = new Simulation();