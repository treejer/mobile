import {allCoordsAreExist} from 'utilities/helpers/allCoordsAreExist';

describe('allCoordsInExist', () => {
  it('allCoordsAreExist should be defined', () => {
    expect(allCoordsAreExist).toBeDefined();
    expect(typeof allCoordsAreExist).toBe('function');
  });

  const coordsOne = {
    latitude: 0,
    longitude: 0,
  };

  const coordsTwo = {
    latitude: 123213,
    longitude: 112313,
  };

  it('all Coords are exist', () => {
    expect(allCoordsAreExist({imageCoords: coordsTwo, userLocation: coordsTwo})).toBe(true);
  });

  it('all Coords are not exist', () => {
    expect(allCoordsAreExist({imageCoords: coordsOne, userLocation: coordsOne})).toBe(false);
  });

  it('one of the Coords is not exist (imageCoords)', () => {
    expect(allCoordsAreExist({imageCoords: coordsOne, userLocation: coordsTwo})).toBe(false);
  });

  it('one of the Coords is not exist (userLocation)', () => {
    expect(allCoordsAreExist({imageCoords: coordsTwo, userLocation: coordsOne})).toBe(false);
  });
});
