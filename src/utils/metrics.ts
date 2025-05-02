import { haversineDistance } from './haversine';
import type { Point, CoverageMetrics } from '../types';

/**
 * Calculate coverage metrics for a set of demand points and stations
 * 
 * @param demandPoints List of demand points
 * @param stations List of charging stations (existing + new)
 * @returns Coverage metrics
 */
export function calculateCoverage(
  demandPoints: Point[],
  stations: Point[]
): CoverageMetrics {
  if (demandPoints.length === 0 || stations.length === 0) {
    return {
      avgDistance: 0,
      maxDistance: 0,
      coverage5km: 0
    };
  }
  
  // Calculate distances from each demand point to the nearest station
  const minDistances = demandPoints.map(demandPoint => {
    return Math.min(...stations.map(station => haversineDistance(demandPoint, station)));
  });
  
  // Calculate coverage metrics
  const avgDistance = minDistances.reduce((sum, dist) => sum + dist, 0) / minDistances.length;
  const maxDistance = Math.max(...minDistances);
  const coverage5km = (minDistances.filter(dist => dist <= 5).length / minDistances.length) * 100;
  
  return {
    avgDistance,
    maxDistance,
    coverage5km
  };
}