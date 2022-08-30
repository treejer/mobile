export type TPoint = {
  latitude: number;
  longitude: number;
};

export function calcDistanceInMeters(pointOne: TPoint, pointTwo: TPoint) {
  // generally used geo measurement function
  var R = 6378.137; // Radius of earth in KM
  var dLat = (pointTwo.latitude * Math.PI) / 180 - (pointOne.latitude * Math.PI) / 180;
  var dLon = (pointTwo.longitude * Math.PI) / 180 - (pointOne.longitude * Math.PI) / 180;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((pointOne.latitude * Math.PI) / 180) *
      Math.cos((pointTwo.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d * 1000; // meters
}
