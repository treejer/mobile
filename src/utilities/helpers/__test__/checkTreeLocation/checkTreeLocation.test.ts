import {checkTreeLocation} from 'utilities/helpers/checkTreeLocation/checkTreeLocation';
import {BrowserPlatform} from 'utilities/hooks/useBrowserPlatform';
import {AlertMode} from 'utilities/helpers/alert';
import {JourneyMetadata} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';

describe('checkTreeLocation', () => {
  it('checkTreeLocation should be defined', () => {
    expect(checkTreeLocation).toBeDefined();
    expect(typeof checkTreeLocation).toBe('function');
  });

  const locationOne = {
    latitude: 20000,
    longitude: 20000,
  };

  const withoutCoords = {
    latitude: 0,
    longitude: 0,
  };

  it('checkTreeLocation browserPlatform === iOS', async () => {
    await expect(
      checkTreeLocation({
        isUpdate: false,
        photoLocation: locationOne,
        submittedLocation: withoutCoords,
        checkMetaData: true,
        browserPlatform: BrowserPlatform.iOS,
      }),
    ).resolves.toEqual(withoutCoords);
    await expect(
      checkTreeLocation({
        isUpdate: false,
        photoLocation: locationOne,
        submittedLocation: locationOne,
        checkMetaData: true,
        browserPlatform: BrowserPlatform.iOS,
      }),
    ).resolves.toEqual(locationOne);
    await expect(
      checkTreeLocation({
        isUpdate: true,
        photoLocation: locationOne,
        submittedLocation: locationOne,
        checkMetaData: false,
        browserPlatform: BrowserPlatform.iOS,
      }),
    ).resolves.toEqual(locationOne);
  });

  it('checkTreeLocation checkMetaData === false', async () => {
    await expect(
      checkTreeLocation({
        isUpdate: true,
        photoLocation: locationOne,
        submittedLocation: locationOne,
        checkMetaData: false,
        browserPlatform: BrowserPlatform.iOS,
      }),
    ).resolves.toEqual(locationOne);
    await expect(
      checkTreeLocation({
        isUpdate: true,
        photoLocation: locationOne,
        submittedLocation: withoutCoords,
        checkMetaData: false,
        browserPlatform: BrowserPlatform.Android,
      }),
    ).resolves.toEqual(withoutCoords);
    await expect(
      checkTreeLocation({
        isUpdate: false,
        photoLocation: locationOne,
        submittedLocation: withoutCoords,
        checkMetaData: false,
        browserPlatform: BrowserPlatform.Android,
      }),
    ).resolves.toEqual(withoutCoords);
  });

  it('checkTreeLocation valid distance', async () => {
    await expect(
      checkTreeLocation({
        isUpdate: false,
        photoLocation: locationOne,
        submittedLocation: locationOne,
        browserPlatform: BrowserPlatform.Android,
        checkMetaData: true,
      }),
    ).resolves.toEqual(locationOne);
  });

  it('checkTreeLocation invalid distance plant', async () => {
    await expect(
      checkTreeLocation({
        isUpdate: false,
        photoLocation: locationOne,
        submittedLocation: withoutCoords,
        browserPlatform: BrowserPlatform.Android,
        checkMetaData: true,
      }),
    ).rejects.toEqual({
      title: 'map.newTree.errTitle',
      mode: AlertMode.Error,
      message: 'map.newTree.errMessage',
    });
  });

  it('checkTreeLocation invalid distance update', async () => {
    await expect(
      checkTreeLocation({
        isUpdate: true,
        photoLocation: locationOne,
        submittedLocation: withoutCoords,
        browserPlatform: BrowserPlatform.Android,
        checkMetaData: true,
      }),
    ).rejects.toEqual({
      title: 'map.updateSingleTree.errTitle',
      mode: AlertMode.Error,
      message: 'map.updateSingleTree.errMessage',
    });
    await expect(
      checkTreeLocation({
        isUpdate: true,
        photoLocation: locationOne,
        submittedLocation: withoutCoords,
        browserPlatform: BrowserPlatform.Android,
        checkMetaData: true,
        inCheck: true,
      }),
    ).rejects.toEqual({
      data: JourneyMetadata.Location,
      title: 'map.updateSingleTree.errTitle',
      mode: AlertMode.Error,
      message: 'map.updateSingleTree.errMessage',
    });
  });
});
