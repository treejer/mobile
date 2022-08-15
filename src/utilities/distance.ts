export type TPoint = {
  latitude: number;
  longitude: number;
};

export function calcDistance(pointOne: TPoint, pointTwo: TPoint) {
  const lat = pointTwo.latitude - pointOne.latitude;
  const long = pointTwo.longitude - pointOne.longitude;
  const aggregate = Math.pow(lat, 2) + Math.pow(long, 2);
  return Math.sqrt(aggregate);
}
