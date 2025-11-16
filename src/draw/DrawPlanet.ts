import p5 from 'p5';
import Planet from '../physics/Planet';


export function drawPlanet(p: p5, planet: Planet, offsetX: number, offsetY: number, zoom: number) {
    p.push();
    p.translate(offsetX, offsetY);
    p.scale(zoom);

        // Translation au centre de la planète
        p.push();
        p.translate(p.width / 2, p.height / 2);
        p.rotate(Math.PI / 4); // 45°

            for (let i = 0, x = -planet.getRadius(); x <= planet.getRadius(); x += 8, i++) {
                const lineLength = Math.sqrt(Math.pow(planet.getRadius(), 2) - Math.pow(x, 2)) * 2;

                if (i % 2 === 0) {
                    p.strokeWeight(2 / zoom);
                    p.stroke(255, 255, 255, 150);
                } else {
                    p.strokeWeight(1.75 / zoom);
                    p.stroke(255, 255, 255, 125);
                }

                p.line(x, -lineLength / 2, x, lineLength / 2);
            }

            p.fill(255, 255, 255, 50);
            p.stroke(255);
            p.strokeWeight(3.5 / zoom);
            p.ellipse(0, 0, planet.getRadius() * 2);
        p.pop();
    p.pop();
}
