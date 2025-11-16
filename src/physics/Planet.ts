type Vector = {
    x: number;
    y: number;
}


export default class Planet {
    private pos: Vector;

    private mass: number;
    private radius: number;

    constructor(x: number, y: number, mass: number, radius: number) {
        this.pos = {x, y};
        
        this.mass = mass;
        this.radius = radius;
    }


    getPos() {
        return this.pos;
    }

    getMass() {
        return this.mass;
    }

    getRadius() {
        return this.radius;
    }
}