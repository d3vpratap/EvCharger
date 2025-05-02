import React from "react";

const Legend: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Map Legend</h2>
      <div className="space-y-2">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
          <span>Demand Points</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 mr-2"></div>
          <span>Existing Charging Stations</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 mr-2"></div>
          <span>Traditional Method Stations</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-purple-500 mr-2"></div>
          <span>Genetic Algorithm Stations</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-teal-500 mr-2"></div>{" "}
          {/* Updated color for Salp */}
          <span>Salp Swarm Algorithm Stations</span> {/* Added label */}
        </div>
      </div>
    </div>
  );
};

export default Legend;
