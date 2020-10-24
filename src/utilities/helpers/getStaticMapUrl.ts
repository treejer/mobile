const API_KEY = '6782187b9b6347d68d15a4edf6fe4cf2';

function getStaticMapUrl({lat, lon, zoom = 14}: {lat: number; lon: number; zoom?: number}) {
  return `https://maps.geoapify.com/v1/staticmap?style=klokantech-basic&width=600&height=240&center=lonlat:${lat},${lon}&zoom=${zoom}&apiKey=${API_KEY}`;
}

export default getStaticMapUrl;
