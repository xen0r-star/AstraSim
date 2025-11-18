import type { Vector, Color } from "../types/planet";
import { MAX_HISTORY, TRAIL_SAMPLE_STEPS } from "../config/constants";


export default class Planet {
    public pos: Vector;
    public vel: Vector;
    public acc: Vector;
    public mass: number;
    public baseMass: number;
    
    public name: string;
    public color: Color;
    public radius: number;
    public alive: boolean;
    
    public historyX: number[];
    public historyY: number[];
    public historyIndex: number;
    private trailStepCounter: number;


    constructor(x: number, y: number, vx: number, vy: number, mass: number, radius: number, name: string, color: Color) {
        this.pos = { x, y };
        this.vel = { x: vx, y: vy };
        this.acc = { x: 0, y: 0 };
        this.mass = mass;
        this.baseMass = mass;

        this.name = name;
        this.color = color;
        this.radius = radius;
        this.alive = true;

        this.historyX = new Array(MAX_HISTORY).fill(null);
        this.historyY = new Array(MAX_HISTORY).fill(null);
        this.historyIndex = 0;
        this.trailStepCounter = 0;
    }


    // Étape 1 de Velocity Verlet: mise à jour position et vitesse partielle
    velocityVerletStep1(dt: number) {
        this.pos.x += this.vel.x * dt + 0.5 * this.acc.x * dt * dt;
        this.pos.y += this.vel.y * dt + 0.5 * this.acc.y * dt * dt;
        this.vel.x += 0.5 * this.acc.x * dt;
        this.vel.y += 0.5 * this.acc.y * dt;
    }

    // Étape 2 de Velocity Verlet: finalisation de la vitesse
    velocityVerletStep2(dt: number) {
        this.vel.x += 0.5 * this.acc.x * dt;
        this.vel.y += 0.5 * this.acc.y * dt;
    }

    // Enregistre la traînée
    recordTrail() {
        this.trailStepCounter++;
        if (this.trailStepCounter % TRAIL_SAMPLE_STEPS !== 0) return;

        // écrire à l’index courant
        this.historyX[this.historyIndex] = this.pos.x;
        this.historyY[this.historyIndex] = this.pos.y;

        // avancer modulo
        this.historyIndex = (this.historyIndex + 1) % MAX_HISTORY;
    }

    clearTrail() {
        this.historyX = new Array(MAX_HISTORY).fill(null);
        this.historyY = new Array(MAX_HISTORY).fill(null);
        this.historyIndex = 0;
        this.trailStepCounter = 0;
    }
}