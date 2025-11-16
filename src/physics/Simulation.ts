import Planet from "./planet";
import { setCircularOrbit } from "./orbitUtils";



class Simulation {
    private planets: Planet[];
    private isRunning: boolean;
    private timeScale: number;
    private time: number;

    constructor() {
        this.planets = this.setupPlanets();

        this.isRunning = true;
        this.time = 0;
        this.timeScale = 1;
    }

    setupPlanets() {
        const planets = [];
        const sun = new Planet(0, 0, 20000, 40, 'Sun', {r: 255, g: 223, b: 0});
        const mercury = new Planet(200, 0, 50, 8, 'Mercury', {r: 169, g: 169, b: 169});
        const venus = new Planet(300, 0, 100, 14, 'Venus', {r: 218, g: 165, b: 32});
        const earth = new Planet(400, 0, 300, 18, 'Earth', {r: 0, g: 0, b: 255});
        const mars = new Planet(500, 0, 150, 12, 'Mars', {r: 188, g: 39, b: 50});
        const jupiter = new Planet(700, 0, 2000, 30, 'Jupiter', {r: 210, g: 180, b: 140});
        const saturn = new Planet(850, 0, 1500, 28, 'Saturn', {r: 244, g: 164, b: 96});
        const uranus = new Planet(1000, 0, 1000, 24, 'Uranus', {r: 173, g: 216, b: 230});
        const neptune = new Planet(1150, 0, 900, 22, 'Neptune', {r: 0, g: 0, b: 139});


        setCircularOrbit(earth, sun, 0.1);
        setCircularOrbit(mars, sun, 0.1);
        setCircularOrbit(venus, sun, 0.1);
        setCircularOrbit(mercury, sun, 0.1);
        setCircularOrbit(jupiter, sun, 0.1);
        setCircularOrbit(saturn, sun, 0.1);
        setCircularOrbit(uranus, sun, 0.1);
        setCircularOrbit(neptune, sun, 0.1);

        planets.push(sun);
        planets.push(mercury);
        planets.push(venus);
        planets.push(earth);
        planets.push(mars);
        planets.push(jupiter);
        planets.push(saturn);
        planets.push(uranus);
        planets.push(neptune);

        return planets;
    }

    incrementTime() {
        this.time += 0.25 * this.timeScale;
    }

    reset() {
        this.planets = this.setupPlanets();
        this.time = 0;
        this.timeScale = 1;
    }

    getIsRunning() { return this.isRunning; }
    getPlanets() { return this.planets; }
    getTimeScale() { return this.timeScale; }
    getTime() { return this.time; }

    setTimeScale(scale: number) { this.timeScale = scale; }
    setIsRunning(running: boolean) { this.isRunning = running; }
}

export const simulation = new Simulation();
