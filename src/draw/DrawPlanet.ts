import p5 from 'p5';
import Planet from '../physics/planet';


export function drawPlanet(p: p5, planet: Planet, offsetX: number, offsetY: number, zoom: number) {
    p.push();

    // Camera (panning + zoom)
    p.translate(offsetX, offsetY);
    p.scale(zoom);

    // Physical position of the planet
    const px = planet.getPos().x;
    const py = planet.getPos().y;

    p.push();
    p.translate(px, py);
    
    // Planet shading --------------
    p.push();
    p.rotate(p.PI / 4);
    for (let i = -planet.getRadius(), step = 0; i <= planet.getRadius(); i += 8, step++) {
        
        const lineLength = Math.sqrt(planet.getRadius() ** 2 - i ** 2) * 2;

        if (step % 2 === 0) {
            p.strokeWeight(2 / zoom);
            p.stroke(planet.getColor().r, planet.getColor().g, planet.getColor().b, 150);
        } else {
            p.strokeWeight(1.75 / zoom);
            p.stroke(planet.getColor().r, planet.getColor().g, planet.getColor().b, 125);
        }

        p.line(i, -lineLength / 2, i, lineLength / 2);
    }
    p.pop();

    // Planet outline --------------
    p.fill(planet.getColor().r, planet.getColor().g, planet.getColor().b, 50);
    p.stroke(planet.getColor().r, planet.getColor().g, planet.getColor().b, 255);
    p.strokeWeight(3.5 / zoom);
    p.ellipse(0, 0, planet.getRadius() * 2);

    p.pop();

    // Planet trail ----------------
    const trail = planet.getHistoryPos();
    for (let i = 0; i < trail.length - 1; i++) {
        const alpha = p.map(i, 0, trail.length - 1, 0, 255);
        p.stroke(planet.getColor().r, planet.getColor().g, planet.getColor().b, alpha);
        p.strokeWeight(2);

        p.line(
            trail[i].x, trail[i].y,
            trail[i + 1].x, trail[i + 1].y
        );
    }

    p.pop();
}

