import { haversineDistance } from '../utils/haversine';
import type { Point, GridSize } from '../types';

/**
 * Generate optimal charging station locations using a genetic algorithm
 * 
 * @param demandPoints List of [lat, lon] coordinates representing demand points
 * @param existingStations List of [lat, lon] coordinates of existing charging stations
 * @param gridSize Grid boundaries [latMin, lonMin, latMax, lonMax]
 * @param numStations Number of new charging stations to place
 * @returns List of [lat, lon] coordinates for new charging stations
 */
export function generateGeneticLocations(
  demandPoints: Point[],
  existingStations: Point[],
  gridSize: GridSize,
  numStations: number
): Point[] {
  const ga = new GeneticAlgorithm(
    demandPoints,
    existingStations,
    gridSize,
    {
      populationSize: 50,
      generations: 100,
      mutationRate: 0.1,
      eliteSize: 5,
      crossoverRate: 0.8
    }
  );
  
  return ga.evolve(numStations);
}

class GeneticAlgorithm {
  private demandPoints: Point[];
  private existingStations: Point[];
  private gridSize: GridSize;
  private populationSize: number;
  private generations: number;
  private mutationRate: number;
  private eliteSize: number;
  private crossoverRate: number;
  private latMin: number;
  private lonMin: number;
  private latMax: number;
  private lonMax: number;
  
  constructor(
    demandPoints: Point[],
    existingStations: Point[],
    gridSize: GridSize,
    options: {
      populationSize: number;
      generations: number;
      mutationRate: number;
      eliteSize: number;
      crossoverRate: number;
    }
  ) {
    this.demandPoints = demandPoints;
    this.existingStations = existingStations;
    this.gridSize = gridSize;
    this.populationSize = options.populationSize;
    this.generations = options.generations;
    this.mutationRate = options.mutationRate;
    this.eliteSize = options.eliteSize;
    this.crossoverRate = options.crossoverRate;
    
    // Extract grid boundaries
    [this.latMin, this.lonMin, this.latMax, this.lonMax] = gridSize;
  }
  
  private createIndividual(numStations: number): Point[] {
    const individual: Point[] = [];
    for (let i = 0; i < numStations; i++) {
      const lat = this.latMin + Math.random() * (this.latMax - this.latMin);
      const lon = this.lonMin + Math.random() * (this.lonMax - this.lonMin);
      individual.push([lat, lon]);
    }
    return individual;
  }
  
  private initializePopulation(numStations: number): Point[][] {
    const population: Point[][] = [];
    for (let i = 0; i < this.populationSize; i++) {
      population.push(this.createIndividual(numStations));
    }
    return population;
  }
  
  private fitness(individual: Point[]): number {
    // Combine existing and new stations
    const allStations = [...this.existingStations, ...individual];
    
    // Calculate coverage score (average minimum distance from demand points to nearest station)
    let coverageScore = 0;
    for (const demandPoint of this.demandPoints) {
      const minDistance = Math.min(
        ...allStations.map(station => haversineDistance(demandPoint, station))
      );
      coverageScore += minDistance;
    }
    
    if (this.demandPoints.length > 0) {
      coverageScore /= this.demandPoints.length;
    }
    
    // Calculate redundancy score (penalize stations too close to existing ones)
    let redundancyScore = 0;
    if (this.existingStations.length > 0) {
      for (const newStation of individual) {
        const minDistance = Math.min(
          ...this.existingStations.map(existing => haversineDistance(newStation, existing))
        );
        // Penalize if too close to existing stations (less than 2km)
        if (minDistance < 2) {
          redundancyScore += (2 - minDistance) * 5;
        }
      }
    }
    
    // Calculate distribution score (penalize stations too close to each other)
    let distributionScore = 0;
    if (individual.length > 1) {
      for (let i = 0; i < individual.length; i++) {
        for (let j = i + 1; j < individual.length; j++) {
          const distance = haversineDistance(individual[i], individual[j]);
          // Penalize if stations are too close to each other (less than 3km)
          if (distance < 3) {
            distributionScore += (3 - distance) * 3;
          }
        }
      }
    }
    
    // Combined fitness (lower is better)
    return coverageScore + redundancyScore + distributionScore;
  }
  
  private selectParents(population: Point[][], fitnesses: number[]): Point[][] {
    const parents: Point[][] = [];
    for (let i = 0; i < this.populationSize; i++) {
      // Tournament selection with tournament size of 3
      const tournamentIndices = Array.from({ length: 3 }, () => 
        Math.floor(Math.random() * this.populationSize)
      );
      const tournamentFitnesses = tournamentIndices.map(idx => fitnesses[idx]);
      const winnerIdx = tournamentIndices[
        tournamentFitnesses.indexOf(Math.min(...tournamentFitnesses))
      ];
      parents.push(population[winnerIdx]);
    }
    return parents;
  }
  
  private crossover(parent1: Point[], parent2: Point[]): Point[] {
    if (Math.random() > this.crossoverRate) {
      return [...parent1];
    }
    
    // Single point crossover
    const crossoverPoint = Math.floor(Math.random() * (parent1.length - 1)) + 1;
    return [...parent1.slice(0, crossoverPoint), ...parent2.slice(crossoverPoint)];
  }
  
  private mutate(individual: Point[]): Point[] {
    return individual.map(station => {
      if (Math.random() < this.mutationRate) {
        // Mutate by adding a small random offset
        const latOffset = (Math.random() - 0.5) * 0.02;
        const lonOffset = (Math.random() - 0.5) * 0.02;
        const newLat = Math.max(Math.min(station[0] + latOffset, this.latMax), this.latMin);
        const newLon = Math.max(Math.min(station[1] + lonOffset, this.lonMax), this.lonMin);
        return [newLat, newLon];
      }
      return station;
    });
  }
  
  public evolve(numStations: number): Point[] {
    // Initialize population
    let population = this.initializePopulation(numStations);
    
    let bestIndividual: Point[] = [];
    let bestFitness = Infinity;
    
    // Evolution loop
    for (let generation = 0; generation < this.generations; generation++) {
      // Calculate fitness for each individual
      const fitnesses = population.map(individual => this.fitness(individual));
      
      // Keep track of the best individual
      const minFitnessIdx = fitnesses.indexOf(Math.min(...fitnesses));
      if (fitnesses[minFitnessIdx] < bestFitness) {
        bestFitness = fitnesses[minFitnessIdx];
        bestIndividual = [...population[minFitnessIdx]];
      }
      
      // Sort population by fitness
      const sortedIndices = Array.from(fitnesses.keys())
        .sort((a, b) => fitnesses[a] - fitnesses[b]);
      const sortedPopulation = sortedIndices.map(idx => population[idx]);
      
      // Elitism: keep the best individuals
      const newPopulation = sortedPopulation.slice(0, this.eliteSize);
      
      // Select parents
      const parents = this.selectParents(population, fitnesses);
      
      // Create offspring
      while (newPopulation.length < this.populationSize) {
        const parent1 = parents[Math.floor(Math.random() * parents.length)];
        const parent2 = parents[Math.floor(Math.random() * parents.length)];
        
        // Crossover
        const child = this.crossover(parent1, parent2);
        
        // Mutation
        const mutatedChild = this.mutate(child);
        
        newPopulation.push(mutatedChild);
      }
      
      population = newPopulation;
    }
    
    return bestIndividual;
  }
}