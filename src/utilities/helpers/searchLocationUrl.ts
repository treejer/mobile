import {mapboxPublicToken} from 'services/config';

export function searchLocationUrl(search: string) {
  return `https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?proximity=ip&access_token=${mapboxPublicToken}`;
}
