type Vector = {
    x: number;
    y: number;
};

type Color = {
    r: number;
    g: number;
    b: number;
}



const MAX_HISTORY = 200;

export default class Planet {
    private pos: Vector;
    private vel: Vector;
    private mass: number;
    private radius: number;
    private historyPos: Vector[];
    private name: string;
    private alive: boolean = true;
    private color: Color;

    constructor(x: number, y: number, mass: number, radius: number, name: string, color: Color) {
        this.pos = { x, y };
        this.vel = { x: 0, y: 0 };
        this.mass = mass;
        this.radius = radius;
        this.name = name;
        this.historyPos = [];
        this.color = color;
    }

    getPos() { return this.pos; }
    getVel() { return this.vel; }
    getMass() { return this.mass; }
    getRadius() { return this.radius; }
    getName() { return this.name; }
    getHistoryPos() { return this.historyPos; }
    getIsAlive() { return this.alive; }
    getColor() { return this.color; }


    setMass(mass: number) { this.mass = mass; }
    setRadius(radius: number) { this.radius = radius; }
    setVelocity(vx: number, vy: number) {
        this.vel.x = vx;
        this.vel.y = vy;
    }
    setIsAlive(alive: boolean) { this.alive = alive; }


    update(dt: number) {
        this.pos.x += this.vel.x * dt;
        this.pos.y += this.vel.y * dt;
        
        this.historyPos.push({ x: this.pos.x, y: this.pos.y });
        if (this.historyPos.length > MAX_HISTORY) this.historyPos.shift();
    }
}
