import p5 from 'p5';
import Rocket from '../physics/Rocket';


const trail: { x: number; y: number }[] = [];
const maxTrail = 50;

export function drawRocket(p: p5, rocket: Rocket, rocketSVG: p5.Image | null, offsetX: number, offsetY: number, zoom: number) {
    // Coordinate transform
    p.push();
    p.translate(offsetX, offsetY);
    p.scale(zoom);

        // Draw rocket
        p.push();
        p.translate(p.width / 2, p.height / 2);
            p.push();
            p.translate(rocket.getPos().x, rocket.getPos().y);
            p.rotate(rocket.getAngle());
                p.imageMode(p.CENTER);
                if (rocketSVG) p.image(rocketSVG, 0, -15, 5, 30);
            p.pop();


            // Draw trail
            trail.push({ x: rocket.getPos().x, y: rocket.getPos().y });
            if (trail.length > maxTrail) trail.shift();

            for (let i = 0; i < trail.length - 1; i++) {
                const alpha = p.map(i, 0, trail.length - 1, 0, 255);
                p.stroke(255, 255, 255, alpha);
                p.strokeWeight(2);
                p.line(
                    trail[i].x * zoom + offsetX,
                    trail[i].y * zoom + offsetY,
                    trail[i + 1].x * zoom + offsetX,
                    trail[i + 1].y * zoom + offsetY
                );
            }
        p.pop();
    p.pop();
}
