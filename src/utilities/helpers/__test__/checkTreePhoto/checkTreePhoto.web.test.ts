import {checkTreePhoto} from 'utilities/helpers/checkTreePhoto/checkTreePhoto.web';
import {BrowserPlatform} from 'utilities/hooks/useBrowserPlatform';
import {AlertMode} from 'utilities/helpers/alert';
import {imageBase64} from 'utilities/helpers/__test__/checkTreePhoto/checkTreePhoto.mock';
import {JourneyMetadata} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';

describe('checkTreePhoto.web', () => {
  it('checkTreePhoto.web should be defined', () => {
    expect(checkTreePhoto).toBeDefined();
    expect(typeof checkTreePhoto).toBe('function');
  });

  describe('checkTreePhoto.web resolve', () => {
    it('checkMetaData = false', async () => {
      await expect(
        checkTreePhoto({
          checkMetaData: false,
          userLocation: {latitude: 20000, longitude: 50000},
          imageCoords: {latitude: 0, longitude: 0},
          options: {
            fromGallery: true,
            imageBase64: '',
            browserPlatform: BrowserPlatform.iOS,
          },
        }),
      ).resolves.toEqual({latitude: 0, longitude: 0});
    });
    it('browserPlatform = iOS', async () => {
      await expect(
        checkTreePhoto({
          checkMetaData: true,
          userLocation: {latitude: 20000, longitude: 50000},
          imageCoords: {latitude: 0, longitude: 0},
          options: {
            fromGallery: true,
            imageBase64: '',
            browserPlatform: BrowserPlatform.iOS,
          },
        }),
      ).resolves.toEqual({latitude: 0, longitude: 0});
    });
    it('check distance', async () => {
      await expect(
        checkTreePhoto({
          checkMetaData: true,
          userLocation: {latitude: 43.46744833333334, longitude: 11.885126666663888},
          imageCoords: {latitude: 0, longitude: 0},
          options: {
            fromGallery: true,
            imageBase64,
            browserPlatform: BrowserPlatform.Android,
          },
        }),
      ).resolves.toEqual({latitude: 43.46744833333334, longitude: 11.885126666663888});
    });
  });

  describe('checkTreePhoto.web reject', () => {
    it('distance is too much', async () => {
      await expect(
        checkTreePhoto({
          checkMetaData: true,
          userLocation: {latitude: 200000, longitude: 50000},
          imageCoords: {latitude: 0, longitude: 0},
          options: {
            fromGallery: true,
            imageBase64,
            browserPlatform: BrowserPlatform.Android,
          },
        }),
      ).rejects.toEqual({
        title: 'inValidImage.title',
        message: 'inValidImage.longDistance',
        mode: AlertMode.Error,
      });
    });
    it('one of the coords details not exist should catch error', async () => {
      await expect(
        checkTreePhoto({
          checkMetaData: true,
          userLocation: {latitude: 0, longitude: 0},
          imageCoords: {latitude: 0, longitude: 0},
          options: {
            fromGallery: true,
            imageBase64: '',
            browserPlatform: BrowserPlatform.Android,
          },
        }),
      ).rejects.toEqual({
        title: 'inValidImage.title',
        mode: AlertMode.Error,
        message: 'inValidImage.message',
      });

      await expect(
        checkTreePhoto({
          checkMetaData: true,
          userLocation: {latitude: 0, longitude: 0},
          imageCoords: {latitude: 0, longitude: 0},
          options: {
            fromGallery: false,
            imageBase64: '',
            browserPlatform: BrowserPlatform.Android,
            inCheck: true,
          },
        }),
      ).rejects.toEqual({
        data: JourneyMetadata.Photo,
        title: 'inValidImage.title',
        mode: AlertMode.Error,
        message: 'inValidImage.hasNoLocation',
      });
    });
  });
});
