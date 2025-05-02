// Geographic point [latitude, longitude]
export type Point = [number, number];

// Grid boundaries [latMin, lonMin, latMax, lonMax]
export type GridSize = [number, number, number, number];

// Metrics for comparing algorithms
export interface CoverageMetrics {
  avgDistance: number;
  maxDistance: number;
  coverage5km: number;
}

export interface ImprovementMetrics {
  avgDistance: number;
  maxDistance: number;
  coverage5km: number;
}

export interface AlgorithmResult {
  locations: Point[];
  metrics: CoverageMetrics;
  improvement?: ImprovementMetrics;
}

// Algorithm comparison results
export interface ComparisonResult {
  traditional: {
    locations: Point[];
    metrics: CoverageMetrics;
  };
  genetic: AlgorithmResult;
  salp: AlgorithmResult;
}
