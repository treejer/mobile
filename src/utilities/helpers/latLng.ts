import {LatLng} from 'react-native-maps';

export class Point implements LatLng {
  public x: number;
  public y: number;

  constructor(public latitude: number, public longitude: number) {
    this.x = (latitude + 180) * 360;
    this.y = (longitude + 90) * 180;
  }

  distance(that: Point) {
    var dX = that.x - this.x;
    var dY = that.y - this.y;
    return Math.sqrt(dX * dX + dY * dY);
  }

  slope(that: Point) {
    var dX = that.x - this.x;
    var dY = that.y - this.y;
    return dY / dX;
  }
}

// A custom sort function that sorts p1 and p2 based on their slope
// that is formed from the upper most point from the array of points.
export function pointSort(upper: Point) {
  return (p1: Point, p2: Point) => {
    // Exclude the 'upper' point from the sort (which should come first).
    if (p1 == upper) return -1;
    if (p2 == upper) return 1;

    // Find the slopes of 'p1' and 'p2' when a line is
    // drawn from those points through the 'upper' point.
    var m1 = upper.slope(p1);
    var m2 = upper.slope(p2);

    // 'p1' and 'p2' are on the same line towards 'upper'.
    if (m1 == m2) {
      // The point closest to 'upper' will come first.
      return p1.distance(upper) < p2.distance(upper) ? -1 : 1;
    }

    // If 'p1' is to the right of 'upper' and 'p2' is the the left.
    if (m1 <= 0 && m2 > 0) return -1;

    // If 'p1' is to the left of 'upper' and 'p2' is the the right.
    if (m1 > 0 && m2 <= 0) return 1;

    // It seems that both slopes are either positive, or negative.
    return m1 > m2 ? -1 : 1;
  };
}

// Find the upper most point. In case of a tie, get the left most point.
export function upperLeft(points: Point[]) {
  var top = points[0];
  for (var i = 1; i < points.length; i++) {
    var temp = points[i];
    if (temp.y > top.y || (temp.y == top.y && temp.x < top.x)) {
      top = temp;
    }
  }
  return top;
}
