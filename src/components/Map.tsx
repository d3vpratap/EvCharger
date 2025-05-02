import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { Point } from "../types";

// Fix Leaflet marker icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Function to create custom icons for different station types
const createStationIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

// Custom Map View component to set the map center and zoom
function SetMapView({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

interface MapProps {
  demandPoints: Point[];
  existingStations: Point[];
  traditionalStations: Point[];
  geneticStations: Point[];
  salpStations: Point[]; // Add salpStations to the MapProps interface
  center: [number, number];
  zoom: number;
}

const Map: React.FC<MapProps> = ({
  demandPoints,
  existingStations,
  traditionalStations,
  geneticStations,
  salpStations, // Receive salpStations as props
  center,
  zoom,
}) => {
  // Define icons for different station types
  const existingStationIcon = createStationIcon("green");
  const traditionalStationIcon = createStationIcon("red");
  const geneticStationIcon = createStationIcon("violet");
  const salpStationIcon = createStationIcon("blue"); // Define Salp icon

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "500px", width: "100%" }}
      className="rounded-lg shadow-md"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <SetMapView center={center} zoom={zoom} />

      {/* Render demand points */}
      {demandPoints.map((point, index) => (
        <CircleMarker
          key={`demand-${index}`}
          center={point}
          radius={2}
          pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.7 }}
        >
          <Popup>
            Demand Point: {point[0].toFixed(6)}, {point[1].toFixed(6)}
          </Popup>
        </CircleMarker>
      ))}

      {/* Render existing stations */}
      {existingStations.map((station, index) => (
        <Marker
          key={`existing-${index}`}
          position={station}
          icon={existingStationIcon}
        >
          <Popup>
            Existing Station: {station[0].toFixed(6)}, {station[1].toFixed(6)}
          </Popup>
        </Marker>
      ))}

      {/* Render traditional method stations */}
      {traditionalStations.map((station, index) => (
        <Marker
          key={`traditional-${index}`}
          position={station}
          icon={traditionalStationIcon}
        >
          <Popup>
            Traditional Method Station: {station[0].toFixed(6)},{" "}
            {station[1].toFixed(6)}
          </Popup>
        </Marker>
      ))}

      {/* Render genetic algorithm stations */}
      {geneticStations.map((station, index) => (
        <Marker
          key={`genetic-${index}`}
          position={station}
          icon={geneticStationIcon}
        >
          <Popup>
            Genetic Algorithm Station: {station[0].toFixed(6)},{" "}
            {station[1].toFixed(6)}
          </Popup>
        </Marker>
      ))}

      {/* Render Salp Swarm stations */}
      {salpStations.map((station, index) => (
        <Marker
          key={`salp-${index}`}
          position={station}
          icon={salpStationIcon} // Use the salpStationIcon
        >
          <Popup>
            Salp Swarm Station: {station[0].toFixed(6)}, {station[1].toFixed(6)}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
