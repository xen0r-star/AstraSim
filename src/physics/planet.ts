import type { Vector, Color } from "../types/planet";
import { AMPLIFY_TRAIL, MAX_HISTORY, TRAIL_SAMPLE_STEPS } from "../config/constants";


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


    velocityVerletStep1(dt: number) {
        this.pos.x += this.vel.x * dt + 0.5 * this.acc.x * dt * dt;
        this.pos.y += this.vel.y * dt + 0.5 * this.acc.y * dt * dt;
        this.vel.x += 0.5 * this.acc.x * dt;
        this.vel.y += 0.5 * this.acc.y * dt;
    }

    velocityVerletStep2(dt: number) {
        this.vel.x += 0.5 * this.acc.x * dt;
        this.vel.y += 0.5 * this.acc.y * dt;
    }

    // checkCollision(planet1: Planet, planet2: Planet): boolean {
    //     const dx = planet1.pos.x - planet2.pos.x;
    //     const dy = planet1.pos.y - planet2.pos.y;
    //     const dist2 = dx*dx + dy*dy;
    //     const minDist = (planet1.radius + planet2.radius);

    //     return dist2 < minDist * minDist;
    // }


    recordTrail() {
        this.trailStepCounter++;
        const speed = Math.sqrt(this.vel.x*this.vel.x + this.vel.y*this.vel.y);

        let sampleSteps = Math.max(1, Math.round(TRAIL_SAMPLE_STEPS / speed * 2));
        sampleSteps = Math.round(sampleSteps * AMPLIFY_TRAIL);

        if (this.trailStepCounter % sampleSteps !== 0) return;

        this.historyX[this.historyIndex] = this.pos.x;
        this.historyY[this.historyIndex] = this.pos.y;

        this.historyIndex = (this.historyIndex + 1) % MAX_HISTORY;
    }

    clearTrail() {
        this.historyX = new Array(MAX_HISTORY).fill(null);
        this.historyY = new Array(MAX_HISTORY).fill(null);
        this.historyIndex = 0;
        this.trailStepCounter = 0;
    }
}
