import p5 from 'p5';
import Planet from '../physics/planet';
import { MAX_HISTORY } from '../config/constants';



export function drawPlanet(p: p5, planet: Planet, offsetX: number, offsetY: number, zoom: number) {
    if (!planet.alive) return;
    const px = planet.pos.x;
    const py = planet.pos.y;


    p.push();

    // Camera (panning + zoom)
    p.translate(offsetX, offsetY);
    p.scale(zoom);



    // Planet trail ----------------
    const max = MAX_HISTORY;
    let idx = planet.historyIndex; // Oldest point

    for (let n = 0; n < max - 1; n++) {
        const i1 = idx;
        const i2 = (idx + 1) % max;

        const x1 = planet.historyX[i1];
        const y1 = planet.historyY[i1];
        const x2 = planet.historyX[i2];
        const y2 = planet.historyY[i2];

        if (x1 == null || x2 == null || y1 == null || y2 == null) {
            idx = i2;
            continue;
        }

        const alpha = p.map(n, 0, max - 1, 50, 200);
        p.stroke(planet.color.r, planet.color.g, planet.color.b, alpha);
        p.strokeWeight(1.5 / zoom);

        p.line(x1, y1, x2, y2);

        idx = i2;
    }

    
    // Planet body -----------------
    p.push();
    p.translate(px, py);
    
    const displayRadius = planet.radius / zoom; // Adjust radius based on zoom level
    
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
