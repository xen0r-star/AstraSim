import Rocket from "./Rocket";
import Planet from "./Planet";

class Simulation {
    private planet: Planet;
    private rocket: Rocket;
    private isRunning: boolean;

    constructor() {
        this.planet = new Planet(0, 0, 50000, 80);
        this.rocket = new Rocket(0, -this.planet.getRadius());
        this.isRunning = false;
    }

    play() {
        this.rocket.launchFromPlanet(this.planet, 0, 1);
        this.isRunning = true;
    }

    restart() {
        this.rocket = new Rocket(0, -this.planet.getRadius());
        this.isRunning = false;
    }


    getIsRunning() {
        return this.isRunning;
    }

    getPlanet() {
        return this.planet;
    }

    getRocket() {
        return this.rocket;
    }
}

export const simulation = new Simulation();
