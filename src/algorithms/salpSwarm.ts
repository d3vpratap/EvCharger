import type { Point, GridSize } from "../types";
import { calculateCoverage } from "../utils/metrics";

function getRandomPoint(grid: GridSize): Point {
  const [latMin, lonMin, latMax, lonMax] = grid;
  const lat = latMin + Math.random() * (latMax - latMin);
  const lon = lonMin + Math.random() * (lonMax - lonMin);
  return [lat, lon];
}

function generateSalpSwarmLocations(
  demandPoints: Point[],
  existingStations: Point[],
  gridSize: GridSize,
  numNewStations: number,
  maxIterations = 50,
  populationSize = 30
): Point[] {
  // Initialize swarm (population of solutions)
  const swarm: Point[][] = Array.from({ length: populationSize }, () =>
    Array.from({ length: numNewStations }, () => getRandomPoint(gridSize))
  );

  let bestSolution = swarm[0];
  let bestFitness = evaluateFitness(
    demandPoints,
    existingStations,
    bestSolution
  );

  for (let iter = 0; iter < maxIterations; iter++) {
    for (let i = 0; i < populationSize; i++) {
      if (i === 0) {
        // Leader (random update towards best)
        swarm[i] = swarm[i].map((point, j) => {
          const best = bestSolution[j];
          const [lat, lon] = point;
          const [bLat, bLon] = best;
          return [
            (lat + bLat) / 2 + (Math.random() - 0.5) * 0.01,
            (lon + bLon) / 2 + (Math.random() - 0.5) * 0.01,
          ];
        });
      } else {
        // Followers follow the one ahead
        swarm[i] = swarm[i].map((_, j) => {
          return swarm[i - 1][j];
        });
      }

      // Clamp within grid
      swarm[i] = swarm[i].map((point) => {
        const [lat, lon] = point;
        const [latMin, lonMin, latMax, lonMax] = gridSize;
        return [
          Math.max(latMin, Math.min(lat, latMax)),
          Math.max(lonMin, Math.min(lon, lonMax)),
        ];
      });

      const fitness = evaluateFitness(demandPoints, existingStations, swarm[i]);
      if (fitness < bestFitness) {
        bestFitness = fitness;
        bestSolution = swarm[i];
      }
    }
  }

  return bestSolution;
}

function evaluateFitness(
  demandPoints: Point[],
  existingStations: Point[],
  candidateStations: Point[]
): number {
  const allStations = [...existingStations, ...candidateStations];
  const metrics = calculateCoverage(demandPoints, allStations);
  return metrics.avgDistance; // Lower average distance = better
}

export { generateSalpSwarmLocations };
