import {checkTreePhoto} from 'utilities/helpers/checkTreePhoto/checkTreePhoto';
import {AlertMode} from 'utilities/helpers/alert';
import {JourneyMetadata} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';

describe('checkTreePhoto', () => {
  it('checkTreePhoto should be defined', () => {
    expect(checkTreePhoto).toBeDefined();
    expect(typeof checkTreePhoto).toBe('function');
  });

  describe('checkTreePhoto resolve', () => {
    it('checkMetaData = false', async () => {
      await expect(
        checkTreePhoto({
          checkMetaData: false,
          userLocation: {latitude: 20000, longitude: 50000},
          imageCoords: {latitude: 20000, longitude: 50000},
          options: {
            fromGallery: true,
          },
        }),
      ).resolves.toEqual({latitude: 0, longitude: 0});
    });
    it('checkMetaData = true', async () => {
      await expect(
        checkTreePhoto({
          checkMetaData: true,
          userLocation: {latitude: 20000, longitude: 50000},
          imageCoords: {latitude: 20000, longitude: 50000},
          options: {
            fromGallery: true,
          },
        }),
      ).resolves.toEqual({latitude: 20000, longitude: 50000});
    });
  });

  describe('checkTreePhoto reject', () => {
    it('distance is too much', async () => {
      await expect(
        checkTreePhoto({
          checkMetaData: true,
          userLocation: {latitude: 20000, longitude: 50000},
          imageCoords: {latitude: 2200000, longitude: 1900000},
          options: {
            fromGallery: true,
          },
        }),
      ).rejects.toEqual({
        title: 'inValidImage.title',
        message: 'inValidImage.longDistance',
        mode: AlertMode.Error,
      });
    });
    it('one of the coords detail not exist should catch error', async () => {
      await expect(
        checkTreePhoto({
          checkMetaData: true,
          userLocation: {latitude: 0, longitude: 0},
          imageCoords: {latitude: 0, longitude: 0},
          options: {
            fromGallery: true,
          },
        }),
      ).rejects.toEqual({
        title: 'inValidImage.title',
        message: 'inValidImage.message',
        mode: AlertMode.Error,
      });

      await expect(
        checkTreePhoto({
          checkMetaData: true,
          userLocation: {latitude: 0, longitude: 0},
          imageCoords: {latitude: 0, longitude: 0},
          options: {
            fromGallery: false,
          },
        }),
      ).rejects.toEqual({
        title: 'inValidImage.title',
        message: 'inValidImage.hasNoLocation',
        mode: AlertMode.Error,
      });

      await expect(
        checkTreePhoto({
          checkMetaData: true,
          userLocation: {latitude: 0, longitude: 0},
          imageCoords: {latitude: 0, longitude: 0},
          options: {
            fromGallery: false,
            inCheck: true,
          },
        }),
      ).rejects.toEqual({
        data: JourneyMetadata.Photo,
        title: 'inValidImage.title',
        message: 'inValidImage.hasNoLocation',
        mode: AlertMode.Error,
      });
    });
  });
});
