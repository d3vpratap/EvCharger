import { haversineDistance } from '../utils/haversine';
import type { Point, GridSize } from '../types';

/**
 * Generate charging station locations using a traditional grid-based approach
 * 
 * @param demandPoints List of [lat, lon] coordinates representing demand points
 * @param existingStations List of [lat, lon] coordinates of existing charging stations
 * @param gridSize Grid boundaries [latMin, lonMin, latMax, lonMax]
 * @param numStations Number of new charging stations to place
 * @returns List of [lat, lon] coordinates for new charging stations
 */
export function generateTraditionalLocations(
  demandPoints: Point[],
  existingStations: Point[],
  gridSize: GridSize,
  numStations: number
): Point[] {
  const [latMin, lonMin, latMax, lonMax] = gridSize;
  
  // Create a grid of potential locations
  const gridResolution = 10;
  const latStep = (latMax - latMin) / gridResolution;
  const lonStep = (lonMax - lonMin) / gridResolution;
  
  const potentialLocations: Point[] = [];
  for (let i = 0; i <= gridResolution; i++) {
    for (let j = 0; j <= gridResolution; j++) {
      const lat = latMin + i * latStep;
      const lon = lonMin + j * lonStep;
      potentialLocations.push([lat, lon]);
    }
  }
  
  // Calculate demand score for each potential location
  const locationScores = potentialLocations.map(location => {
    // Calculate coverage score (sum of inverse distances to demand points)
    let coverageScore = 0;
    for (const demandPoint of demandPoints) {
      const distance = haversineDistance(location, demandPoint);
      // Add inverse distance (closer points contribute more)
      coverageScore += 1 / (distance + 0.1); // Add 0.1 to avoid division by zero
    }
    
    // Calculate redundancy score (penalize locations close to existing stations)
    let redundancyScore = 0;
    for (const existingStation of existingStations) {
      const distance = haversineDistance(location, existingStation);
      // Penalize if too close to existing stations (less than 2km)
      if (distance < 2) {
        redundancyScore += (2 - distance) * 5;
      }
    }
    
    // Final score (higher is better)
    return coverageScore - redundancyScore;
  });
  
  // Sort potential locations by score (descending)
  const sortedIndices = Array.from(locationScores.keys())
    .sort((a, b) => locationScores[b] - locationScores[a]);
  
  // Select top locations, ensuring minimum distance between new stations
  const selectedLocations: Point[] = [];
  const minDistanceBetweenStations = 1.5; // km
  
  for (const index of sortedIndices) {
    const location = potentialLocations[index];
    
    // Check if this location is too close to already selected locations
    let isTooClose = false;
    for (const selectedLocation of selectedLocations) {
      if (haversineDistance(location, selectedLocation) < minDistanceBetweenStations) {
        isTooClose = true;
        break;
      }
    }
    
    if (!isTooClose) {
      selectedLocations.push(location);
      if (selectedLocations.length >= numStations) {
        break;
      }
    }
  }
  
  return selectedLocations;
}