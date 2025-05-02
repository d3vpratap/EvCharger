import React from 'react';
import { MapPin, Zap, Settings } from 'lucide-react';
import type { GridSize } from '../types';

interface ControlPanelProps {
  numDemandPoints: number;
  setNumDemandPoints: (value: number) => void;
  numExistingStations: number;
  setNumExistingStations: (value: number) => void;
  numNewStations: number;
  setNumNewStations: (value: number) => void;
  gridSize: GridSize;
  setGridSize: (value: GridSize) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  numDemandPoints,
  setNumDemandPoints,
  numExistingStations,
  setNumExistingStations,
  numNewStations,
  setNumNewStations,
  gridSize,
  setGridSize,
  onGenerate,
  isGenerating
}) => {
  const [latMin, lonMin, latMax, lonMax] = gridSize;
  
  const handleGridSizeChange = (key: string, value: number) => {
    const newGridSize = [...gridSize] as GridSize;
    
    switch (key) {
      case 'latMin':
        newGridSize[0] = value;
        break;
      case 'lonMin':
        newGridSize[1] = value;
        break;
      case 'latMax':
        newGridSize[2] = value;
        break;
      case 'lonMax':
        newGridSize[3] = value;
        break;
    }
    
    setGridSize(newGridSize);
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Simulation Parameters</h2>
      
      <div className="space-y-4">
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <MapPin size={16} className="mr-1" />
            Number of Demand Points
          </label>
          <input
            type="range"
            min="50"
            max="500"
            step="50"
            value={numDemandPoints}
            onChange={(e) => setNumDemandPoints(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>50</span>
            <span>{numDemandPoints}</span>
            <span>500</span>
          </div>
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <Zap size={16} className="mr-1" />
            Number of Existing Stations
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={numExistingStations}
            onChange={(e) => setNumExistingStations(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0</span>
            <span>{numExistingStations}</span>
            <span>10</span>
          </div>
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <Zap size={16} className="mr-1" />
            Number of New Stations to Place
          </label>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={numNewStations}
            onChange={(e) => setNumNewStations(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1</span>
            <span>{numNewStations}</span>
            <span>20</span>
          </div>
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <Settings size={16} className="mr-1" />
            Grid Boundaries
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Min Latitude</label>
              <input
                type="number"
                step="0.1"
                value={latMin}
                onChange={(e) => handleGridSizeChange('latMin', Number(e.target.value))}
                className="w-full p-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Min Longitude</label>
              <input
                type="number"
                step="0.1"
                value={lonMin}
                onChange={(e) => handleGridSizeChange('lonMin', Number(e.target.value))}
                className="w-full p-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Max Latitude</label>
              <input
                type="number"
                step="0.1"
                value={latMax}
                onChange={(e) => handleGridSizeChange('latMax', Number(e.target.value))}
                className="w-full p-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Max Longitude</label>
              <input
                type="number"
                step="0.1"
                value={lonMax}
                onChange={(e) => handleGridSizeChange('lonMax', Number(e.target.value))}
                className="w-full p-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>
        
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isGenerating ? 'Generating...' : 'Generate Optimal Locations'}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;