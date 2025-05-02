/**
 * Calculate the haversine distance between two points in kilometers
 * @param point1 [lat, lon] coordinates of first point
 * @param point2 [lat, lon] coordinates of second point
 * @returns Distance in kilometers
 */
export function haversineDistance(
  point1: [number, number], 
  point2: [number, number]
): number {
  const [lat1, lon1] = point1;
  const [lat2, lon2] = point2;
  
  // Convert latitude and longitude from degrees to radians
  const toRadians = (degrees: number) => degrees * Math.PI / 180;
  const radLat1 = toRadians(lat1);
  const radLon1 = toRadians(lon1);
  const radLat2 = toRadians(lat2);
  const radLon2 = toRadians(lon2);
  
  // Haversine formula
  const dLat = radLat2 - radLat1;
  const dLon = radLon2 - radLon1;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(radLat1) * Math.cos(radLat2) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  // Earth's radius in kilometers
  const R = 6371;
  return R * c;
}