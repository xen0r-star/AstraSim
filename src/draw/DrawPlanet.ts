import p5 from 'p5';
import Planet from '../physics/planet';


export function drawPlanet(p: p5, planet: Planet, offsetX: number, offsetY: number, zoom: number) {
    p.push();

    // Camera (panning + zoom)
    p.translate(offsetX, offsetY);
    p.scale(zoom);

    // Physical position of the planet (en AU)
    const px = planet.pos.x;
    const py = planet.pos.y;

    // Planet trail ----------------
    const nbTrailPoints = planet.historyIndex;
    if (nbTrailPoints > 1) {
        for (let i = 0; i < nbTrailPoints - 1; i++) {
            const alpha = p.map(i, 0, nbTrailPoints - 1, 50, 200);
            p.stroke(planet.color.r, planet.color.g, planet.color.b, alpha);
            p.strokeWeight(1.5 / zoom);

            p.line(
                planet.historyX[i], planet.historyY[i],
                planet.historyX[i + 1], planet.historyY[i + 1]
            );
        }
    }

    // Planet body -----------------
    p.push();
    p.translate(px, py);
    
    // Rayon de la planète en pixels divisé par zoom pour avoir une taille constante à l'écran
    const displayRadius = planet.radius / zoom;
    
    // Planet shading --------------
    p.push();
    p.rotate(p.PI / 4);
    for (let i = -displayRadius, step = 0; i <= displayRadius; i += displayRadius / 4, step++) {
        
        const lineLength = Math.sqrt(displayRadius ** 2 - i ** 2) * 2;

        if (step % 2 === 0) {
            p.strokeWeight(1.5 / zoom);
            p.stroke(planet.color.r, planet.color.g, planet.color.b, 150);
        } else {
            p.strokeWeight(1 / zoom);
            p.stroke(planet.color.r, planet.color.g, planet.color.b, 125);
        }

        p.line(i, -lineLength / 2, i, lineLength / 2);
    }
    p.pop();

    // Planet outline --------------
    p.fill(planet.color.r, planet.color.g, planet.color.b, 50);
    p.stroke(planet.color.r, planet.color.g, planet.color.b, 255);
    p.strokeWeight(2 / zoom);
    p.ellipse(0, 0, displayRadius * 2);

    p.pop();

    p.pop();
}
