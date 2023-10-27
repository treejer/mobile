import * as assert from 'assert';
import {put, select, take, takeEvery} from 'redux-saga/effects';

import {onBoardingOne} from '../../../../../assets/images';
import {BrowserPlatform} from 'utilities/hooks/useBrowserPlatform';
import {checkTreePhoto} from 'utilities/helpers/checkTreePhoto/checkTreePhoto';
import {TPoint} from 'utilities/helpers/distanceInMeters';
import {TUserLocation} from 'utilities/hooks/usePlantTreePermissions';
import {assignedTreeJSON, canUpdateTreeLocation, newTreeJSON, updateTreeJSON} from 'utilities/helpers/submitTree';
import {AlertMode, showSagaAlert} from 'utilities/helpers/alert';
import {checkTreeLocation} from 'utilities/helpers/checkTreeLocation/checkTreeLocation';
import {upload, uploadContent} from 'utilities/helpers/IPFS';
import {generateTreeFactorySignature, TreeFactoryMethods} from 'utilities/helpers/submissionUtilsV2';
import {currentTimestamp} from 'utilities/helpers/date';
import {changeCheckMetaData, getSettings} from 'ranger-redux/modules/settings/settings';
import {getBrowserPlatform} from 'ranger-redux/modules/browserPlatform/browserPlatform.reducer';
import {
  currentJourneySagas,
  getCurrentJourney,
  watchAssignJourneyTreeLocation,
  watchAssignJourneyTreePhoto,
  watchSubmitJourney,
} from 'ranger-redux/modules/currentJourney/currentJourney.saga';
import {getProfile, profileActions} from 'ranger-redux/modules/profile/profile';
import {getConfig, getMagic, getWallet} from 'ranger-redux/modules/web3/web3';
import {
  mockConfig,
  mockPlantJourneyWithDraftId,
  mockPlantJourneyWithoutDraftId,
  mockMagic,
  mockProfile,
  mockWallet,
  mockUpdateJourneyWithDraftId,
  mockUpdateJourneyWithoutDraftId,
  mockAssignedJourneyWithDraftId,
  mockAssignedJourneyWithoutDraftId,
  mockMainnetConfig,
} from 'ranger-redux/modules/__test__/currentJourney/currentJourney.mock';
import {plantTreeActions, plantTreeActionTypes} from 'ranger-redux/modules/submitTreeEvents/plantTree';
import {removeDraftedJourney} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.action';
import {clearJourney} from 'ranger-redux/modules/currentJourney/currentJourney.action';
import {treeDetailsActions, treeDetailsActionTypes} from 'ranger-redux/modules/trees/treeDetails';
import {treeDetail} from 'ranger-redux/modules/__test__/currentJourney/mock';
import {updateTreeActions, updateTreeActionTypes} from 'ranger-redux/modules/submitTreeEvents/updateTree';
import {assignedTreeActions, assignedTreeActionTypes} from 'ranger-redux/modules/submitTreeEvents/assignedTree';
import {plantedTreesActions, plantedTreesActionTypes} from 'ranger-redux/modules/trees/plantedTrees';
import {updatedTreesActions, updatedTreesActionTypes} from 'ranger-redux/modules/trees/updatedTrees';
import {assignedTreesActions, assignedTreesActionTypes} from 'ranger-redux/modules/trees/assignedTrees';
import * as actionsList from 'ranger-redux/modules/currentJourney/currentJourney.action';
import {pendingTreeIdsActions, pendingTreeIdsActionTypes} from 'ranger-redux/modules/trees/pendingTreeIds';
import * as navigation from 'navigation/navigationRef';
import {Routes} from 'navigation/Navigation';
import {getNetInfo} from 'ranger-redux/modules/netInfo/netInfo';

describe('currentJourney sagas', () => {
  it('functions should be defined', () => {
    expect(currentJourneySagas).toBeDefined();
    expect(watchAssignJourneyTreePhoto).toBeDefined();
    expect(watchAssignJourneyTreeLocation).toBeDefined();
    expect(watchSubmitJourney).toBeDefined();
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
    assert.deepEqual(gen.next().value, takeEvery(actionsList.SUBMIT_JOURNEY_WATCHER, watchSubmitJourney));
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
      assert.deepEqual(next.value, select(getBrowserPlatform), 'select browser platform');

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
        checkTreeLocation({
          photoLocation,
          isUpdate: currentJourneyMockData.isUpdate,
          inCheck: true,
          submittedLocation: currentJourneyMockData.location,
          checkMetaData: true,
          browserPlatform: browserPlatformMockData.platform,
        }),
      );

      //@ts-ignore
      next = gen.next(photoLocation);
      assert.deepEqual(next.value, put(actionsList.setTreePhoto({photo: onBoardingOne, photoLocation})));
      //@ts-ignore
      next = gen.next(photoLocation);
      assert.deepEqual(next.value, undefined);
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
      assert.deepEqual(next.value, put(actionsList.setTreePhoto({photo: onBoardingOne, photoLocation})));
      expect(gen.next()).not.toBe(undefined);
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
  describe('watchSubmitJourney', () => {
    it('plant tree with draftId', () => {
      const gen = watchSubmitJourney();

      assert.deepEqual(gen.next().value, select(getCurrentJourney), 'should select current journey');
      assert.deepEqual(gen.next(mockPlantJourneyWithDraftId).value, select(getProfile), 'should select profile');
      assert.deepEqual(
        gen.next({...mockProfile, ...mockPlantJourneyWithDraftId}).value,
        select(getMagic),
        'should select magic',
      );
      assert.deepEqual(
        gen.next({...mockPlantJourneyWithDraftId, ...mockProfile, ...mockMagic}).value,
        select(getConfig),
        'should select config',
      );
      assert.deepEqual(
        gen.next({...mockPlantJourneyWithDraftId, ...mockProfile, ...mockConfig, ...mockMagic, wallet: mockWallet})
          .value,
        select(getWallet),
        'should select wallet',
      );
      assert.deepEqual(
        gen.next({...mockPlantJourneyWithDraftId, ...mockProfile, ...mockConfig, ...mockMagic, wallet: mockWallet})
          .value,
        select(getNetInfo),
        'should select netInfo',
      );

      const selectedData = {
        ...mockPlantJourneyWithDraftId,
        ...mockProfile,
        ...mockConfig,
        ...mockMagic,
        wallet: mockWallet,
      };

      assert.deepEqual(
        gen.next(selectedData).value,
        upload(mockConfig.ipfsPostURL, 'storage://file'),
        'should upload file and receive uploadData',
      );

      const jsonData = newTreeJSON(mockConfig.ipfsGetURL, {
        journey: mockPlantJourneyWithDraftId,
        photoUploadHash: 'https://www.file.com',
      });

      assert.deepEqual(
        gen.next({Hash: 'https://www.file.com'}).value,
        newTreeJSON(mockConfig.ipfsGetURL, {
          journey: mockPlantJourneyWithDraftId,
          photoUploadHash: 'https://www.file.com',
        }),
        'should execute treeSpecs',
      );

      assert.deepEqual(
        gen.next(jsonData).value,
        uploadContent(mockConfig.ipfsPostURL, JSON.stringify(jsonData)),
        'should upload treeSpecs to IPFS',
      );

      const currentTimestamp1 = currentTimestamp();

      assert.deepEqual(
        gen.next({Hash: 'HASH'}).value,
        generateTreeFactorySignature({
          wallet: mockWallet,
          config: mockConfig,
          magic: mockMagic as any,
          method: TreeFactoryMethods.PlantTree,
          requestParams: {
            countryCode: 0,
            birthDate: currentTimestamp1,
            nonce: +mockProfile?.plantingNonce!,
            treeSpecs: JSON.stringify(jsonData),
          },
        }),
        'should generate signature',
      );
      assert.deepEqual(
        gen.next('signature').value,
        put(
          plantTreeActions.load({
            signature: 'signature',
            birthDate: currentTimestamp1,
            treeSpecs: 'HASH',
            treeSpecsJSON: JSON.stringify(jsonData),
          }),
        ),
        'should dispatch plantTree',
      );
      assert.deepEqual(
        gen.next().value,
        take(plantTreeActionTypes.loadSuccess),
        'should wait to plantTree request success response',
      );
      assert.deepEqual(
        gen.next().value,
        put(plantedTreesActions.load()),
        'should dispatch plantedTreesActions load action',
      );
      assert.deepEqual(
        gen.next().value,
        take([plantedTreesActionTypes.loadSuccess, plantedTreesActionTypes.loadFailure]),
        'should wait for the result of the plantedTreesActions load action',
      );
      assert.deepEqual(
        gen.next().value,
        put(pendingTreeIdsActions.load()),
        'should dispatch pendingTreeIdsActions load action',
      );
      assert.deepEqual(
        gen.next().value,
        take([pendingTreeIdsActionTypes.loadSuccess, pendingTreeIdsActionTypes.loadFailure]),
        'should wait for the result of the pendingTreeIdsActions load action',
      );
      assert.deepEqual(
        gen.next(mockPlantJourneyWithDraftId).value,
        showSagaAlert({
          title: 'success',
          message: 'submitTree.submitted',
          mode: AlertMode.Success,
          alertOptions: {
            translate: true,
          },
        }),
        'should show alert',
      );
      assert.deepEqual(
        gen.next(mockPlantJourneyWithDraftId).value,
        put(removeDraftedJourney({id: mockPlantJourneyWithDraftId.draftId})),
        'should remove drafted item',
      );
      assert.deepEqual(gen.next().value, put(clearJourney()), 'should clear current journey data');
      assert.deepEqual(gen.next().value, put(profileActions.load()), 'should dispatch profileAction.load');
    });
    it('plant tree without draftId', () => {
      const gen = watchSubmitJourney();

      assert.deepEqual(gen.next().value, select(getCurrentJourney), 'should select current journey');
      assert.deepEqual(gen.next(mockPlantJourneyWithoutDraftId).value, select(getProfile), 'should select profile');
      assert.deepEqual(
        gen.next({...mockProfile, ...mockPlantJourneyWithoutDraftId}).value,
        select(getMagic),
        'should select magic',
      );
      assert.deepEqual(
        gen.next({...mockPlantJourneyWithoutDraftId, ...mockProfile, ...mockMagic}).value,
        select(getConfig),
        'should select config',
      );
      assert.deepEqual(
        gen.next({...mockPlantJourneyWithoutDraftId, ...mockProfile, ...mockConfig, ...mockMagic, wallet: mockWallet})
          .value,
        select(getWallet),
        'should select wallet',
      );
      assert.deepEqual(
        gen.next({...mockPlantJourneyWithDraftId, ...mockProfile, ...mockConfig, ...mockMagic, wallet: mockWallet})
          .value,
        select(getNetInfo),
        'should select netInfo',
      );

      const selectedData = {
        ...mockPlantJourneyWithoutDraftId,
        ...mockProfile,
        ...mockConfig,
        ...mockMagic,
        wallet: mockWallet,
      };
      assert.deepEqual(
        gen.next(selectedData).value,
        upload(mockConfig.ipfsPostURL, 'storage://file'),
        'should upload file and receive uploadData',
      );

      const jsonData = newTreeJSON(mockConfig.ipfsGetURL, {
        journey: mockPlantJourneyWithoutDraftId,
        photoUploadHash: 'https://www.file.com',
      });

      assert.deepEqual(
        gen.next({Hash: 'https://www.file.com'}).value,
        newTreeJSON(mockConfig.ipfsGetURL, {
          journey: mockPlantJourneyWithoutDraftId,
          photoUploadHash: 'https://www.file.com',
        }),
        'should execute treeSpecs',
      );

      assert.deepEqual(
        gen.next(jsonData).value,
        uploadContent(mockConfig.ipfsPostURL, JSON.stringify(jsonData)),
        'should upload treeSpecs to IPFS',
      );

      const currentTimestamp1 = currentTimestamp();

      assert.deepEqual(
        gen.next({Hash: 'HASH'}).value,
        generateTreeFactorySignature({
          wallet: mockWallet,
          config: mockConfig,
          magic: mockMagic as any,
          method: TreeFactoryMethods.PlantTree,
          requestParams: {
            countryCode: 0,
            birthDate: currentTimestamp1,
            nonce: +mockProfile?.plantingNonce!,
            treeSpecs: JSON.stringify(jsonData),
          },
        }),
        'should generate signature',
      );
      assert.deepEqual(
        gen.next('signature').value,
        put(
          plantTreeActions.load({
            signature: 'signature',
            birthDate: currentTimestamp1,
            treeSpecs: 'HASH',
            treeSpecsJSON: JSON.stringify(jsonData),
          }),
        ),
        'should dispatch plantTree',
      );
      assert.deepEqual(
        gen.next().value,
        take(plantTreeActionTypes.loadSuccess),
        'should wait to plantTree request success response',
      );
      assert.deepEqual(
        gen.next().value,
        put(plantedTreesActions.load()),
        'should dispatch plantedTreesActions load action',
      );
      assert.deepEqual(
        gen.next().value,
        take([plantedTreesActionTypes.loadSuccess, plantedTreesActionTypes.loadFailure]),
        'should wait for the result of the plantedTreesActions load action',
      );
      assert.deepEqual(
        gen.next().value,
        put(pendingTreeIdsActions.load()),
        'should dispatch pendingTreeIdsActions load action',
      );
      assert.deepEqual(
        gen.next().value,
        take([pendingTreeIdsActionTypes.loadSuccess, pendingTreeIdsActionTypes.loadFailure]),
        'should wait for the result of the pendingTreeIdsActions load action',
      );
      assert.deepEqual(
        gen.next(mockPlantJourneyWithoutDraftId).value,
        showSagaAlert({
          title: 'success',
          message: 'submitTree.submitted',
          mode: AlertMode.Success,
          alertOptions: {
            translate: true,
          },
        }),
        'should show alert',
      );
      assert.deepEqual(gen.next().value, put(clearJourney()), 'should clear current journey data');
      assert.deepEqual(gen.next().value, put(profileActions.load()), 'should dispatch profileAction.load');
    });
    it('update with draftId', () => {
      const gen = watchSubmitJourney();

      assert.deepEqual(gen.next().value, select(getCurrentJourney), 'should select current journey');
      assert.deepEqual(gen.next(mockUpdateJourneyWithDraftId).value, select(getProfile), 'should select profile');
      assert.deepEqual(
        gen.next({...mockProfile, ...mockUpdateJourneyWithDraftId}).value,
        select(getMagic),
        'should select magic',
      );
      assert.deepEqual(
        gen.next({...mockUpdateJourneyWithDraftId, ...mockProfile, ...mockMagic}).value,
        select(getConfig),
        'should select config',
      );
      assert.deepEqual(
        gen.next({...mockUpdateJourneyWithDraftId, ...mockProfile, ...mockConfig, ...mockMagic, wallet: mockWallet})
          .value,
        select(getWallet),
        'should select wallet',
      );
      assert.deepEqual(
        gen.next({...mockPlantJourneyWithDraftId, ...mockProfile, ...mockConfig, ...mockMagic, wallet: mockWallet})
          .value,
        select(getNetInfo),
        'should select netInfo',
      );

      const selectedData = {
        ...mockUpdateJourneyWithDraftId,
        ...mockProfile,
        ...mockConfig,
        ...mockMagic,
        wallet: mockWallet,
      };

      assert.deepEqual(
        gen.next(selectedData).value,
        put(treeDetailsActions.load({id: mockUpdateJourneyWithDraftId.treeIdToUpdate as string, inSubmission: true})),
        'should dispatch treeDetail (get tree detail)',
      );

      const updatedTreeDetail = {
        ...treeDetail,
        treeSpecsEntity: {
          ...treeDetail.treeSpecsEntity,
          updates: JSON.stringify(treeDetail.treeSpecsEntity.updates),
          locations: JSON.stringify(treeDetail.treeSpecsEntity.locations),
          attributes: JSON.stringify(treeDetail.treeSpecsEntity.attributes),
        },
      };

      assert.deepEqual(
        gen.next({payload: updatedTreeDetail}).value,
        take([treeDetailsActionTypes.loadSuccess, treeDetailsActionTypes.loadFailure]),
        'should wait to get tree detail',
      );
      assert.deepEqual(gen.next({payload: updatedTreeDetail}).value, updatedTreeDetail);

      assert.deepEqual(
        gen.next({...updatedTreeDetail, ...selectedData}).value,
        upload(mockConfig.ipfsPostURL, 'storage://file'),
        'should upload file and receive uploadData',
      );

      const jsonData = updateTreeJSON(mockConfig.ipfsGetURL, {
        journey: mockUpdateJourneyWithDraftId as any,
        tree: updatedTreeDetail as any,
        photoUploadHash: 'https://www.file.com',
      });

      assert.deepEqual(
        gen.next({...updatedTreeDetail, ...selectedData, Hash: 'https://www.file.com'}).value,
        updateTreeJSON(mockConfig.ipfsGetURL, {
          journey: mockUpdateJourneyWithDraftId as any,
          tree: updatedTreeDetail as any,
          photoUploadHash: 'https://www.file.com',
        }),
        'should execute treeSpecs',
      );

      assert.deepEqual(
        gen.next(jsonData).value,
        uploadContent(mockConfig.ipfsPostURL, JSON.stringify(jsonData)),
        'should upload treeSpecs to IPFS',
      );

      assert.deepEqual(
        gen.next({Hash: 'HASH'}).value,
        generateTreeFactorySignature({
          wallet: mockWallet,
          magic: mockMagic as any,
          method: TreeFactoryMethods.UpdateTree,
          config: mockConfig,
          requestParams: {
            treeId: Number(mockUpdateJourneyWithDraftId.treeIdToUpdate),
            nonce: +mockProfile?.plantingNonce!,
            treeSpecs: JSON.stringify(jsonData),
          },
        }),
        'should generate signature',
      );
      assert.deepEqual(
        gen.next('signature').value,
        put(
          updateTreeActions.load({
            treeId: Number(mockUpdateJourneyWithDraftId.treeIdToUpdate),
            treeSpecs: 'HASH',
            treeSpecsJSON: JSON.stringify(jsonData),
            signature: 'signature',
          }),
        ),
        'should dispatch updateTree',
      );
      assert.deepEqual(
        gen.next().value,
        take(updateTreeActionTypes.loadSuccess),
        'should wait to updateTree request success response',
      );
      assert.deepEqual(
        gen.next().value,
        put(updatedTreesActions.load()),
        'should dispatch updatedTreesActions load action',
      );
      assert.deepEqual(
        gen.next().value,
        take([updatedTreesActionTypes.loadSuccess, updatedTreesActionTypes.loadFailure]),
        'should wait for the result of the updatedTreesActions load action',
      );
      assert.deepEqual(
        gen.next().value,
        put(pendingTreeIdsActions.load()),
        'should dispatch pendingTreeIdsActions load action',
      );
      assert.deepEqual(
        gen.next().value,
        take([pendingTreeIdsActionTypes.loadSuccess, pendingTreeIdsActionTypes.loadFailure]),
        'should wait for the result of the pendingTreeIdsActions load action',
      );
      assert.deepEqual(
        gen.next(mockUpdateJourneyWithDraftId).value,
        showSagaAlert({
          title: 'success',
          message: 'submitTree.updated',
          mode: AlertMode.Success,
          alertOptions: {
            translate: true,
          },
        }),
        'should show alert',
      );
      assert.deepEqual(
        gen.next().value,
        put(removeDraftedJourney({id: mockUpdateJourneyWithDraftId.draftId})),
        'should remove drafted tree item',
      );
      assert.deepEqual(gen.next().value, put(clearJourney()), 'should clear current journey data');
      assert.deepEqual(gen.next().value, put(profileActions.load()), 'should dispatch profileAction.load');
    });
    it('update without draftId', () => {
      const gen = watchSubmitJourney();

      assert.deepEqual(gen.next().value, select(getCurrentJourney), 'should select current journey');
      assert.deepEqual(gen.next(mockUpdateJourneyWithoutDraftId).value, select(getProfile), 'should select profile');
      assert.deepEqual(
        gen.next({...mockProfile, ...mockUpdateJourneyWithoutDraftId}).value,
        select(getMagic),
        'should select magic',
      );
      assert.deepEqual(
        gen.next({...mockUpdateJourneyWithoutDraftId, ...mockProfile, ...mockMagic}).value,
        select(getConfig),
        'should select config',
      );
      assert.deepEqual(
        gen.next({...mockUpdateJourneyWithoutDraftId, ...mockProfile, ...mockConfig, ...mockMagic, wallet: mockWallet})
          .value,
        select(getWallet),
        'should select wallet',
      );
      assert.deepEqual(
        gen.next({...mockPlantJourneyWithDraftId, ...mockProfile, ...mockConfig, ...mockMagic, wallet: mockWallet})
          .value,
        select(getNetInfo),
        'should select netInfo',
      );

      const selectedData = {
        ...mockUpdateJourneyWithoutDraftId,
        ...mockProfile,
        ...mockConfig,
        ...mockMagic,
        wallet: mockWallet,
      };

      assert.deepEqual(
        gen.next(selectedData).value,
        put(
          treeDetailsActions.load({id: mockUpdateJourneyWithoutDraftId.treeIdToUpdate as string, inSubmission: true}),
        ),
        'should dispatch treeDetail (get tree detail)',
      );

      const updatedTreeDetail = {
        ...treeDetail,
        treeSpecsEntity: {
          ...treeDetail.treeSpecsEntity,
          updates: JSON.stringify(treeDetail.treeSpecsEntity.updates),
          locations: JSON.stringify(treeDetail.treeSpecsEntity.locations),
          attributes: JSON.stringify(treeDetail.treeSpecsEntity.attributes),
        },
      };

      assert.deepEqual(
        gen.next({payload: updatedTreeDetail}).value,
        take([treeDetailsActionTypes.loadSuccess, treeDetailsActionTypes.loadFailure]),
        'should wait to get tree detail',
      );

      assert.deepEqual(gen.next({payload: updatedTreeDetail}).value, updatedTreeDetail);

      assert.deepEqual(
        gen.next({...updatedTreeDetail, ...selectedData}).value,
        upload(mockConfig.ipfsPostURL, 'storage://file'),
        'should upload file and receive uploadData',
      );

      const jsonData = updateTreeJSON(mockConfig.ipfsGetURL, {
        journey: mockUpdateJourneyWithoutDraftId as any,
        tree: updatedTreeDetail as any,
        photoUploadHash: 'https://www.file.com',
      });

      assert.deepEqual(
        gen.next({...updatedTreeDetail, ...selectedData, Hash: 'https://www.file.com'}).value,
        updateTreeJSON(mockConfig.ipfsGetURL, {
          journey: mockUpdateJourneyWithoutDraftId as any,
          tree: updatedTreeDetail as any,
          photoUploadHash: 'https://www.file.com',
        }),
        'should execute treeSpecs',
      );

      assert.deepEqual(
        gen.next(jsonData).value,
        uploadContent(mockConfig.ipfsPostURL, JSON.stringify(jsonData)),
        'should upload treeSpecs to IPFS',
      );

      assert.deepEqual(
        gen.next({Hash: 'HASH'}).value,
        generateTreeFactorySignature({
          wallet: mockWallet,
          magic: mockMagic as any,
          method: TreeFactoryMethods.UpdateTree,
          config: mockConfig,
          requestParams: {
            treeId: Number(mockUpdateJourneyWithoutDraftId.treeIdToUpdate),
            nonce: +mockProfile?.plantingNonce!,
            treeSpecs: JSON.stringify(jsonData),
          },
        }),
        'should generate signature',
      );
      assert.deepEqual(
        gen.next('signature').value,
        put(
          updateTreeActions.load({
            treeId: Number(mockUpdateJourneyWithoutDraftId.treeIdToUpdate),
            treeSpecs: 'HASH',
            treeSpecsJSON: JSON.stringify(jsonData),
            signature: 'signature',
          }),
        ),
        'should dispatch updateTree',
      );
      assert.deepEqual(
        gen.next().value,
        take(updateTreeActionTypes.loadSuccess),
        'should wait to updateTree request success response',
      );
      assert.deepEqual(
        gen.next().value,
        put(updatedTreesActions.load()),
        'should dispatch updatedTreesActions load action',
      );
      assert.deepEqual(
        gen.next().value,
        take([updatedTreesActionTypes.loadSuccess, updatedTreesActionTypes.loadFailure]),
        'should wait for the result of the updatedTreesActions load action',
      );
      assert.deepEqual(
        gen.next().value,
        put(pendingTreeIdsActions.load()),
        'should dispatch pendingTreeIdsActions load action',
      );
      assert.deepEqual(
        gen.next().value,
        take([pendingTreeIdsActionTypes.loadSuccess, pendingTreeIdsActionTypes.loadFailure]),
        'should wait for the result of the pendingTreeIdsActions load action',
      );
      assert.deepEqual(
        gen.next(mockUpdateJourneyWithoutDraftId).value,
        showSagaAlert({
          title: 'success',
          message: 'submitTree.updated',
          mode: AlertMode.Success,
          alertOptions: {
            translate: true,
          },
        }),
        'should show alert',
      );
      assert.deepEqual(gen.next().value, put(clearJourney()), 'should clear current journey data');
      assert.deepEqual(gen.next().value, put(profileActions.load()), 'should dispatch profileAction.load');
    });
    it('assigned tree with draftId', () => {
      const gen = watchSubmitJourney();

      assert.deepEqual(gen.next().value, select(getCurrentJourney), 'should select current journey');
      assert.deepEqual(gen.next(mockAssignedJourneyWithDraftId).value, select(getProfile), 'should select profile');
      assert.deepEqual(
        gen.next({...mockProfile, ...mockAssignedJourneyWithDraftId}).value,
        select(getMagic),
        'should select magic',
      );
      assert.deepEqual(
        gen.next({...mockAssignedJourneyWithDraftId, ...mockProfile, ...mockMagic}).value,
        select(getConfig),
        'should select config',
      );
      assert.deepEqual(
        gen.next({...mockAssignedJourneyWithDraftId, ...mockProfile, ...mockConfig, ...mockMagic, wallet: mockWallet})
          .value,
        select(getWallet),
        'should select wallet',
      );
      assert.deepEqual(
        gen.next({...mockPlantJourneyWithDraftId, ...mockProfile, ...mockConfig, ...mockMagic, wallet: mockWallet})
          .value,
        select(getNetInfo),
        'should select netInfo',
      );

      const selectedData = {
        ...mockAssignedJourneyWithDraftId,
        ...mockProfile,
        ...mockConfig,
        ...mockMagic,
        wallet: mockWallet,
      };

      assert.deepEqual(
        gen.next(selectedData).value,
        put(treeDetailsActions.load({id: mockAssignedJourneyWithDraftId.treeIdToPlant as string, inSubmission: true})),
        'should dispatch treeDetail (get tree detail)',
      );

      const updatedTreeDetail = {
        ...treeDetail,
        treeSpecsEntity: {
          ...treeDetail.treeSpecsEntity,
          updates: JSON.stringify(treeDetail.treeSpecsEntity.updates),
          locations: JSON.stringify(treeDetail.treeSpecsEntity.locations),
          attributes: JSON.stringify(treeDetail.treeSpecsEntity.attributes),
        },
      };

      assert.deepEqual(
        gen.next({payload: updatedTreeDetail}).value,
        take([treeDetailsActionTypes.loadSuccess, treeDetailsActionTypes.loadFailure]),
        'should wait to get tree detail',
      );

      assert.deepEqual(gen.next({payload: updatedTreeDetail}).value, updatedTreeDetail);

      assert.deepEqual(
        gen.next({...updatedTreeDetail, ...selectedData}).value,
        upload(mockConfig.ipfsPostURL, 'storage://file'),
        'should upload file and receive uploadData',
      );

      const jsonData = assignedTreeJSON(mockConfig.ipfsGetURL, {
        journey: mockAssignedJourneyWithDraftId as any,
        tree: updatedTreeDetail as any,
        photoUploadHash: 'https://www.file.com',
      });

      assert.deepEqual(
        gen.next({...updatedTreeDetail, ...selectedData, Hash: 'https://www.file.com'}).value,
        assignedTreeJSON(mockConfig.ipfsGetURL, {
          journey: mockAssignedJourneyWithDraftId as any,
          tree: updatedTreeDetail as any,
          photoUploadHash: 'https://www.file.com',
        }),
        'should execute treeSpecs',
      );

      assert.deepEqual(
        gen.next(jsonData).value,
        uploadContent(mockConfig.ipfsPostURL, JSON.stringify(jsonData)),
        'should upload treeSpecs to IPFS',
      );

      const currentTimestamp1 = currentTimestamp();

      assert.deepEqual(
        gen.next({Hash: 'HASH'}).value,
        generateTreeFactorySignature({
          wallet: mockWallet,
          magic: mockMagic as any,
          method: TreeFactoryMethods.UpdateTree,
          config: mockConfig,
          requestParams: {
            countryCode: 0,
            birthDate: currentTimestamp1,
            treeId: Number(mockAssignedJourneyWithDraftId.treeIdToPlant),
            nonce: +mockProfile?.plantingNonce!,
            treeSpecs: JSON.stringify(jsonData),
          },
        }),
        'should generate signature',
      );
      assert.deepEqual(
        gen.next('signature').value,
        put(
          assignedTreeActions.load({
            birthDate: currentTimestamp1,
            treeId: Number(mockAssignedJourneyWithDraftId.treeIdToPlant),
            treeSpecs: 'HASH',
            treeSpecsJSON: JSON.stringify(jsonData),
            signature: 'signature',
          }),
        ),
        'should dispatch updateTree',
      );
      assert.deepEqual(
        gen.next().value,
        take(assignedTreeActionTypes.loadSuccess),
        'should wait to assignedTree request success response',
      );

      assert.deepEqual(
        gen.next().value,
        put(assignedTreesActions.load()),
        'should dispatch assignedTreesActions load action',
      );
      assert.deepEqual(
        gen.next().value,
        take([assignedTreesActionTypes.loadSuccess, assignedTreesActionTypes.loadFailure]),
        'should wait for the result of the assignedTreesActions load action',
      );
      assert.deepEqual(
        gen.next().value,
        put(pendingTreeIdsActions.load()),
        'should dispatch pendingTreeIdsActions load action',
      );
      assert.deepEqual(
        gen.next().value,
        take([pendingTreeIdsActionTypes.loadSuccess, pendingTreeIdsActionTypes.loadFailure]),
        'should wait for the result of the pendingTreeIdsActions load action',
      );
      assert.deepEqual(
        gen.next(mockAssignedJourneyWithDraftId).value,
        showSagaAlert({
          title: 'success',
          message: 'submitTree.updated',
          mode: AlertMode.Success,
          alertOptions: {
            translate: true,
          },
        }),
        'should show alert',
      );
      assert.deepEqual(
        gen.next().value,
        put(removeDraftedJourney({id: mockAssignedJourneyWithDraftId.draftId})),
        'should remove drafted tree item',
      );
      assert.deepEqual(gen.next().value, put(clearJourney()), 'should clear current journey data');
      assert.deepEqual(gen.next().value, put(profileActions.load()), 'should dispatch profileAction.load');
    });
    it('assigned tree without draftId', () => {
      const gen = watchSubmitJourney();

      assert.deepEqual(gen.next().value, select(getCurrentJourney), 'should select current journey');
      assert.deepEqual(gen.next(mockAssignedJourneyWithoutDraftId).value, select(getProfile), 'should select profile');
      assert.deepEqual(
        gen.next({...mockProfile, ...mockAssignedJourneyWithoutDraftId}).value,
        select(getMagic),
        'should select magic',
      );
      assert.deepEqual(
        gen.next({...mockAssignedJourneyWithoutDraftId, ...mockProfile, ...mockMagic}).value,
        select(getConfig),
        'should select config',
      );
      assert.deepEqual(
        gen.next({
          ...mockAssignedJourneyWithoutDraftId,
          ...mockProfile,
          ...mockConfig,
          ...mockMagic,
          wallet: mockWallet,
        }).value,
        select(getWallet),
        'should select wallet',
      );
      assert.deepEqual(
        gen.next({...mockPlantJourneyWithDraftId, ...mockProfile, ...mockConfig, ...mockMagic, wallet: mockWallet})
          .value,
        select(getNetInfo),
        'should select netInfo',
      );

      const selectedData = {
        ...mockAssignedJourneyWithoutDraftId,
        ...mockProfile,
        ...mockConfig,
        ...mockMagic,
        wallet: mockWallet,
      };

      assert.deepEqual(
        gen.next(selectedData).value,
        put(
          treeDetailsActions.load({id: mockAssignedJourneyWithoutDraftId.treeIdToPlant as string, inSubmission: true}),
        ),
        'should dispatch treeDetail (get tree detail)',
      );

      const updatedTreeDetail = {
        ...treeDetail,
        treeSpecsEntity: {
          ...treeDetail.treeSpecsEntity,
          updates: JSON.stringify(treeDetail.treeSpecsEntity.updates),
          locations: JSON.stringify(treeDetail.treeSpecsEntity.locations),
          attributes: JSON.stringify(treeDetail.treeSpecsEntity.attributes),
        },
      };

      assert.deepEqual(
        gen.next({payload: updatedTreeDetail}).value,
        take([treeDetailsActionTypes.loadSuccess, treeDetailsActionTypes.loadFailure]),
        'should wait to get tree detail',
      );

      assert.deepEqual(gen.next({payload: updatedTreeDetail}).value, updatedTreeDetail);

      assert.deepEqual(
        gen.next({...updatedTreeDetail, ...selectedData}).value,
        upload(mockConfig.ipfsPostURL, 'storage://file'),
        'should upload file and receive uploadData',
      );

      const jsonData = assignedTreeJSON(mockConfig.ipfsGetURL, {
        journey: mockAssignedJourneyWithoutDraftId as any,
        tree: updatedTreeDetail as any,
        photoUploadHash: 'https://www.file.com',
      });

      assert.deepEqual(
        gen.next({...updatedTreeDetail, ...selectedData, Hash: 'https://www.file.com'}).value,
        assignedTreeJSON(mockConfig.ipfsGetURL, {
          journey: mockAssignedJourneyWithoutDraftId as any,
          tree: updatedTreeDetail as any,
          photoUploadHash: 'https://www.file.com',
        }),
        'should execute treeSpecs',
      );

      assert.deepEqual(
        gen.next(jsonData).value,
        uploadContent(mockConfig.ipfsPostURL, JSON.stringify(jsonData)),
        'should upload treeSpecs to IPFS',
      );

      const currentTimestamp1 = currentTimestamp();

      assert.deepEqual(
        gen.next({Hash: 'HASH'}).value,
        generateTreeFactorySignature({
          wallet: mockWallet,
          magic: mockMagic as any,
          method: TreeFactoryMethods.UpdateTree,
          config: mockConfig,
          requestParams: {
            countryCode: 0,
            birthDate: currentTimestamp1,
            treeId: Number(mockAssignedJourneyWithoutDraftId.treeIdToPlant),
            nonce: +mockProfile?.plantingNonce!,
            treeSpecs: JSON.stringify(jsonData),
          },
        }),
        'should generate signature',
      );
      assert.deepEqual(
        gen.next('signature').value,
        put(
          assignedTreeActions.load({
            birthDate: currentTimestamp1,
            treeId: Number(mockAssignedJourneyWithoutDraftId.treeIdToPlant),
            treeSpecs: 'HASH',
            treeSpecsJSON: JSON.stringify(jsonData),
            signature: 'signature',
          }),
        ),
        'should dispatch updateTree',
      );
      assert.deepEqual(
        gen.next().value,
        take(assignedTreeActionTypes.loadSuccess),
        'should wait to assignedTree request success response',
      );

      assert.deepEqual(
        gen.next().value,
        put(assignedTreesActions.load()),
        'should dispatch assignedTreesActions load action',
      );
      assert.deepEqual(
        gen.next().value,
        take([assignedTreesActionTypes.loadSuccess, assignedTreesActionTypes.loadFailure]),
        'should wait for the result of the assignedTreesActions load action',
      );
      assert.deepEqual(
        gen.next().value,
        put(pendingTreeIdsActions.load()),
        'should dispatch pendingTreeIdsActions load action',
      );
      assert.deepEqual(
        gen.next().value,
        take([pendingTreeIdsActionTypes.loadSuccess, pendingTreeIdsActionTypes.loadFailure]),
        'should wait for the result of the pendingTreeIdsActions load action',
      );

      assert.deepEqual(
        gen.next(mockAssignedJourneyWithoutDraftId).value,
        showSagaAlert({
          title: 'success',
          message: 'submitTree.updated',
          mode: AlertMode.Success,
          alertOptions: {
            translate: true,
          },
        }),
        'should show alert',
      );
      assert.deepEqual(gen.next().value, put(clearJourney()), 'should clear current journey data');
      assert.deepEqual(gen.next().value, put(profileActions.load()), 'should dispatch profileAction.load');
    });
    it('assigned tree without draftId in mainnet', () => {
      const gen = watchSubmitJourney();

      assert.deepEqual(gen.next().value, select(getCurrentJourney), 'should select current journey');
      assert.deepEqual(gen.next(mockAssignedJourneyWithoutDraftId).value, select(getProfile), 'should select profile');
      assert.deepEqual(
        gen.next({...mockProfile, ...mockAssignedJourneyWithoutDraftId}).value,
        select(getMagic),
        'should select magic',
      );
      assert.deepEqual(
        gen.next({...mockAssignedJourneyWithoutDraftId, ...mockProfile, ...mockMagic}).value,
        select(getConfig),
        'should select config',
      );
      assert.deepEqual(
        gen.next({
          ...mockAssignedJourneyWithoutDraftId,
          ...mockProfile,
          ...mockMainnetConfig,
          ...mockMagic,
          wallet: mockWallet,
        }).value,
        select(getWallet),
        'should select wallet',
      );
      assert.deepEqual(
        gen.next({...mockPlantJourneyWithDraftId, ...mockProfile, ...mockConfig, ...mockMagic, wallet: mockWallet})
          .value,
        select(getNetInfo),
        'should select netInfo',
      );

      const selectedData = {
        ...mockAssignedJourneyWithoutDraftId,
        ...mockProfile,
        ...mockMainnetConfig,
        ...mockMagic,
        wallet: mockWallet,
      };

      assert.deepEqual(
        gen.next(selectedData).value,
        put(
          treeDetailsActions.load({id: mockAssignedJourneyWithoutDraftId.treeIdToPlant as string, inSubmission: true}),
        ),
        'should dispatch treeDetail (get tree detail)',
      );

      const updatedTreeDetail = {
        ...treeDetail,
        treeSpecsEntity: {
          ...treeDetail.treeSpecsEntity,
          updates: JSON.stringify(treeDetail.treeSpecsEntity.updates),
          locations: JSON.stringify(treeDetail.treeSpecsEntity.locations),
          attributes: JSON.stringify(treeDetail.treeSpecsEntity.attributes),
        },
      };

      assert.deepEqual(
        gen.next({payload: updatedTreeDetail}).value,
        take([treeDetailsActionTypes.loadSuccess, treeDetailsActionTypes.loadFailure]),
        'should wait to get tree detail',
      );

      assert.deepEqual(gen.next({payload: updatedTreeDetail}).value, updatedTreeDetail);

      assert.deepEqual(
        gen.next({...updatedTreeDetail, ...selectedData}).value,
        upload(mockMainnetConfig.ipfsPostURL, 'storage://file'),
        'should upload file and receive uploadData',
      );

      const jsonData = assignedTreeJSON(mockMainnetConfig.ipfsGetURL, {
        journey: mockAssignedJourneyWithoutDraftId as any,
        tree: updatedTreeDetail as any,
        photoUploadHash: 'https://www.file.com',
      });

      assert.deepEqual(
        gen.next({...selectedData, Hash: 'https://www.file.com'}).value,
        assignedTreeJSON(mockMainnetConfig.ipfsGetURL, {
          journey: mockAssignedJourneyWithoutDraftId as any,
          tree: updatedTreeDetail as any,
          photoUploadHash: 'https://www.file.com',
        }),
        'should execute treeSpecs',
      );

      assert.deepEqual(
        gen.next(jsonData).value,
        uploadContent(mockConfig.ipfsPostURL, JSON.stringify(jsonData)),
        'should upload treeSpecs to IPFS',
      );

      const currentTimestamp1 = currentTimestamp();

      assert.deepEqual(
        gen.next({Hash: 'HASH'}).value,
        generateTreeFactorySignature({
          wallet: mockWallet,
          magic: mockMagic as any,
          method: TreeFactoryMethods.UpdateTree,
          config: mockMainnetConfig,
          requestParams: {
            countryCode: 0,
            birthDate: currentTimestamp1,
            treeId: Number(mockAssignedJourneyWithoutDraftId.treeIdToPlant),
            nonce: +mockProfile?.plantingNonce!,
            treeSpecs: JSON.stringify(jsonData),
          },
        }),
        'should generate signature',
      );
      assert.deepEqual(
        gen.next('signature').value,
        put(
          assignedTreeActions.load({
            birthDate: currentTimestamp1,
            treeId: Number(mockAssignedJourneyWithoutDraftId.treeIdToPlant),
            treeSpecs: 'HASH',
            treeSpecsJSON: JSON.stringify(jsonData),
            signature: 'signature',
          }),
        ),
        'should dispatch updateTree',
      );
      assert.deepEqual(
        gen.next().value,
        take(assignedTreeActionTypes.loadSuccess),
        'should wait to assignedTree request success response',
      );
      assert.deepEqual(
        gen.next().value,
        put(assignedTreesActions.load()),
        'should dispatch assignedTreesActions load action',
      );
      assert.deepEqual(
        gen.next().value,
        take([assignedTreesActionTypes.loadSuccess, assignedTreesActionTypes.loadFailure]),
        'should wait for the result of the assignedTreesActions load action',
      );
      assert.deepEqual(
        gen.next().value,
        put(pendingTreeIdsActions.load()),
        'should dispatch pendingTreeIdsActions load action',
      );
      assert.deepEqual(
        gen.next().value,
        take([pendingTreeIdsActionTypes.loadSuccess, pendingTreeIdsActionTypes.loadFailure]),
        'should wait for the result of the pendingTreeIdsActions load action',
      );
      assert.deepEqual(
        gen.next(mockAssignedJourneyWithoutDraftId).value,
        showSagaAlert({
          title: 'success',
          message: 'submitTree.updated',
          mode: AlertMode.Success,
          alertOptions: {
            translate: true,
          },
        }),
        'should show alert',
      );
      assert.deepEqual(gen.next().value, put(clearJourney()), 'should clear current journey data');
      assert.deepEqual(gen.next().value, put(profileActions.load()), 'should dispatch profileAction.load');
      assert.deepEqual(
        gen.next().value,
        put(changeCheckMetaData(true)),
        'should dispatch changeCheckMetaData with true arg',
      );
    });
    it('disconnected net info', () => {
      const gen = watchSubmitJourney();

      assert.deepEqual(gen.next().value, select(getCurrentJourney), 'should select current journey');
      assert.deepEqual(gen.next(mockAssignedJourneyWithoutDraftId).value, select(getProfile), 'should select profile');
      assert.deepEqual(
        gen.next({...mockProfile, ...mockAssignedJourneyWithoutDraftId}).value,
        select(getMagic),
        'should select magic',
      );
      assert.deepEqual(
        gen.next({...mockAssignedJourneyWithoutDraftId, ...mockProfile, ...mockMagic}).value,
        select(getConfig),
        'should select config',
      );
      assert.deepEqual(
        gen.next({
          ...mockAssignedJourneyWithoutDraftId,
          ...mockProfile,
          ...mockMainnetConfig,
          ...mockMagic,
          wallet: mockWallet,
        }).value,
        select(getWallet),
        'should select wallet',
      );
      assert.deepEqual(
        gen.next({...mockPlantJourneyWithDraftId, ...mockProfile, ...mockConfig, ...mockMagic, wallet: mockWallet})
          .value,
        select(getNetInfo),
        'should select netInfo',
      );
      const isConnected = false;
      assert.deepEqual(
        gen.next(isConnected).value,
        showSagaAlert({
          message: 'netInfo.filter',
          mode: AlertMode.Error,
        }),
        'should show error toast',
      );
      assert.deepEqual(gen.next().value, undefined);
    });
    it('treeDetails request error', () => {
      const gen = watchSubmitJourney();

      assert.deepEqual(gen.next().value, select(getCurrentJourney), 'should select current journey');
      assert.deepEqual(gen.next(mockUpdateJourneyWithDraftId).value, select(getProfile), 'should select profile');
      assert.deepEqual(
        gen.next({...mockProfile, ...mockUpdateJourneyWithDraftId}).value,
        select(getMagic),
        'should select magic',
      );
      assert.deepEqual(
        gen.next({...mockUpdateJourneyWithDraftId, ...mockProfile, ...mockMagic}).value,
        select(getConfig),
        'should select config',
      );
      assert.deepEqual(
        gen.next({...mockUpdateJourneyWithDraftId, ...mockProfile, ...mockConfig, ...mockMagic, wallet: mockWallet})
          .value,
        select(getWallet),
        'should select wallet',
      );
      assert.deepEqual(
        gen.next({...mockPlantJourneyWithDraftId, ...mockProfile, ...mockConfig, ...mockMagic, wallet: mockWallet})
          .value,
        select(getNetInfo),
        'should select netInfo',
      );

      const selectedData = {
        ...mockUpdateJourneyWithDraftId,
        ...mockProfile,
        ...mockConfig,
        ...mockMagic,
        wallet: mockWallet,
      };

      assert.deepEqual(
        gen.next(selectedData).value,
        put(treeDetailsActions.load({id: mockUpdateJourneyWithDraftId.treeIdToUpdate as string, inSubmission: true})),
        'should dispatch treeDetail (get tree detail)',
      );

      const errorMessage = 'error is here!';

      assert.deepEqual(
        gen.next({payload: errorMessage}).value,
        take([treeDetailsActionTypes.loadSuccess, treeDetailsActionTypes.loadFailure]),
        'should wait to get tree detail',
      );
      const error = {message: errorMessage};

      const fn = jest.fn(() => {});

      const _spy = jest.spyOn(Promise, 'reject').mockImplementation((message: string) => fn as any);

      expect(gen.next({payload: errorMessage}).value).toEqual(fn);

      assert.deepEqual(
        gen.throw(error).value,
        showSagaAlert({
          message: error.message,
          mode: AlertMode.Error,
        }),
        'should show error toast',
      );
      assert.deepEqual(
        gen.next(error).value,
        put(actionsList.setSubmitJourneyLoading(false)),
        'set submission loading false',
      );
    });
  });
  describe('watchAssignJourneyTreeLocation', () => {
    it('watchAssignJourneyTreeLocation success, without photo', () => {
      const mockNavigate = jest.fn(() => (route: Routes) => {});
      const _spy = jest.spyOn(navigation, 'navigationRef').mockImplementation(
        () =>
          ({
            navigate: mockNavigate,
          } as any),
      );
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
      gen.next();
      expect(mockNavigate).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith(Routes.SubmitTree_V2);
    });

    it('watchAssignJourneyTreeLocation success, with photo', () => {
      const mockNavigate = jest.fn(() => (route: Routes) => {});
      const _spy = jest.spyOn(navigation, 'navigationRef').mockImplementation(
        () =>
          ({
            navigate: mockNavigate,
          } as any),
      );
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
      gen.next();
      expect(mockNavigate).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith(Routes.SubmitTree_V2);
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
