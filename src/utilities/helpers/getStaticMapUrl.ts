import {colors} from 'constants/values';

import qs from 'qs';
import config from 'services/config';

const API_KEY = config.mapboxToken;
const baseUrl = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static';

interface Coordinate {
  lat: number;
  lng: number;
}

interface Path {
  color?: string;
  weight?: number;
  fillcolor?: string;
  coordinates: Coordinate[];
}

interface Marker {
  coordinate: Coordinate;
}

interface Input {
  width: number;
  height: number;
  path?: Path;
  markers?: [Marker];
  zoom?: number;
  maptype?: 'roadmap' | 'satellite';
}

function pipe(dictionary: Record<string, string | number>) {
  return Object.entries(dictionary)
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
}

function joinCoordinate({lat, lng}: Coordinate) {
  return `${lat.toFixed(6)},${lng.toFixed(6)}`;
}

const defaultColor = colors.khakiDark.replace(/^#/, '0x');
function getStaticMapUrl({height, width, markers, path, zoom, maptype = 'satellite'}: Input) {
  const queryParams = {
    zoom: zoom ?? (markers && 12),
    path:
      path &&
      `${pipe({
        color: path.color ?? defaultColor,
        fillcolor: path.fillcolor ?? defaultColor,
        weight: path.weight ?? 1,
      })}|${path.coordinates.map(joinCoordinate).join('|')}`,
    // NOTE: Support multiple markers
    center: markers && `${joinCoordinate(markers[0].coordinate)}`,
    markers: markers && `color:${defaultColor}|${joinCoordinate(markers[0].coordinate)}`,
    size: `${Math.floor(width)}x${Math.floor(height)}`,
    scale: 2,
    maptype,
    key: API_KEY,
  };

  return `${baseUrl}?${qs.stringify(queryParams)}`;
}

export function getStaticMapboxUrl(long, lat, width, height, zoom = 15) {
  return `${baseUrl}/pin-s-l+000(${long},${lat})/${long},${lat},${zoom}/${width}x${height}?access_token=${API_KEY}`;
}

export function getStaticMapboxUrlWithoutMarker(long, lat, width, height) {
  return `${baseUrl}/${long},${lat},14.25,0,0/${width}x${height}?access_token=${API_KEY}`;
}

export default getStaticMapUrl;
