import {searchLocationUrl} from 'utilities/helpers/searchLocationUrl';
import {mapboxPublicToken} from 'services/config';

describe('searchLocationUrl', () => {
  it('should return correct url', () => {
    expect(searchLocationUrl('city')).toBe(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/city.json?proximity=ip&access_token=${mapboxPublicToken}`,
    );
  });
});
