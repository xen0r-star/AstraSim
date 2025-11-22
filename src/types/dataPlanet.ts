export interface OrbitalElements {
    semiMajorAxis: number;         // a (AU)
    eccentricity: number;          // e (unitless)
    longitudeOfPerihelion: number; // ϖ (degrees)
    meanLongitude: number;         // L (degrees)
}

export interface DataPlanet {
    name: string;
    color: string;
    symbol: string;                 // Unicode character representing the planet
    baseMass: number;               // mass in solar masses
    orbit: OrbitalElements | null;  // null for the Sun
    radiusDraw: number;             // display radius in pixels
}