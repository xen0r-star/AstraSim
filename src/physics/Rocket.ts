import type Planet from "./Planet";

type Vector = {
    x: number;
    y: number;
}

export default class Rocket {
    private pos: Vector;
    private vel: Vector;
    private acc: Vector;
    private angle: number;

    private mass: number;
    private thrust: number;
    private fuelConsumption: number;
    private fuel: number;

    constructor(x: number, y: number) {
        this.pos = { x, y };
        this.vel = { x: 0, y: 0 };
        this.acc = { x: 0, y: 0 };
        this.angle = 0;

        this.mass = 1000;
        this.thrust = 0;
        this.fuelConsumption = 0.1;
        this.fuel = 100;
    }

    // Distance centre → fusée
    getDistanceToPlanet(planet: Planet) {
        const dx = planet.getPos().x - this.pos.x;
        const dy = planet.getPos().y - this.pos.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Altitude au-dessus de la surface
    getAltitude(planet: Planet) {
        return this.getDistanceToPlanet(planet) - planet.getRadius();
    }

    // Vitesse pour orbite circulaire
    getCircularOrbitSpeed(planet: Planet, G = 1) {
        const r = this.getDistanceToPlanet(planet);
        if (r <= 0) return 0;
        return Math.sqrt(G * planet.getMass() / r);
    }

    /**
     * Lancement depuis la surface
     * angle = angle par rapport au centre de la planète
     * tangentialFraction = 1 → vitesse orbitale parfaite
     */
    launchFromPlanet(planet: Planet, angle: number = 0, tangentialFraction: number = 0, G = 1) {
        // Position sur la surface
        this.pos.x = planet.getPos().x + Math.cos(angle) * planet.getRadius();
        this.pos.y = planet.getPos().y + Math.sin(angle) * planet.getRadius();

        // --- Correction PRINCIPALE ---
        // Reset des vitesses AVANT d'ajouter la vitesse tangentielle
        this.vel = { x: 0, y: 0 };

        // Impulsion tangentielle si demandée
        if (tangentialFraction !== 0) {
            const vCirc = Math.sqrt(G * planet.getMass() / planet.getRadius());

            // vecteur tangent (90° de rotation du radial)
            const tx = -Math.sin(angle);
            const ty =  Math.cos(angle);

            this.vel.x += tx * vCirc * tangentialFraction;
            this.vel.y += ty * vCirc * tangentialFraction;
        }

        // Fusée orientée vers le haut
        this.angle = angle - Math.PI / 2;

        // Reset de l'accélération
        this.acc = { x: 0, y: 0 };
    }

    applyForce(force: Vector) {
        this.acc.x += force.x;
        this.acc.y += force.y;
    }

    applyGravity(planet: Planet, G = 1) {
        const dx = planet.getPos().x - this.pos.x;
        const dy = planet.getPos().y - this.pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            const accel = (G * planet.getMass()) / (distance * distance);
            this.acc.x += accel * (dx / distance);
            this.acc.y += accel * (dy / distance);
        }
    }

    update(dt: number) {
        // appliquer l'accélération
        this.vel.x += this.acc.x * dt;
        this.vel.y += this.acc.y * dt;

        // mouvement
        this.pos.x += this.vel.x * dt;
        this.pos.y += this.vel.y * dt;

        // reset pour la frame
        this.acc = { x: 0, y: 0 };
    }

    // Getters
    getPos()       { return this.pos; }
    getVel()       { return this.vel; }
    getAcc()       { return this.acc; }
    getAngle()     { return this.angle; }
    getMass()      { return this.mass; }
    getThrust()    { return this.thrust; }
    getFuel()      { return this.fuel; }
    getFuelConsumption() { return this.fuelConsumption; }
}
