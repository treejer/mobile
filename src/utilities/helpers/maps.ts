import axios from 'axios';

export const getAreaName = async (coords: number[], mapboxToken: string) => {
  try {
    const {data} = await axios({
      method: 'GET',
      url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords[0]},${coords[1]}.json?types=place&access_token=${mapboxToken}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (data && data.features && data.features[0]) {
      return Promise.resolve(data.features[0].place_name);
    } else {
      return 'Unknown';
    }
  } catch (e) {
    return Promise.reject(e);
  }
};
