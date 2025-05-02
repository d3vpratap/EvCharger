import React, { useState, useCallback } from "react";
import Map from "./components/Map";
import ControlPanel from "./components/ControlPanel";
import ComparisonChart from "./components/ComparisonChart";
import Legend from "./components/Legend";
import { Zap } from "lucide-react";
import { generateTraditionalLocations } from "./algorithms/traditional";
import { generateGeneticLocations } from "./algorithms/genetic";
import { generateSalpSwarmLocations } from "./algorithms/salpSwarm";
import { calculateCoverage } from "./utils/metrics";
import type { Point, GridSize, ComparisonResult } from "./types";

function App() {
  // State for simulation parameters
  const [numDemandPoints, setNumDemandPoints] = useState<number>(200);
  const [numExistingStations, setNumExistingStations] = useState<number>(3);
  const [numNewStations, setNumNewStations] = useState<number>(10);
  const [gridSize, setGridSize] = useState<GridSize>([28.4, 77.0, 28.8, 77.4]); // Delhi area

  // State for generated data
  const [demandPoints, setDemandPoints] = useState<Point[]>([]);
  const [existingStations, setExistingStations] = useState<Point[]>([]);
  const [traditionalStations, setTraditionalStations] = useState<Point[]>([]);
  const [geneticStations, setGeneticStations] = useState<Point[]>([]);
  const [salpStations, setSalpStations] = useState<Point[]>([]);
  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult | null>(null);

  // UI state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);

  // Generate random demand points within the grid
  const generateDemandPoints = useCallback(
    (count: number, grid: GridSize): Point[] => {
      const [latMin, lonMin, latMax, lonMax] = grid;
      const points: Point[] = [];

      for (let i = 0; i < count; i++) {
        const lat = latMin + Math.random() * (latMax - latMin);
        const lon = lonMin + Math.random() * (lonMax - lonMin);
        points.push([lat, lon]);
      }

      return points;
    },
    []
  );

  // Generate random existing stations within the grid
  const generateExistingStations = useCallback(
    (count: number, grid: GridSize): Point[] => {
      const [latMin, lonMin, latMax, lonMax] = grid;
      const stations: Point[] = [];

      for (let i = 0; i < count; i++) {
        const lat = latMin + Math.random() * (latMax - latMin);
        const lon = lonMin + Math.random() * (lonMax - lonMin);
        stations.push([lat, lon]);
      }

      return stations;
    },
    []
  );

  // Handle the generation of optimal locations
const handleGenerate = useCallback(async () => {
  setIsGenerating(true);

  // Generate random demand points and existing stations
  const newDemandPoints = generateDemandPoints(numDemandPoints, gridSize);
  const newExistingStations = generateExistingStations(
    numExistingStations,
    gridSize
  );

  // Use setTimeout to allow UI to update before running computations
  setTimeout(() => {
    // Traditional method
    const newTraditionalStations = generateTraditionalLocations(
      newDemandPoints,
      newExistingStations,
      gridSize,
      numNewStations
    );
    const allTraditionalStations = [
      ...newExistingStations,
      ...newTraditionalStations,
    ];
    const traditionalMetrics = calculateCoverage(
      newDemandPoints,
      allTraditionalStations
    );

    // Genetic Algorithm
    const newGeneticStations = generateGeneticLocations(
      newDemandPoints,
      newExistingStations,
      gridSize,
      numNewStations
    );
    const allGeneticStations = [...newExistingStations, ...newGeneticStations];
    const geneticMetrics = calculateCoverage(
      newDemandPoints,
      allGeneticStations
    );

    // Salp Swarm Algorithm
    const newSalpSwarmStations = generateSalpSwarmLocations(
      newDemandPoints,
      newExistingStations,
      gridSize,
      numNewStations
    );
    const allSalpSwarmStations = [
      ...newExistingStations,
      ...newSalpSwarmStations,
    ];
    const salpSwarmMetrics = calculateCoverage(
      newDemandPoints,
      allSalpSwarmStations
    );

    // Improvements over Traditional
    const avgDistanceImprovementGenetic =
      traditionalMetrics.avgDistance - geneticMetrics.avgDistance;
    const maxDistanceImprovementGenetic =
      traditionalMetrics.maxDistance - geneticMetrics.maxDistance;
    const coverage5kmImprovementGenetic =
      geneticMetrics.coverage5km - traditionalMetrics.coverage5km;

    const avgDistanceImprovementSalp =
      traditionalMetrics.avgDistance - salpSwarmMetrics.avgDistance;
    const maxDistanceImprovementSalp =
      traditionalMetrics.maxDistance - salpSwarmMetrics.maxDistance;
    const coverage5kmImprovementSalp =
      salpSwarmMetrics.coverage5km - traditionalMetrics.coverage5km;

    // Update state
    setDemandPoints(newDemandPoints);
    setExistingStations(newExistingStations);
    setTraditionalStations(newTraditionalStations);
    setGeneticStations(newGeneticStations);

    // Optionally store Salp Swarm separately
    setSalpStations(newSalpSwarmStations);


    setComparisonResult({
      traditional: {
        locations: newTraditionalStations,
        metrics: traditionalMetrics,
      },
      genetic: {
        locations: newGeneticStations,
        metrics: geneticMetrics,
        improvement: {
          avgDistance: avgDistanceImprovementGenetic,
          maxDistance: maxDistanceImprovementGenetic,
          coverage5km: coverage5kmImprovementGenetic,
        },
      },
      salp: {
        locations: newSalpSwarmStations,
        metrics: salpSwarmMetrics,
        improvement: {
          avgDistance: avgDistanceImprovementSalp,
          maxDistance: maxDistanceImprovementSalp,
          coverage5km: coverage5kmImprovementSalp,
        },
      },
    });

    setIsGenerating(false);
    setHasGenerated(true);
  }, 100);
}, [
  numDemandPoints,
  numExistingStations,
  numNewStations,
  gridSize,
  generateDemandPoints,
  generateExistingStations,
]);


  // Calculate map center based on grid size
  const mapCenter: [number, number] = [
    (gridSize[0] + gridSize[2]) / 2,
    (gridSize[1] + gridSize[3]) / 2,
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <header className="mb-8">
        <div className="flex items-center justify-center mb-2">
          <Zap size={32} className="text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-center">
            EV Charging Station Optimizer
          </h1>
        </div>
        <p className="text-center text-gray-600 max-w-3xl mx-auto">
          Compare traditional grid-based methods with genetic algorithms for
          optimal placement of EV charging stations.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar with controls */}
        <div className="lg:col-span-1 space-y-6">
          <ControlPanel
            numDemandPoints={numDemandPoints}
            setNumDemandPoints={setNumDemandPoints}
            numExistingStations={numExistingStations}
            setNumExistingStations={setNumExistingStations}
            numNewStations={numNewStations}
            setNumNewStations={setNumNewStations}
            gridSize={gridSize}
            setGridSize={setGridSize}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />

          <Legend />
        </div>

        {/* Main content area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Map */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Charging Station Locations
            </h2>
            <Map
              demandPoints={demandPoints}
              existingStations={existingStations}
              traditionalStations={traditionalStations}
              geneticStations={geneticStations}
              salpStations={salpStations}
              center={mapCenter}
              zoom={11}
            />
          </div>

          {/* Comparison chart */}
          {hasGenerated && comparisonResult && (
            <ComparisonChart comparisonResult={comparisonResult} />
          )}

          {/* Instructions if no data generated yet */}
          {!hasGenerated && (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-semibold mb-2">Get Started</h2>
              <p className="text-gray-600 mb-4">
                Adjust the parameters on the left and click "Generate Optimal
                Locations" to see the comparison between traditional and genetic
                algorithm methods.
              </p>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`py-2 px-6 rounded-md text-white font-medium ${
                  isGenerating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isGenerating ? "Generating..." : "Generate Now"}
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>EV Charging Station Optimizer &copy; 2025</p>
      </footer>
    </div>
  );
}

export default App;
