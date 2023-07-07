import {put, select, take, takeEvery} from 'redux-saga/effects';
import i18next from 'i18next';
import {CommonActions} from '@react-navigation/native';

import {checkTreePhoto} from 'utilities/helpers/checkTreePhoto/checkTreePhoto';
import {AlertMode, showSagaAlert} from 'utilities/helpers/alert';
import {checkTreeLocation} from 'utilities/helpers/checkTreeLocation/checkTreeLocation';
import {generateTreeFactorySignature, TreeFactoryMethods} from 'utilities/helpers/submissionUtilsV2';
import {currentTimestamp} from 'utilities/helpers/date';
import {upload, uploadContent} from 'utilities/helpers/IPFS';
import {isWeb} from 'utilities/helpers/web';
import {NotVerifiedTreeStatus, TreeLife} from 'utilities/helpers/treeInventory';
import {assignedTreeJSON, newTreeJSON, photoToUpload, updateTreeJSON} from 'utilities/helpers/submitTree';
import {TTreeDetailRes} from 'webServices/trees/treeDetail';
import {navigationRef} from 'navigation/navigationRef';
import {Routes} from 'navigation/Navigation';
import {TReduxState} from 'ranger-redux/store';
import {plantedTreesActions, plantedTreesActionTypes} from 'ranger-redux/modules/trees/plantedTrees';
import {updatedTreesActions, updatedTreesActionTypes} from 'ranger-redux/modules/trees/updatedTrees';
import {assignedTreesActions, assignedTreesActionTypes} from 'ranger-redux/modules/trees/assignedTrees';
import {getConfig, getMagic, getWallet, TWeb3} from 'ranger-redux/modules/web3/web3';
import {treeDetailsActions, treeDetailsActionTypes} from 'ranger-redux/modules/trees/treeDetails';
import {assignedTreeActions, assignedTreeActionTypes} from 'ranger-redux/modules/submitTreeEvents/assignedTree';
import {updateTreeActions, updateTreeActionTypes} from 'ranger-redux/modules/submitTreeEvents/updateTree';
import {plantTreeActions, plantTreeActionTypes} from 'ranger-redux/modules/submitTreeEvents/plantTree';
import {removeDraftedJourney} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.action';
import {JourneyMetadata, TCurrentJourney} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';
import {BrowserPlatformState, getBrowserPlatform} from 'ranger-redux/modules/browserPlatform/browserPlatform.reducer';
import {changeCheckMetaData, getSettings, TSettings} from 'ranger-redux/modules/settings/settings';
import {getProfile, profileActions} from 'ranger-redux/modules/profile/profile';
import * as actionsList from './currentJourney.action';
import {pendingTreeIdsActions, pendingTreeIdsActionTypes} from 'ranger-redux/modules/trees/pendingTreeIds';

export const getCurrentJourney = (state: TReduxState) => state.currentJourney;

export type AssignJourneyTreePhotoAction = {
  type: string;
} & actionsList.AssignJourneyTreePhotoPayload;

export function* watchAssignJourneyTreePhoto({
  photo,
  photoLocation,
  userLocation,
  imageBase64,
  fromGallery,
}: AssignJourneyTreePhotoAction) {
  try {
    const {checkMetaData}: TSettings = yield select(getSettings);
    const {platform}: BrowserPlatformState = yield select(getBrowserPlatform);
    const journey: TCurrentJourney = yield select(getCurrentJourney);

    const photoCoords = yield checkTreePhoto({
      imageCoords: photoLocation,
      userLocation: userLocation,
      checkMetaData,
      options: {
        imageBase64,
        browserPlatform: platform,
        fromGallery,
      },
    });

    yield put(actionsList.setTreePhoto({photo, photoLocation: photoCoords}));

    if (journey.location) {
      yield checkTreeLocation({
        photoLocation: isWeb() ? photoCoords : photoLocation,
        submittedLocation: journey.location,
        checkMetaData,
        browserPlatform: platform,
        isUpdate: journey.isUpdate,
        inCheck: true,
      });
    }
  } catch (e: any) {
    if (e.data === JourneyMetadata.Location) {
      yield put(actionsList.removeJourneyLocation());
    }
    yield showSagaAlert({
      title: i18next.t(e?.title),
      mode: e?.mode,
      message: i18next.t(e?.message),
    });
  }
}

export type AssignJourneyTreeLocationAction = {
  type: string;
} & actionsList.AssignJourneyTreeLocationPayload;

export function* watchAssignJourneyTreeLocation({location}: AssignJourneyTreeLocationAction) {
  try {
    const {checkMetaData}: TSettings = yield select(getSettings);
    const {platform}: BrowserPlatformState = yield select(getBrowserPlatform);
    const {photo, photoLocation, isUpdate}: TCurrentJourney = yield select(getCurrentJourney);

    if (!photo && !photoLocation && location) {
      yield put(actionsList.setTreeLocation({coords: location}));
    } else {
      const coords = yield checkTreeLocation({
        checkMetaData,
        submittedLocation: location,
        photoLocation,
        isUpdate: !!isUpdate,
        browserPlatform: platform,
        inCheck: true,
      });
      yield put(actionsList.setTreeLocation({coords}));
    }
    //@ts-ignore
    navigationRef()?.navigate(Routes.SubmitTree_V2);
  } catch (e: any) {
    yield showSagaAlert({
      title: i18next.t(e?.title),
      mode: e?.mode,
      message: i18next.t(e?.message),
    });
  }
}

export function* watchSubmitJourney() {
  try {
    const journey = yield select(getCurrentJourney);
    const {isUpdate, treeIdToPlant, treeIdToUpdate} = journey || {};
    const profile: TReduxState['profile'] = yield select(getProfile);
    const magic: TWeb3['magic'] = yield select(getMagic);
    const config: TWeb3['config'] = yield select(getConfig);
    const wallet: string = yield select(getWallet);

    let treeDetail: TTreeDetailRes | undefined = undefined;
    if (treeIdToUpdate || treeIdToPlant) {
      yield put(treeDetailsActions.load({id: (isUpdate ? treeIdToUpdate : treeIdToPlant) as string}));
      const {payload} = yield take(treeDetailsActionTypes.loadSuccess);
      treeDetail = yield payload;
    }

    let jsonData, photoUploadResult;
    if (journey?.photo) {
      photoUploadResult = yield upload(config.ipfsPostURL, photoToUpload(journey?.photo));
    }

    if (isUpdate && treeDetail) {
      jsonData = yield updateTreeJSON(config.ipfsGetURL, {
        journey,
        tree: treeDetail,
        photoUploadHash: photoUploadResult.Hash,
      });
    } else {
      if (treeIdToPlant && treeDetail?.treeSpecsEntity != null) {
        jsonData = yield assignedTreeJSON(config.ipfsGetURL, {
          journey,
          tree: treeDetail,
          photoUploadHash: photoUploadResult.Hash,
        });
      } else {
        jsonData = yield newTreeJSON(config.ipfsGetURL, {
          journey,
          photoUploadHash: photoUploadResult.Hash,
        });
      }
    }

    const metaDataUploadResult = yield uploadContent(config.ipfsPostURL, JSON.stringify(jsonData));

    if (isUpdate && treeDetail) {
      const signature = yield generateTreeFactorySignature({
        wallet,
        magic,
        method: TreeFactoryMethods.UpdateTree,
        config,
        requestParams: {
          treeId: Number(treeIdToUpdate),
          nonce: +profile?.plantingNonce!,
          treeSpecs: metaDataUploadResult.Hash,
        },
      });
      yield put(
        updateTreeActions.load({
          signature,
          treeSpecs: metaDataUploadResult.Hash,
          treeSpecsJSON: JSON.stringify(jsonData),
          treeId: Number(treeIdToUpdate),
        }),
      );
      yield take(updateTreeActionTypes.loadSuccess);
      yield put(updatedTreesActions.load());
      yield take([updatedTreesActionTypes.loadSuccess, updatedTreesActionTypes.loadFailure]);
    } else if (treeIdToPlant && treeDetail) {
      const currentTimeStamp = currentTimestamp();
      const signature = yield generateTreeFactorySignature({
        wallet,
        magic,
        method: TreeFactoryMethods.PlantAssignTree,
        config,
        requestParams: {
          treeId: Number(treeIdToPlant),
          countryCode: 0,
          birthDate: currentTimeStamp,
          nonce: +profile?.plantingNonce!,
          treeSpecs: metaDataUploadResult.Hash,
        },
      });
      yield put(
        assignedTreeActions.load({
          signature,
          treeSpecs: metaDataUploadResult.Hash,
          treeSpecsJSON: JSON.stringify(jsonData),
          birthDate: currentTimeStamp,
          treeId: Number(treeIdToPlant),
        }),
      );
      yield take(assignedTreeActionTypes.loadSuccess);
      yield put(assignedTreesActions.load());
      yield take([assignedTreesActionTypes.loadSuccess, assignedTreesActionTypes.loadFailure]);
    } else {
      const currentTimeStamp = currentTimestamp();
      const signature = yield generateTreeFactorySignature({
        wallet,
        magic,
        method: TreeFactoryMethods.PlantTree,
        config,
        requestParams: {
          countryCode: 0,
          birthDate: currentTimeStamp,
          nonce: +profile?.plantingNonce!,
          treeSpecs: metaDataUploadResult.Hash,
        },
      });
      yield put(
        plantTreeActions.load({
          signature,
          treeSpecs: metaDataUploadResult.Hash,
          treeSpecsJSON: JSON.stringify(jsonData),
          birthDate: currentTimeStamp,
        }),
      );
      yield take(plantTreeActionTypes.loadSuccess);
      yield put(plantedTreesActions.load());
      yield take([plantedTreesActionTypes.loadSuccess, plantedTreesActionTypes.loadFailure]);
    }
    yield put(pendingTreeIdsActions.load());
    yield take([pendingTreeIdsActionTypes.loadSuccess, pendingTreeIdsActionTypes.loadFailure]);
    yield showSagaAlert({
      title: 'success',
      message: isUpdate ? 'submitTree.updated' : 'submitTree.submitted',
      mode: AlertMode.Success,
      alertOptions: {
        translate: true,
      },
    });
    navigationRef()?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: Routes.GreenBlock,
            params: {
              tabFilter: TreeLife.NotVerified,
              notVerifiedFilter: [
                isUpdate
                  ? NotVerifiedTreeStatus.Update
                  : treeIdToPlant
                  ? NotVerifiedTreeStatus.Assigned
                  : NotVerifiedTreeStatus.Plant,
              ],
            },
          },
        ],
      }),
    );
    if (journey.draftId) {
      yield put(removeDraftedJourney({id: journey.draftId}));
    }
    yield put(actionsList.clearJourney());
    yield put(profileActions.load());
    if (config.isMainnet) {
      yield put(changeCheckMetaData(true));
    }
  } catch (e: any) {
    console.log(e, 'catch in submit journey');
    yield showSagaAlert({
      message: e.message,
      mode: AlertMode.Error,
    });
    yield put(actionsList.setSubmitJourneyLoading(false));
  }
}

export function* currentJourneySagas() {
  yield takeEvery(actionsList.ASSIGN_JOURNEY_TREE_PHOTO_WATCHER, watchAssignJourneyTreePhoto);
  yield takeEvery(actionsList.ASSIGN_JOURNEY_TREE_LOCATION_WATCHER, watchAssignJourneyTreeLocation);
  yield takeEvery(actionsList.SUBMIT_JOURNEY_WATCHER, watchSubmitJourney);
}
