export interface OrbitalElements {
    semiMajorAxis: number;         // a (AU)
    eccentricity: number;          // e (sans unité)
    longitudeOfPerihelion: number; // ϖ (degrés)
    meanLongitude: number;         // L (degrés)
}

export interface DataPlanet {
    name: string;
    color: string;
    baseMass: number;               // masse en masses solaires
    orbit: OrbitalElements | null;  // null pour le Soleil
    radiusDraw: number;             // rayon d'affichage en pixels
}