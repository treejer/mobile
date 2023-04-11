import {put, select, takeEvery} from 'redux-saga/effects';
import * as assert from 'assert';

import {
  currentJourneySagas,
  getBrowserPlatform,
  getCurrentJourney,
  getSettings,
  watchAssignJourneyTreeLocation,
  watchAssignJourneyTreePhoto,
} from 'ranger-redux/modules/currentJourney/currentJourney.saga';
import * as actionsList from 'ranger-redux/modules/currentJourney/currentJourney.action';
import {onBoardingOne} from '../../../../../assets/images';
import {BrowserPlatform} from 'utilities/hooks/useBrowserPlatform';
import {checkTreePhoto} from 'utilities/helpers/checkTreePhoto/checkTreePhoto';
import {TPoint} from 'utilities/helpers/distanceInMeters';
import {TUserLocation} from 'utilities/hooks/usePlantTreePermissions';
import {canUpdateTreeLocation} from 'utilities/helpers/submitTree';
import {AlertMode, showSagaAlert} from 'utilities/helpers/alert';
import {checkTreeLocation} from 'utilities/helpers/checkTreeLocation/checkTreeLocation';

describe('currentJourney sagas', () => {
  it('functions should be defined', () => {
    expect(currentJourneySagas).toBeDefined();
    expect(watchAssignJourneyTreePhoto).toBeDefined();
    expect(watchAssignJourneyTreeLocation).toBeDefined();
  });

  it('currentJourney sagas', () => {
    const gen = currentJourneySagas();
    assert.deepEqual(
      gen.next().value,
      takeEvery(actionsList.ASSIGN_JOURNEY_TREE_PHOTO_WATCHER, watchAssignJourneyTreePhoto),
    );
    assert.deepEqual(
      gen.next().value,
      takeEvery(actionsList.ASSIGN_JOURNEY_TREE_LOCATION_WATCHER, watchAssignJourneyTreeLocation),
    );
  });

  describe('watchAssignJourneyTreePhoto', () => {
    it('watchAssignJourneyTreePhoto success, with location', () => {
      const photoLocation = {
        latitude: 20000,
        longitude: 50000,
      };
      const userLocation = {
        latitude: 20000,
        longitude: 50000,
      };
      const gen = watchAssignJourneyTreePhoto({
        photo: onBoardingOne,
        photoLocation,
        userLocation,
        fromGallery: false,
        type: actionsList.ASSIGN_JOURNEY_TREE_PHOTO_WATCHER,
      });

      let next = gen.next();
      assert.deepEqual(next.value, select(getSettings), 'select settings');

      const settingsMockData = {checkMetaData: true, locale: 'en', showSupportChat: false, releaseDate: 231231231321};
      //@ts-ignore
      next = gen.next(settingsMockData);
      assert.deepEqual(next.value, select(getBrowserPlatform), 'select browser platform'); //

      const browserPlatformMockData = {
        platform: BrowserPlatform.Android,
      };

      //@ts-ignore
      next = gen.next({...settingsMockData, ...browserPlatformMockData});

      assert.deepEqual(next.value, select(getCurrentJourney));

      const currentJourneyMockData = {
        isUpdate: false,
        isNursery: false,
        isSingle: true,
        location: userLocation,
      };

      //@ts-ignore
      next = gen.next({...settingsMockData, ...browserPlatformMockData, ...currentJourneyMockData});
      assert.deepEqual(
        next.value,
        checkTreePhoto({
          imageCoords: photoLocation as TPoint,
          userLocation: userLocation as TUserLocation,
          checkMetaData: true,
          options: {
            imageBase64: '',
            browserPlatform: BrowserPlatform.Android,
            fromGallery: false,
          },
        }),
      );

      //@ts-ignore
      next = gen.next(photoLocation);
      assert.deepEqual(
        next.value,
        checkTreePhoto({
          imageCoords: photoLocation as TPoint,
          userLocation: userLocation as TUserLocation,
          checkMetaData: true,
          options: {
            imageBase64: '',
            browserPlatform: BrowserPlatform.Android,
            fromGallery: false,
          },
        }),
      );

      const discardUpdateLocation =
        currentJourneyMockData.isUpdate &&
        canUpdateTreeLocation(currentJourneyMockData, !!currentJourneyMockData?.isNursery);

      //@ts-ignore
      next = gen.next(photoLocation);
      assert.deepEqual(
        next.value,
        put(actionsList.setTreePhoto({photo: onBoardingOne, photoLocation, discardUpdateLocation})),
      );
    });

    it('watchAssignJourneyTreePhoto success, without location', () => {
      const photoLocation = {
        latitude: 20000,
        longitude: 50000,
      };
      const userLocation = {
        latitude: 20000,
        longitude: 50000,
      };
      const gen = watchAssignJourneyTreePhoto({
        photo: onBoardingOne,
        photoLocation,
        userLocation,
        fromGallery: false,
        type: actionsList.ASSIGN_JOURNEY_TREE_PHOTO_WATCHER,
      });

      let next = gen.next();
      assert.deepEqual(next.value, select(getSettings), 'select settings');

      const settingsMockData = {checkMetaData: true, locale: 'en', showSupportChat: false, releaseDate: 231231231321};
      //@ts-ignore
      next = gen.next(settingsMockData);
      assert.deepEqual(next.value, select(getBrowserPlatform), 'select browser platform'); //

      const browserPlatformMockData = {
        platform: BrowserPlatform.Android,
      };

      //@ts-ignore
      next = gen.next({...settingsMockData, ...browserPlatformMockData});

      assert.deepEqual(next.value, select(getCurrentJourney));

      const currentJourneyMockData = {
        isUpdate: false,
        isNursery: false,
        isSingle: true,
      };

      //@ts-ignore
      next = gen.next({...settingsMockData, ...browserPlatformMockData, ...currentJourneyMockData});
      assert.deepEqual(
        next.value,
        checkTreePhoto({
          imageCoords: photoLocation as TPoint,
          userLocation: userLocation as TUserLocation,
          checkMetaData: true,
          options: {
            imageBase64: '',
            browserPlatform: BrowserPlatform.Android,
            fromGallery: false,
          },
        }),
      );

      const discardUpdateLocation =
        currentJourneyMockData.isUpdate &&
        canUpdateTreeLocation(currentJourneyMockData, !!currentJourneyMockData?.isNursery);

      //@ts-ignore
      next = gen.next(photoLocation);
      assert.deepEqual(
        next.value,
        put(actionsList.setTreePhoto({photo: onBoardingOne, photoLocation, discardUpdateLocation})),
      );
    });

    it('watchAssignJourneyTreePhoto catch', () => {
      const photoLocation = {
        latitude: 0,
        longitude: 0,
      };
      const userLocation = {
        latitude: 0,
        longitude: 0,
      };
      const gen = watchAssignJourneyTreePhoto({
        photo: onBoardingOne,
        photoLocation,
        userLocation,
        fromGallery: false,
        type: actionsList.ASSIGN_JOURNEY_TREE_PHOTO_WATCHER,
      });

      gen.next();

      const error = {
        title: 'inValidImage.title',
        mode: AlertMode.Error,
        message: 'inValidImage.hasNoLocation',
      };
      assert.deepEqual(gen.throw(error).value, showSagaAlert(error));
    });
  });
  describe('watchAssignJourneyTreeLocation', () => {
    it('watchAssignJourneyTreeLocation success, without photo', () => {
      const location = {
        latitude: 20000,
        longitude: 3133321,
      };
      const gen = watchAssignJourneyTreeLocation({type: actionsList.ASSIGN_JOURNEY_TREE_LOCATION_WATCHER, location});

      let next = gen.next();
      assert.deepEqual(next.value, select(getSettings), 'select settings');

      const settingsState = {
        checkMetaData: true,
      };
      //@ts-ignore
      next = gen.next({...settingsState});
      assert.deepEqual(next.value, select(getBrowserPlatform), 'select browser platform');

      const browserPlatform = {
        platform: BrowserPlatform.Android,
      };
      //@ts-ignore
      next = gen.next({...settingsState, ...browserPlatform});
      assert.deepEqual(next.value, select(getCurrentJourney), 'select current journey');

      const currentJourney = {
        isUpdate: false,
        isNursery: false,
        isSingle: true,
        photo: undefined,
        photoLocation: undefined,
      };

      //@ts-ignore
      next = gen.next(location);
      assert.deepEqual(next.value, put(actionsList.setTreeLocation({coords: location})), 'set tree location');
    });

    it('watchAssignJourneyTreeLocation success, with photo', () => {
      const location = {
        latitude: 20000,
        longitude: 3133321,
      };
      const gen = watchAssignJourneyTreeLocation({type: actionsList.ASSIGN_JOURNEY_TREE_LOCATION_WATCHER, location});

      let next = gen.next();
      assert.deepEqual(next.value, select(getSettings), 'select settings');

      const settingsState = {
        checkMetaData: true,
      };
      //@ts-ignore
      next = gen.next({...settingsState});
      assert.deepEqual(next.value, select(getBrowserPlatform), 'select browser platform');

      const browserPlatform = {
        platform: BrowserPlatform.Android,
      };
      //@ts-ignore
      next = gen.next({...settingsState, ...browserPlatform});
      assert.deepEqual(next.value, select(getCurrentJourney), 'select current journey');

      const currentJourney = {
        isUpdate: false,
        isNursery: false,
        isSingle: true,
        photoLocation: location,
      };
      //@ts-ignore
      next = gen.next({...settingsState, ...browserPlatform, ...currentJourney});
      assert.deepEqual(
        next.value,
        checkTreeLocation({
          checkMetaData: settingsState.checkMetaData,
          browserPlatform: browserPlatform.platform,
          submittedLocation: location,
          photoLocation: location,
          isUpdate: currentJourney.isUpdate,
        }),
        'yield checkTreeLocation',
      );

      //@ts-ignore
      next = gen.next(location);
      assert.deepEqual(next.value, put(actionsList.setTreeLocation({coords: location})), 'set tree location');
    });

    it('watchAssignJourneyTreeLocation catch', () => {
      const location = {
        latitude: 0,
        longitude: 0,
      };
      const gen = watchAssignJourneyTreeLocation({type: actionsList.ASSIGN_JOURNEY_TREE_LOCATION_WATCHER, location});

      gen.next();

      const error = {
        title: 'map.newTree.errTitle',
        mode: AlertMode.Error,
        message: 'map.newTree.errMessage',
      };

      assert.deepEqual(gen.throw(error).value, showSagaAlert(error));
    });
  });
});
