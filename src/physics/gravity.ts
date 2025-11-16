import Planet from './planet';


export function applyGravity(planets: Planet[], G = 1) {
    for (let i = 0; i < planets.length; i++) {
        for (let j = i + 1; j < planets.length; j++) {

            const A = planets[i];
            const B = planets[j];

            const dx = B.getPos().x - A.getPos().x;
            const dy = B.getPos().y - A.getPos().y;
            const r = Math.sqrt(dx*dx + dy*dy);

            // gravité
            const force = (G * A.getMass() * B.getMass()) / (r * r);

            const axA =  force / A.getMass() * (dx / r);
            const ayA =  force / A.getMass() * (dy / r);

            const axB = -force / B.getMass() * (dx / r);
            const ayB = -force / B.getMass() * (dy / r);

            // appliquer aux vitesses
            A.getVel().x += axA;
            A.getVel().y += ayA;

            B.getVel().x += axB;
            B.getVel().y += ayB;
        }
    }
}
