import Planet from "./planet";

export function setCircularOrbit(planet: Planet, around: Planet, G = 0.1) {
    const dx = planet.getPos().x - around.getPos().x;
    const dy = planet.getPos().y - around.getPos().y;
    const r = Math.sqrt(dx * dx + dy * dy);

    const v = Math.sqrt(G * around.getMass() / r);

    // vecteur tangent (rot 90°)
    const tx = -dy / r;
    const ty = dx / r;

    planet.setVelocity(
        tx * v,
        ty * v
    );
}
