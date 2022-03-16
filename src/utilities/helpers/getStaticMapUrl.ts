const baseUrl = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static';

export function getStaticMapboxUrl(accessToken: string, long, lat, width, height, zoom = 15) {
  return `${baseUrl}/pin-s-l+000(${long},${lat})/${long},${lat},${zoom}/${width}x${height}?access_token=${accessToken}`;
}

export function getStaticMapboxUrlWithoutMarker(accessToken: string, long, lat, width, height) {
  return `${baseUrl}/${long},${lat},14.25,0,0/${width}x${height}?access_token=${accessToken}`;
}
